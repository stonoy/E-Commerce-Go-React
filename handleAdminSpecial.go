package main

import (
	"fmt"
	"math"
	"net/http"

	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

func (cfg *apiConfig) getOrdersOfAllUsers(w http.ResponseWriter, r *http.Request) {
	// get the query param -> page and other
	page := r.URL.Query().Get("page")
	time := r.URL.Query().Get("time")

	// modify the page
	pageInt, err := getInt32FromStr(page)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("can not convert page str -> int, %v", err))
		return
	}

	// get the dates
	startDate, endDate := getTheDates(time)

	// set limit and offset
	var limit int32 = 2
	offset := limit * (pageInt - 1)

	// call database
	allOrders, err := cfg.DB.GetAllOrders(r.Context(), database.GetAllOrdersParams{
		CreatedAt:   startDate,
		CreatedAt_2: endDate,
		Limit:       limit,
		Offset:      offset,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting all orders by admin: %v", err))
		return
	}

	// get orders ready...

	// create a empty slice
	finalOrdersSlice := []Order{}

	// loop through all the orders and and get the address of each order and slice of Full order product and append a modified respModel to the slice
	for _, order := range allOrders {
		// get the address of the order
		address, err := cfg.DB.GetAddressByOrder(r.Context(), order.ID)
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in getting address by order id: %v", err))
			return
		}

		// get the full order product
		fullOrderProducts, err := cfg.DB.GetFullOrderProductByOrderID(r.Context(), order.ID)
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in getting full order products by order id: %v", err))
			return
		}

		// append modified struct
		modifiedAddress := Address{
			ID:        address.ID,
			CreatedAt: address.CreatedAt,
			UpdatedAt: address.UpdatedAt,
			Name:      address.Name,
			Location:  address.Location,
			Landmark:  address.Landmark,
			City:      address.City,
			Country:   address.Country,
			Pin:       address.Pin,
			Userid:    address.Userid,
		}

		modifiedOrder := Order{
			ID:            order.ID,
			CreatedAt:     order.CreatedAt,
			UpdatedAt:     order.UpdatedAt,
			Ordertotal:    order.Ordertotal,
			Userid:        order.Userid,
			Address:       modifiedAddress,
			OrderProducts: allOrderProductToResp(fullOrderProducts),
		}

		finalOrdersSlice = append(finalOrdersSlice, modifiedOrder)
	}

	// get the total number of orders
	numOfOrders, err := cfg.DB.GetAllOrdersCount(r.Context(), database.GetAllOrdersCountParams{
		CreatedAt:   startDate,
		CreatedAt_2: endDate,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting count of orders : %v", err))
		return
	}

	type respOrder struct {
		Orders     []Order `json:"orders"`
		NumOfPages int     `json:"numOfPages"`
		Page       int     `json:"page"`
		Time       string  `json:"time"`
	}

	// send the modified reso model
	respWithJson(w, 200, respOrder{
		Orders:     finalOrdersSlice,
		NumOfPages: int(math.Ceil(float64(numOfOrders) / float64(limit))),
		Page:       int(pageInt),
		Time:       time,
	})

}

func (cfg *apiConfig) adminSpecial(w http.ResponseWriter, r *http.Request) {
	// get product visits
	productsVists, err := cfg.DB.GetVisitsOfProducts(r.Context())
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting product visits: %v", err))
		return
	}

	// get the product count available in all cart
	productsCountInCart, err := cfg.DB.GetProductCountOfCart(r.Context())
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting product count of all cart: %v", err))
		return
	}

	// get the product count available in all order
	productsCountInOrder, err := cfg.DB.GetProductCountOfOrder(r.Context())
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting product count of all order: %v", err))
		return
	}

	type stat struct {
		ProductVisits []ProductVisits `json:"product_visits"`
		CountByCart   []ProductCount  `json:"count_by_cart"`
		CountByOrder  []ProductCount  `json:"count_by_order"`
	}

	respWithJson(w, 200, stat{
		CountByCart:   allProductCountCartToResp(productsCountInCart),
		CountByOrder:  allProductCountOrderToResp(productsCountInOrder),
		ProductVisits: allProductVisitToResp(productsVists),
	})
}

func (cfg *apiConfig) checkAdmin(w http.ResponseWriter, r *http.Request) {
	type respStruct struct {
		Msg    string `json:"msg"`
		Visits int    `json:"visits"`
	}

	respWithJson(w, 200, respStruct{
		Msg:    "Welcome Admin",
		Visits: cfg.fileServerHit,
	})
}

package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

func (cfg *apiConfig) createOrder(w http.ResponseWriter, r *http.Request, user database.User) {
	// get the data
	type reqStruct struct {
		Name     string `json:"name"`
		Location string `json:"location"`
		Landmark string `json:"landmark"`
		City     string `json:"city"`
		Country  string `json:"country"`
		Pin      int32  `json:"pin"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in decoding req object: %v", err))
		return
	}

	// get user has the cart
	cart, err := cfg.DB.GetCartByUserId(r.Context(), user.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			respWithError(w, 400, "user has not created any cart")
			return
		}
		respWithError(w, 400, fmt.Sprintf("error in getting cart by user id: %v", err))
		return
	}

	// create address
	address, err := cfg.DB.CreateAddress(r.Context(), database.CreateAddressParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Name:      reqObj.Name,
		Location:  reqObj.Location,
		Landmark:  reqObj.Landmark,
		City:      reqObj.City,
		Country:   reqObj.Country,
		Pin:       reqObj.Pin,
		Userid:    user.ID,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in creating new address: %v", err))
		return
	}

	// create order
	order, err := cfg.DB.CreateOrder(r.Context(), database.CreateOrderParams{
		ID:         uuid.New(),
		CreatedAt:  time.Now().UTC(),
		UpdatedAt:  time.Now().UTC(),
		Ordertotal: cart.Chargetotal,
		Userid:     user.ID,
		Addressid:  address.ID,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in creating new order: %v", err))
		return
	}

	// take all cart product from cart id
	allCartProducts, err := cfg.DB.GetAllCartProductByCartID(r.Context(), cart.ID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting cart products by cart id: %v", err))
		return
	}

	// loop through the cart products and create same amount of order product
	for _, cartProduct := range allCartProducts {
		_, err = cfg.DB.CreateOrderProduct(r.Context(), database.CreateOrderProductParams{
			ID:        uuid.New(),
			CreatedAt: time.Now().UTC(),
			UpdatedAt: time.Now().UTC(),
			Amount:    cartProduct.Amount,
			Productid: cartProduct.Productid,
			Orderid:   order.ID,
		})
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in creating order product in loop: %v", err))
			return
		}
	}

	// delete the cart
	err = cfg.DB.DeleteCartByUserId(r.Context(), user.ID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in deleting cart by user id: %v", err))
		return
	}

	type respStruct struct {
		Order_Created bool `json:"order_created"`
	}

	// response ok
	respWithJson(w, 201, respStruct{
		Order_Created: true,
	})
}

func (cfg *apiConfig) getAllOrders(w http.ResponseWriter, r *http.Request, user database.User) {
	// get the page in queryparam
	page := r.URL.Query().Get("page")

	// modify the page
	pageInt, err := getInt32FromStr(page)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("can not convert page str -> int, %v", err))
		return
	}

	// set limit and offset
	var limit int32 = 1
	offset := limit * (pageInt - 1)

	// get all orders of the user
	allOrders, err := cfg.DB.GetAllOrderByUserID(r.Context(), database.GetAllOrderByUserIDParams{
		Userid: user.ID,
		Limit:  limit,
		Offset: offset,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting all orders by user id: %v", err))
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

	// get the total number of orders by user
	numOfOrders, err := cfg.DB.GetAllOrderCountByUserID(r.Context(), user.ID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting count of orders of a user : %v", err))
		return
	}

	type respOrder struct {
		Orders     []Order `json:"orders"`
		NumOfPages int     `json:"numOfPages"`
		Page       int     `json:"page"`
	}

	// send the modified reso model
	respWithJson(w, 200, respOrder{
		Orders:     finalOrdersSlice,
		NumOfPages: int(math.Ceil(float64(numOfOrders) / float64(limit))),
		Page:       int(pageInt),
	})
}

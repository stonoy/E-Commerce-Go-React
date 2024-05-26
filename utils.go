package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/google/uuid"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

// helper function
func (cfg *apiConfig) calculateTotal(userID, cartID uuid.UUID, r *http.Request) error {
	// loop all cartProduct and update the cart values
	var numItemsInCart int32 = 0
	var chargeTotal float64 = 0.0
	var tax float64 = 0.0
	var shipping int32 = 500
	var orderTotal int32 = 0

	// get all the products in the cartID
	cartProducts, err := cfg.DB.GetAllCartProductByCartID(r.Context(), cartID)
	if err != nil {
		return errors.New(fmt.Sprintf("error in getting cartProducts by cart id: %v", err))
	}

	for _, cartProduct := range cartProducts {
		// find the product in each cartProduct
		theProduct, err := cfg.DB.GetProductById(r.Context(), cartProduct.Productid)
		if err != nil {
			return errors.New(fmt.Sprintf("error in getting product by product id: %v", err))
		}

		orderTotal += theProduct.Price * cartProduct.Amount
		numItemsInCart += cartProduct.Amount
	}

	// calculate the rest
	tax = 0.2 * (float64(orderTotal))
	chargeTotal = float64(orderTotal) + tax + float64(shipping)

	// update the cart
	_, err = cfg.DB.UpdateCart(r.Context(), database.UpdateCartParams{
		Numitemsincart: numItemsInCart,
		Chargetotal:    chargeTotal,
		Shipping:       shipping,
		Tax:            tax,
		Ordertotal:     orderTotal,
		Userid:         userID,
	})
	if err != nil {
		return errors.New(fmt.Sprintf("error in updating cart by user id: %v", err))
	}

	return nil
}

func (cfg *apiConfig) getFilterParams(allFilterStruct []database.GetCompanyAndCategoryRow) ([]string, []string) {

	// loop through allFilter and get each data slice
	company := []string{}
	category := []string{}

	for _, filterStruct := range allFilterStruct {
		company = append(company, filterStruct.Company)
		category = append(category, filterStruct.Category)
	}

	return company, category
}

func (cfg *apiConfig) getFilterParamsAfter(afterFilterStruct []database.GetFilteredProductsComanyandCategoryRow) ([]string, []string) {

	// loop through allFilter and get each data slice
	company := []string{}
	category := []string{}

	for _, filterStruct := range afterFilterStruct {
		company = append(company, filterStruct.Company)
		category = append(category, filterStruct.Category)
	}

	return company, category
}

func getInt32FromStr(str string) (int32, error) {
	// Convert the string to an integer
	val, err := strconv.Atoi(str) // Converts to int
	if err != nil {
		return 0, fmt.Errorf("invalid integer format: %v", err)
	}

	return int32(val), nil

}

func getTheDates(timeFilter string) (time.Time, time.Time) {
	// initialize the dates
	var startDate, endDate time.Time

	switch timeFilter {
	case "today":
		start := time.Now().Truncate(24 * time.Hour)
		end := start.Add(24 * time.Hour)

		startDate, endDate = start, end
	case "this_week":
		weekDay := int(time.Now().Weekday())
		start := time.Now().AddDate(0, 0, -weekDay)
		end := time.Now().Add(7 * 24 * time.Hour)

		startDate, endDate = start, end
	case "this_month":
		monthDay := time.Now().Day() - 1
		start := time.Now().AddDate(0, 0, -monthDay)
		end := start.AddDate(0, 1, 0)

		startDate, endDate = start, end
	case "this_year":
		month := int(time.Now().Month())
		start := time.Now().AddDate(0, -month, 0)
		end := start.AddDate(1, 0, 0)

		startDate, endDate = start, end
	default:
		startDate, endDate = time.Now().AddDate(-10, 0, 0), time.Now()

	}

	return startDate, endDate
}

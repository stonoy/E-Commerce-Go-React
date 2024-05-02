package main

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

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

func (cfg *apiConfig) getFilterParams(r *http.Request) ([]string, []string, error) {
	// get the company and category struct
	allFilterStruct, err := cfg.DB.GetCompanyAndCategory(r.Context())
	if err != nil {
		return nil, nil, errors.New(fmt.Sprintf("error in getting filter: %v", err))
	}

	// loop through allFilter and get each data slice
	company := []string{}
	category := []string{}

	for _, filterStruct := range allFilterStruct {
		company = append(company, filterStruct.Company)
		category = append(category, filterStruct.Category)
	}

	return company, category, nil
}

func getInt32FromStr(str string) (int32, error) {
	// Convert the string to an integer
	val, err := strconv.Atoi(str) // Converts to int
	if err != nil {
		return 0, fmt.Errorf("invalid integer format: %v", err)
	}

	return int32(val), nil

}

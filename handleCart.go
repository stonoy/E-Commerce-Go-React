package main

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

func (cfg *apiConfig) createCartCreateCartProduct(w http.ResponseWriter, r *http.Request, user database.User) {
	type reqStruct struct {
		Amount    int32  `json:"amount"`
		ProductID string `json:"productID"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)

	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in decoding req object: %v\n", err))
		return
	}

	// parse the productId
	parsedProductID, err := uuid.Parse(reqObj.ProductID)
	if err != nil {
		respWithError(w, 403, fmt.Sprintf("Error parsing UUID: %v\n", err))
		return
	}

	// check user already has a cart, if not create one all 0 value
	numOfCart, err := cfg.DB.GetNumOfCart(r.Context(), user.ID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting num of cart: %v\n", err))
		return
	}

	// initiate a empty Cart
	cart := database.Cart{}

	if numOfCart == 0 {
		// create a new cart
		cart, err = cfg.DB.CreateCart(r.Context(), database.CreateCartParams{
			ID:             uuid.New(),
			CreatedAt:      time.Now().UTC(),
			UpdatedAt:      time.Now().UTC(),
			Numitemsincart: 0,
			Chargetotal:    0.0,
			Tax:            0.0,
			Shipping:       500,
			Ordertotal:     500,
			Userid:         user.ID,
		})
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in creating num of cart: %v\n", err))
			return
		}
	} else {
		// get the cart of the user
		cart, err = cfg.DB.GetCartByUserId(r.Context(), user.ID)
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in getting cart by user id: %v\n", err))
			return
		}
	}

	// use the cart id and reqObj values to create new cartProduct
	_, err = cfg.DB.CreateCartProduct(r.Context(), database.CreateCartProductParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Amount:    reqObj.Amount,
		Productid: parsedProductID,
		Cartid:    cart.ID,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in creating new cartProduct: %v\n", err))
		return
	}

	// calculate/update the cart values
	err = cfg.calculateTotal(user.ID, cart.ID, r)

	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error: %v", err))
		return
	}

	// response with 201
	type respStruct struct {
		CartUpdated bool `json:"cart_updated"`
	}

	respWithJson(w, 201, respStruct{
		CartUpdated: true,
	})
}

func (cfg *apiConfig) getCartData(w http.ResponseWriter, r *http.Request, user database.User) {
	// get the cart
	cart, err := cfg.DB.GetCartByUserId(r.Context(), user.ID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			respWithJson(w, 200, struct{}{})
		} else {
			respWithError(w, 400, fmt.Sprintf("error in getting cart by user id: %v", err))
		}

		return
	}

	// get the products in the specified cart || if the cart contains no cart product this return empty slice
	fullProducts, err := cfg.DB.GetFullCartProductByCartId(r.Context(), cart.ID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting full products by cart id: %v", err))
		return
	}

	respWithJson(w, 200, Cart{
		ID:             cart.ID,
		CreatedAt:      cart.CreatedAt,
		UpdatedAt:      cart.UpdatedAt,
		CartItems:      allCartProductToResp(fullProducts),
		Numitemsincart: cart.Numitemsincart,
		Chargetotal:    cart.Chargetotal,
		Tax:            cart.Tax,
		Ordertotal:     cart.Ordertotal,
		Shipping:       cart.Shipping,
		Userid:         cart.Userid,
	})
}

func (cfg *apiConfig) deleteCart(w http.ResponseWriter, r *http.Request, user database.User) {
	// delete the cart
	err := cfg.DB.DeleteCartByUserId(r.Context(), user.ID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in deleting the cart by user id: %v", err))
		return
	}

	type respStruct struct {
		Cart_Deleted bool `json:"cart_deleted"`
	}

	respWithJson(w, 200, respStruct{
		Cart_Deleted: true,
	})
}

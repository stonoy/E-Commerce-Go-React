package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/google/uuid"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

func (cfg *apiConfig) updateCarProduct(w http.ResponseWriter, r *http.Request, user database.User) {
	type reqStruct struct {
		Type string `json:"type"`
		Id   string `json:"id"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)

	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in decoding req object: %v\n", err))
		return
	}

	// parse id -> str to uuid
	parsedID, err := uuid.Parse(reqObj.Id)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error parsing UUID: %v\n", err))
		return
	}

	// check user has the product in his cart
	userHasTheProduct, err := cfg.DB.DoesUserHasProductInCart(r.Context(), database.DoesUserHasProductInCartParams{
		ID:   user.ID,
		ID_2: parsedID,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Errr in checking relation between userid and cartproductid: %v", err))
		return
	}

	if !userHasTheProduct {
		respWithError(w, 403, "user has not added the product in cart")
		return
	}

	// set cartProduct increase or decrease
	var setAmount int32 = 1

	if reqObj.Type == "minus" {
		setAmount = -1
	}

	// update the cartProduct according to the type
	cartProduct, err := cfg.DB.UpdateCartProduct(r.Context(), database.UpdateCartProductParams{
		Amount: setAmount,
		ID:     parsedID,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Error updating cartProduct: %v", err))
		return
	}

	// calculate/update the cart values
	err = cfg.calculateTotal(user.ID, cartProduct.Cartid, r)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error: %v", err))
		return
	}

	// response ok
	type respStruct struct {
		Cart_Product_Updated bool `json:"cart_product_updated"`
	}

	respWithJson(w, 201, respStruct{
		Cart_Product_Updated: true,
	})

}

func (cfg *apiConfig) deleteCartProduct(w http.ResponseWriter, r *http.Request, user database.User) {
	// get the url param
	cartProductIdString := chi.URLParam(r, "cartProductID")

	// parse the id
	parsedID, err := uuid.Parse(cartProductIdString)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("can not parse cart product id: %v", err))
		return
	}

	// check user has the product in his cart
	userHasTheProduct, err := cfg.DB.DoesUserHasProductInCart(r.Context(), database.DoesUserHasProductInCartParams{
		ID:   user.ID,
		ID_2: parsedID,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Errr in checking relation between userid and cartproductid: %v", err))
		return
	}

	if !userHasTheProduct {
		respWithError(w, 403, "user has not added the product in cart")
		return
	}

	// delete the cart product
	err = cfg.DB.DeleteCartProduct(r.Context(), parsedID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Errr in deleting cart product: %v", err))
		return
	}

	// get the cart
	cart, err := cfg.DB.GetCartByUserId(r.Context(), user.ID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("Errr in getting the cart by user id: %v", err))
		return
	}

	// update the cart -> calculate total
	err = cfg.calculateTotal(user.ID, cart.ID, r)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("err : %v", err))
		return
	}

	type respStruct struct {
		CartProduct_Deleted bool `json:"cart_product_deleted"`
	}

	// send response
	respWithJson(w, 200, respStruct{
		CartProduct_Deleted: true,
	})
}

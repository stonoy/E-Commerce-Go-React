package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

func (cfg *apiConfig) createProduct(w http.ResponseWriter, r *http.Request) {
	type reqStruct struct {
		Name        string `json:"name"`
		Price       int32  `json:"price"`
		Image       string `json:"image"`
		Description string `json:"description"`
		Company     string `json:"company"`
		Category    string `json:"category"`
		Featured    bool   `json:"featured"`
		Shipping    bool   `json:"shipping"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)

	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in decoding req object: %v\n", err))
		return
	}

	// can check all feilds are empty before calling DB function
	// ...

	product, err := cfg.DB.CreateProduct(r.Context(), database.CreateProductParams{
		ID:          uuid.New(),
		CreatedAt:   time.Now().UTC(),
		UpdatedAt:   time.Now().UTC(),
		Name:        reqObj.Name,
		Price:       reqObj.Price,
		Image:       reqObj.Image,
		Description: reqObj.Description,
		Category:    reqObj.Category,
		Company:     reqObj.Company,
		Featured:    reqObj.Featured,
		Shipping:    reqObj.Shipping,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in creating a new product : %v", err))
		return
	}

	respWithJson(w, 201, Product{
		ID:          product.ID,
		CreatedAt:   product.CreatedAt,
		UpdatedAt:   product.UpdatedAt,
		Name:        product.Name,
		Price:       product.Price,
		Image:       product.Image,
		Description: product.Description,
		Category:    product.Category,
		Company:     product.Company,
		Featured:    product.Featured,
		Shipping:    product.Shipping,
	})

}

func (cfg *apiConfig) GetAllProducts(w http.ResponseWriter, r *http.Request) {
	allProduct, err := cfg.DB.GetAllProducts(r.Context())
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting all products : %v", err))
		return
	}

	respWithJson(w, 200, allProductDbToResp(allProduct))
}

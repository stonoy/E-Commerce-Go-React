package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
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
	// get the request url
	url := r.URL.String()
	if url == "/api/v1/products" {
		allProducts, err := cfg.DB.GetAllProducts(r.Context())
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in getting all products : %v", err))
			return
		}

		respWithJson(w, 200, allProductDbToResp(allProducts))
		return
	}

	// get the query params from url
	queryParams := r.URL.Query()

	featured := queryParams.Get("featured") == "true"

	if featured {
		allFeaturedProduct, err := cfg.DB.GetFeaturedProducts(r.Context())
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in getting featured products : %v", err))
			return
		}

		respWithJson(w, 200, allProductDbToResp(allFeaturedProduct))
	} else {
		// take the query params
		page := queryParams.Get("page")
		search := queryParams.Get("search")
		price := queryParams.Get("price")

		var priceInt int32 = 100000

		companies := queryParams["company"]
		categories := queryParams["category"]

		// log.Printf("page:%v, search:%v, price:%v, company:%v, category:%v", page, search, price, companies, categories)

		pageInt, err := getInt32FromStr(page)
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in converting str -> int32 of page : %v", err))
			return
		}

		if price != "" {
			priceInt, err = getInt32FromStr(price)
			if err != nil {
				respWithError(w, 400, fmt.Sprintf("error in converting str -> int32 of price : %v", err))
				return
			}
		}

		var limit int32 = 2
		offset := limit * (pageInt - 1) // where to start

		// get the filtered products
		allProduct, err := cfg.DB.GetFilteredProducts(r.Context(), database.GetFilteredProductsParams{
			Column1: companies,
			Column2: categories,
			Column3: priceInt,
			Column4: search,
			Limit:   limit,
			Offset:  offset,
		})
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in getting filtered products : %v", err))
			return
		}

		// get the num of filtered products
		numOfProducts, err := cfg.DB.GetFilteredProductsCount(r.Context(), database.GetFilteredProductsCountParams{
			Column1: companies,
			Column2: categories,
			Column3: priceInt,
			Column4: search,
		})
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("error in getting count of filtered products : %v", err))
			return
		}

		// get the filter
		comapny, category, err := cfg.getFilterParams(r)
		if err != nil {
			respWithError(w, 400, fmt.Sprintf("%v", err))
			return
		}

		// get the number of pages
		numOfPages := int(math.Ceil(float64(numOfProducts) / float64(limit)))

		type filter struct {
			Company    []string `json:"company"`
			Category   []string `json:"category"`
			NumOfPages int      `json:"numOfPages"`
			Page       int      `json:"page"`
		}

		type data struct {
			Products []Product `json:"products"`
			Meta     filter    `json:"meta"`
		}

		respData := data{
			Products: allProductDbToResp(allProduct),
			Meta: filter{
				Company:    comapny,
				Category:   category,
				NumOfPages: numOfPages,
				Page:       int(pageInt),
			},
		}

		respWithJson(w, 200, respData)
	}
}

func (cfg *apiConfig) GetSingleProduct(w http.ResponseWriter, r *http.Request) {
	// get the url param
	productIdString := chi.URLParam(r, "productID")

	// parse the id
	parsedID, err := uuid.Parse(productIdString)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("can not parse cart product id: %v", err))
		return
	}

	// get the product
	theProduct, err := cfg.DB.GetProductById(r.Context(), parsedID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting product by id: %v", err))
		return
	}

	// update the product visit
	err = cfg.DB.IncrementProductVisitById(r.Context(), parsedID)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in updating product visit by id: %v", err))
		return
	}

	respWithJson(w, 200, Product{
		ID:          theProduct.ID,
		CreatedAt:   theProduct.CreatedAt,
		UpdatedAt:   theProduct.UpdatedAt,
		Name:        theProduct.Name,
		Price:       theProduct.Price,
		Image:       theProduct.Image,
		Description: theProduct.Description,
		Category:    theProduct.Category,
		Company:     theProduct.Company,
		Featured:    theProduct.Featured,
		Shipping:    theProduct.Shipping,
	})
}

func (cfg *apiConfig) checkUserHasProductInCart(w http.ResponseWriter, r *http.Request, user database.User) {
	// get the url param
	productIdString := chi.URLParam(r, "productID")

	// parse the id
	parsedID, err := uuid.Parse(productIdString)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("can not parse cart product id: %v", err))
		return
	}

	userHasProductInCart, err := cfg.DB.DoesUserHasTheProductInCart(r.Context(), database.DoesUserHasTheProductInCartParams{
		ID:        user.ID,
		Productid: parsedID,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in checking product in cart or not using user and product id: %v", err))
		return
	}

	type respStruct struct {
		ProductInCart bool `json:"product_in_cart"`
	}

	respWithJson(w, 200, respStruct{
		ProductInCart: userHasProductInCart,
	})
}

func (cfg *apiConfig) updateProduct(w http.ResponseWriter, r *http.Request) {
	// get the url param
	productIdString := chi.URLParam(r, "productID")

	// parse the id
	parsedID, err := uuid.Parse(productIdString)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("can not parse cart product id: %v", err))
		return
	}

	// get the data from request
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
	err = decoder.Decode(&reqObj)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in parsing product details: %v", err))
		return
	}

	// update the product
	product, err := cfg.DB.UpdateProduct(r.Context(), database.UpdateProductParams{
		Name:        reqObj.Name,
		Price:       reqObj.Price,
		Image:       reqObj.Image,
		Description: reqObj.Description,
		Category:    reqObj.Category,
		Company:     reqObj.Company,
		Featured:    reqObj.Featured,
		Shipping:    reqObj.Shipping,
		ID:          parsedID,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in updating product: %v", err))
		return
	}

	// send the response
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

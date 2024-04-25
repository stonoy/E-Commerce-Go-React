package main

import (
	"time"

	"github.com/google/uuid"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Name      string    `json:"name"`
	Role      string    `json:"role"`
	Email     string    `json:"email"`
	Token     string    `json:"token"`
}

type Product struct {
	ID          uuid.UUID `json:"id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	Name        string    `json:"name"`
	Price       int32     `json:"price"`
	Image       string    `json:"image"`
	Description string    `json:"description"`
	Company     string    `json:"company"`
	Category    string    `json:"category"`
	Featured    bool      `json:"featured"`
	Shipping    bool      `json:"shipping"`
}

type CartProduct struct {
	ID        uuid.UUID `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Amount    int32     `json:"amount"`
	Cartid    uuid.UUID `json:"cartID"`
	Productid uuid.UUID `json:"productID"`
	Name      string    `json:"name"`
	Price     int32     `json:"price"`
	Company   string    `json:"company"`
	Image     string    `json:"image"`
}

type Cart struct {
	ID             uuid.UUID     `json:"id"`
	CreatedAt      time.Time     `json:"created_at"`
	UpdatedAt      time.Time     `json:"updated_at"`
	CartItems      []CartProduct `json:"cartItems"`
	Numitemsincart int32         `json:"numItemsInCart"`
	Chargetotal    float64       `json:"chargesTotal"`
	Shipping       int32         `json:"shipping"`
	Tax            float64       `json:"tax"`
	Ordertotal     int32         `json:"orderTotal"`
	Userid         uuid.UUID     `json:"userID"`
}

func allProductDbToResp(allDbProducts []database.Product) []Product {
	finalProducts := []Product{}
	for _, product := range allDbProducts {
		finalProducts = append(finalProducts, Product{
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
	return finalProducts
}

func allCartProductToResp(allDbCartProducts []database.GetFullCartProductByCartIdRow) []CartProduct {
	finalCartProducts := []CartProduct{}
	for _, cartProduct := range allDbCartProducts {
		finalCartProducts = append(finalCartProducts, CartProduct{
			ID:        cartProduct.ID,
			CreatedAt: cartProduct.CreatedAt,
			UpdatedAt: cartProduct.UpdatedAt,
			Amount:    cartProduct.Amount,
			Cartid:    cartProduct.Cartid,
			Productid: cartProduct.Productid,
			Name:      cartProduct.Name,
			Price:     cartProduct.Price,
			Company:   cartProduct.Company,
			Image:     cartProduct.Image,
		})
	}
	return finalCartProducts
}

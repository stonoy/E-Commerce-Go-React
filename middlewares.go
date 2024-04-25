package main

import (
	"fmt"
	"net/http"

	"github.com/google/uuid"
	"github.com/stonoy/E-Commerce-Go-React/auth"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

type anyValidUserFunc func(w http.ResponseWriter, r *http.Request, user database.User)

// middleware that filter out any request without a valid user
func (cfg *apiConfig) checkValidUser(anySuitableFunc anyValidUserFunc) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// extract token from request
		token, err := auth.GetTokenFromHeader(r)
		if err != nil {
			respWithError(w, 403, fmt.Sprintf("%v", err))
			return
		}

		// check token and extract user id from token
		userID, err := auth.GetDataFromToken(token, cfg.Jwt_Secret)
		if err != nil {
			respWithError(w, 403, fmt.Sprintf("user token is not valid: %v\n", err))
			return
		}

		// parse id -> str to uuid
		parsedID, err := uuid.Parse(userID)
		if err != nil {
			respWithError(w, 403, fmt.Sprintf("Error parsing UUID: %v\n", err))
			return
		}

		// find a valid user from the token
		user, err := cfg.DB.GetUserByID(r.Context(), parsedID)
		if err != nil {
			respWithError(w, 403, fmt.Sprintf("error getting user from id: %v\n", err))
			return
		}

		// call anySuitable func
		anySuitableFunc(w, r, user)
	}
}

type anyValidAdminFunc func(w http.ResponseWriter, r *http.Request)

// middleware that filter out any request without a valid admin user
func (cfg *apiConfig) onlyForAdmin(anySuitableFunc anyValidAdminFunc) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		// extract token from request
		token, err := auth.GetTokenFromHeader(r)
		if err != nil {
			respWithError(w, 403, fmt.Sprintf("%v", err))
			return
		}

		// check token and extract user id from token
		userID, err := auth.GetDataFromToken(token, cfg.Jwt_Secret)
		if err != nil {
			respWithError(w, 403, fmt.Sprintf("user token is not valid: %v\n", err))
			return
		}

		// parse id -> str to uuid
		parsedID, err := uuid.Parse(userID)
		if err != nil {
			respWithError(w, 403, fmt.Sprintf("Error parsing UUID: %v\n", err))
			return
		}

		// find a valid user from the token
		user, err := cfg.DB.GetUserByID(r.Context(), parsedID)
		if err != nil {
			respWithError(w, 403, fmt.Sprintf("error getting user from id: %v\n", err))
			return
		}

		// check user is admin or not
		if user.Role != "admin" {
			respWithError(w, 403, "admin route : not authorised")
			return
		}

		// call anySuitable func
		anySuitableFunc(w, r)
	}
}

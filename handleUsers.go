package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/stonoy/E-Commerce-Go-React/auth"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

func (cfg *apiConfig) registerUser(w http.ResponseWriter, r *http.Request) {
	type reqStruct struct {
		Name     string `json:"name"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := &reqStruct{}
	err := decoder.Decode(reqObj)

	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in decoding req object: %v", err))
		return
	}

	// check the reqObj
	if reqObj.Email == "" || reqObj.Name == "" || reqObj.Password == "" || len(reqObj.Password) < 6 {
		respWithError(w, 400, "do not provide empty credentials")
		return
	}

	// hash the password
	hash, err := auth.HashPassword(reqObj.Password)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in hashing password: %v", err))
		return
	}

	// get the role of the user
	numOfUsers, err := cfg.DB.GetUserCount(r.Context())
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in getting user count : %v", err))
		return
	}
	// set user role
	userRole := "user"

	if numOfUsers == 0 {
		userRole = "admin"
	}

	user, err := cfg.DB.CreateNewUser(r.Context(), database.CreateNewUserParams{
		ID:        uuid.New(),
		CreatedAt: time.Now().UTC(),
		UpdatedAt: time.Now().UTC(),
		Name:      reqObj.Name,
		Role:      userRole,
		Email:     reqObj.Email,
		Password:  hash,
	})
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in creating a new user : %v", err))
		return
	}

	// create new token
	token, err := auth.CreateJwtAccessToken(cfg.Jwt_Secret, user)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in creating token : %v", err))
		return
	}

	// send response with token
	respWithJson(w, 201, User{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		Name:      user.Name,
		Role:      user.Role,
		Email:     user.Email,
		Token:     token,
	})

}

func (cfg *apiConfig) loginUser(w http.ResponseWriter, r *http.Request) {
	type reqStruct struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	decoder := json.NewDecoder(r.Body)
	reqObj := reqStruct{}
	err := decoder.Decode(&reqObj)

	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in decoding req object: %v\n", err))
		return
	}

	// check the reqObj
	if reqObj.Email == "" || reqObj.Password == "" || len(reqObj.Password) < 6 {
		respWithError(w, 400, "do not provide empty credentials")
		return
	}

	// check such user exists in db
	user, err := cfg.DB.GetUserByEmail(r.Context(), reqObj.Email)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error: No such user exist %v\n", err))
		return
	}

	// check the password is matching
	isPasswordMatching := auth.IsPasswordValid(reqObj.Password, user.Password)
	if !isPasswordMatching {
		respWithError(w, 403, "password not matched")
		return
	}

	// create new token
	token, err := auth.CreateJwtAccessToken(cfg.Jwt_Secret, user)
	if err != nil {
		respWithError(w, 400, fmt.Sprintf("error in creating token : %v\n", err))
		return
	}

	// send response with token
	respWithJson(w, 201, User{
		ID:        user.ID,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
		Name:      user.Name,
		Role:      user.Role,
		Email:     user.Email,
		Token:     token,
	})

}

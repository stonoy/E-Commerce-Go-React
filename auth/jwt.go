package auth

import (
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
)

func CreateJwtAccessToken(key string, user database.User) (string, error) {
	claims := jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(12 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Issuer:    "pricetracker-access",
		Subject:   fmt.Sprintf("%v", user.ID),
	}

	// fmt.Printf("%v", user.ID)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	// fmt.Println(token)
	ss, err := token.SignedString([]byte(key))
	// fmt.Println(key)
	if err != nil {
		return "", err
	}
	return ss, nil
}

func GetDataFromToken(token, key string) (string, error) {

	tokenInterface, err := jwt.ParseWithClaims(token, &jwt.RegisteredClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})

	if err != nil {
		return "", err
	}

	if claims, ok := tokenInterface.Claims.(*jwt.RegisteredClaims); ok && tokenInterface.Valid {
		userId := claims.Subject
		// issuer := claims.Issuer
		// fmt.Printf("%T - %v \n", claims.Subject, claims.Subject)
		return userId, nil
	} else {
		return "", err
	}

}

func GetTokenFromHeader(request *http.Request) (string, error) {
	header := request.Header.Get("Authorization")

	if header == "" {
		return "", errors.New("no authorization header provided")
	}

	headerElements := strings.Fields(header)

	if len(headerElements) < 2 || headerElements[0] != "Bearer" {
		return "", errors.New("no authorization header provided")
	}

	return headerElements[1], nil
}

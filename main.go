package main

import (
	// "database/sql"
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
	// "github.com/pressly/goose/v3/database"
)

type apiConfig struct {
	fileServerHit int
	Jwt_Secret    string
	DB            *database.Queries
}

func (cfg *apiConfig) countTheHits(fileServer http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		if r.URL.Path == "/app/" {
			// log.Println(r.URL.Path)
			// log.Println("---------")
			cfg.fileServerHit += 1
		}

		fileServer.ServeHTTP(w, r)
	})
}

func main() {

	// get all the .env variables
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("problem in loading env file : %v", err)
	}

	port := os.Getenv("PORT")
	db_conn := os.Getenv("DB_CONN")
	jwt_secret := os.Getenv("JWT_SECRET")

	// enable database connection
	db, err := sql.Open("postgres", db_conn)
	if err != nil {
		log.Fatalf("Error establising db connection : %v", err)
	}

	//this works
	dbQueries := database.New(db)

	// this does not work
	// dbQueries := &database.Queries{db: db}

	// configure apiConfig
	apiCfg := &apiConfig{
		fileServerHit: 0,
		Jwt_Secret:    jwt_secret,
		DB:            dbQueries, // this works
		// DB:     dbQueries       , // but this does not work why?

	}

	// creating main router
	mainRouter := chi.NewRouter()

	// Making it cors enable
	mainRouter.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: false,
		MaxAge:           300, // Maximum value not ignored by any of major browsers
	}))

	// providing the client
	mainRouter.Handle("/app/*", apiCfg.countTheHits(http.StripPrefix("/app/", http.FileServer(http.Dir("Go")))))

	// creating another router for api endpoints
	apiRouter := chi.NewRouter()

	// Check Health
	apiRouter.Get("/checkhealth", apiCfg.checkHealth)
	apiRouter.Get("/checkerror", apiCfg.checkError)

	// user handlers
	apiRouter.Post("/register", apiCfg.registerUser)
	apiRouter.Post("/login", apiCfg.loginUser)

	// product handlers
	apiRouter.Post("/createproducts", apiCfg.onlyForAdmin(apiCfg.createProduct))
	apiRouter.Get("/products", apiCfg.GetAllProducts)
	apiRouter.Get("/product/{productID}", apiCfg.GetSingleProduct)
	apiRouter.Get("/productincart/{productID}", apiCfg.checkValidUser(apiCfg.checkUserHasProductInCart))

	// cart handlers
	apiRouter.Get("/cart", apiCfg.checkValidUser(apiCfg.getCartData))
	apiRouter.Post("/insertcartproduct", apiCfg.checkValidUser(apiCfg.createCartCreateCartProduct))
	apiRouter.Delete("/deletecart", apiCfg.checkValidUser(apiCfg.deleteCart))

	// order handlers
	apiRouter.Post("/createorder", apiCfg.checkValidUser(apiCfg.createOrder))
	apiRouter.Get("/orders", apiCfg.checkValidUser(apiCfg.getAllOrders))

	// cart product handlers
	apiRouter.Post("/updatecartproduct", apiCfg.checkValidUser(apiCfg.updateCarProduct))
	apiRouter.Delete("/deletecartproduct/{cartProductID}", apiCfg.checkValidUser(apiCfg.deleteCartProduct))

	// mount the router over main router
	mainRouter.Mount("/api/v1", apiRouter)

	// get the server struct
	server := &http.Server{
		Addr:    ":" + port,
		Handler: mainRouter,
	}

	// listen requests forever
	log.Fatal(server.ListenAndServe())
}

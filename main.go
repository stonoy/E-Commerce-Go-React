package main

import (
	// "database/sql"
	"database/sql"
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/stonoy/E-Commerce-Go-React/internal/database"
	// "github.com/pressly/goose/v3/database"
)

//go:embed dist/*
var staticFiles embed.FS

type apiConfig struct {
	fileServerHit int
	Jwt_Secret    string
	DB            *database.Queries
}

func (cfg *apiConfig) countTheHits(fileServer http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		// I want to serve the fileserver root directory for request with any url path except those js,css and png files

		if strings.HasSuffix(r.URL.Path, ".js") && strings.HasSuffix(r.URL.Path, ".css") && strings.HasSuffix(r.URL.Path, ".png") && strings.HasSuffix(r.URL.Path, ".svg") {
			r.URL.Path = "/"
			cfg.fileServerHit++
		}

		fileServer.ServeHTTP(w, r)
	})
}

func (cfg *apiConfig) clientHandler() http.Handler {
	fsys := fs.FS(staticFiles)
	contentStatic, _ := fs.Sub(fsys, "dist")
	return cfg.countTheHits(http.FileServer(http.FS(contentStatic)))

}

func main() {

	// get all the .env variables
	err := godotenv.Load()
	if err != nil {
		log.Printf("warning: assuming default configuration. .env unreadable: %v", err)
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT environment variable is not set")
	}

	jwt_secret := os.Getenv("JWT_SECRET")
	if jwt_secret == "" {
		log.Println("Jwt Secret environment variable is not set")
	}

	apiCfg := &apiConfig{
		fileServerHit: 0,
		Jwt_Secret:    jwt_secret,
	}

	// enable database connection
	db_conn := os.Getenv("DB_CONN")
	if db_conn == "" {
		log.Println("DATABASE_URL environment variable is not set")
		log.Println("Running without CRUD endpoints")
	} else {
		db, err := sql.Open("postgres", db_conn)
		if err != nil {
			log.Fatalf("Error establising db connection : %v", err)
		}

		dbQueries := database.New(db)

		// configure apiConfig
		apiCfg.DB = dbQueries
		log.Println("connected to database")
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
	apiRouter.Put("/updateproduct/{productID}", apiCfg.onlyForAdmin(apiCfg.updateProduct))
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

	// admin special
	apiRouter.Get("/checkadmin", apiCfg.onlyForAdmin(apiCfg.checkAdmin))
	apiRouter.Get("/adminspecial", apiCfg.onlyForAdmin(apiCfg.adminSpecial))
	apiRouter.Get("/adminallorders", apiCfg.onlyForAdmin(apiCfg.getOrdersOfAllUsers))

	// mount the router over main router
	mainRouter.Mount("/api/v1", apiRouter)

	// provides client
	mainRouter.Handle("/*", apiCfg.clientHandler())

	// get the server struct
	server := &http.Server{
		Addr:    ":" + port,
		Handler: mainRouter,
	}

	log.Printf("Server is listenning on port : %v", port)

	// listen requests forever
	log.Fatal(server.ListenAndServe())
}

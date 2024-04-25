package main

import (
	"encoding/json"
	"log"
	"net/http"
)

func respWithError(w http.ResponseWriter, code int, errorMsg string) {
	type respStruct struct {
		Msg string `json:"msg"`
	}

	respObj := respStruct{
		Msg: errorMsg,
	}

	if code > 499 {
		log.Fatalf("Error in Code: %v, Msg: %v", code, errorMsg)
	}

	respWithJson(w, code, respObj)
}

func respWithJson(w http.ResponseWriter, code int, respObj interface{}) {
	dat, err := json.Marshal(respObj)
	if err != nil {
		respWithError(w, 500, "can not marshal respObj")

	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(dat)
}

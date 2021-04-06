package main

import (
	"fmt"
	"log"

	"github.com/joho/godotenv"
	"github.com/mateusjbarbosa/code-delivery/simulator/application/route"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}
}

func main() {
	route := route.Route{
		ID:       "1",
		ClientID: "1",
	}
	route.LoadPositions()

	routeJson, _ := route.ExportJsonPositions()

	fmt.Println(routeJson)
}
package main

import (
	"fmt"

	"github.com/mateusjbarbosa/code-delivery/simulator/application/route"
)

func main() {
	route := route.Route{
		ID:       "1",
		ClientID: "1",
	}
	route.LoadPositions()

	routeJson, _ := route.ExportJsonPositions()

	fmt.Println(routeJson)
}

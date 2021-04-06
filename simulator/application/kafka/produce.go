package kafka

import (
	"encoding/json"
	"log"
	"os"
	"time"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/mateusjbarbosa/code-delivery/simulator/application/route"
	"github.com/mateusjbarbosa/code-delivery/simulator/infra/kafka"
)

func Produce(msg *ckafka.Message) {
	producer := kafka.NewKafkaProducer()
	route := route.NewRoute()

	json.Unmarshal(msg.Value, &route)

	route.LoadPositions()

	positions, err := route.ExportJsonPositions()
	if err != nil {
		log.Fatal("error export json positions: " + err.Error())
	}

	for _, p := range positions {
		kafka.Publish(p, os.Getenv("KafkaProduceTopic"), producer)

		time.Sleep(time.Millisecond * 500)
	}
}

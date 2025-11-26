package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var UserCollection *mongo.Collection

func Connect_DB() {
	clientOptions := options.Client().ApplyURI("mongodb+srv://OSTi:eQQyp4P3elNkQf9r@cluster0.0rfodzy.mongodb.net/fitness?retryWrites=true&w=majority&appName=Cluster0")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Println("Connected to MongoDB!")
	UserCollection = client.Database("Parasat").Collection("Users")

}

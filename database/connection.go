package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	defaultDatabaseName = "Parasat"
)

var (
	client *mongo.Client
)

func ConnectDB() error {
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		return fmt.Errorf("MONGODB_URI environment variable is not set")
	}

	databaseName := os.Getenv("MONGODB_DB")
	if databaseName == "" {
		databaseName = defaultDatabaseName
	}

	clientOptions := options.Client().ApplyURI(uri)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %w", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		return fmt.Errorf("failed to ping MongoDB: %w", err)
	}

	log.Println("Connected to MongoDB successfully!")
	return nil
}

func GetDocument(databaseName, collectionName, documentID string) (*mongo.SingleResult, error) {
	if client == nil {
		return nil, fmt.Errorf("MongoDB client is not initialized, call ConnectDB first")
	}

	collection := client.Database(databaseName).Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result := collection.FindOne(ctx, map[string]interface{}{"_id": documentID})
	return result, nil
}

func DisconnectDB() error {
	if client == nil {
		return fmt.Errorf("MongoDB client is not initialized")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	return client.Disconnect(ctx)
}

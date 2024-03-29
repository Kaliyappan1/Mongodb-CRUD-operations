const { MongoClient } = require('mongodb');
require('dotenv').config()
// MongoDB URI
const uri = process.env.URI;
// Database Name
const dbName = "kali";
// Collection Name
const collectionName = "kali";

// Function to connect to MongoDB
async function connectToDatabase() {
    const client = new MongoClient(uri);
    await client.connect();
    return client.db(dbName).collection(collectionName);
}

// Function to insert a document
async function createDocument(data) {
    const collection = await connectToDatabase();
    const result = await collection.insertOne(data);
    console.log(`Document inserted with _id: ${result.insertedId}`);
}

// Function to read all documents
async function readDocuments() {
    const collection = await connectToDatabase();
    const documents = await collection.find().toArray();
    console.log("Documents:");
    console.log(documents);
}

// Function to update a document
async function updateDocument(query, newData) {
    const collection = await connectToDatabase();
    const result = await collection.updateOne(query, { $set: newData });
    console.log(`${result.modifiedCount} document(s) updated`);
}

// Function to delete a document
async function deleteDocument(query) {
    const collection = await connectToDatabase();
    const result = await collection.deleteOne(query);
    console.log(`${result.deletedCount} document(s) deleted`);
}

// Main function to handle command-line arguments
async function main() {
    const [, , operation, ...args] = process.argv;

    switch (operation) {
        case 'create':
            await createDocument(JSON.parse(args[0]));
            break;
        case 'read':
            await readDocuments();
            break;
        case 'update':
            await updateDocument(JSON.parse(args[0]), JSON.parse(args[1]));
            break;
        case 'delete':
            await deleteDocument(JSON.parse(args[0]));
            break;
        default:
            console.log("Invalid operation. Usage: node filename.js <operation> <arguments>");
    }
}

main().catch(console.error);

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://kali:kali123@kaliyappan.8uabkqs.mongodb.net/"; // MongoDB URI
const client = new MongoClient(uri);

async function connectDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}

async function closeDB() {
    try {
        await client.close();
        console.log("Disconnected from MongoDB");
    } catch (err) {
        console.error("Error closing MongoDB connection:", err);
    }
}

async function create(kali, document) {
    try {
        const db = client.db();
        const collection = db.collection(kali);
        const result = await collection.insertOne(document);
        console.log("Document created:", result.insertedId);
    } catch (err) {
        console.error("Error creating document:", err);
    }
}

async function read(kali, query) {
    try {
        const db = client.db();
        const collection = db.collection(kali);
        const result = await collection.find(query).toArray();
        console.log("Documents found:", result);
    } catch (err) {
        console.error("Error reading document:", err);
    }
}

async function update(kali, query, update) {
    try {
        const db = client.db();
        const collection = db.collection(kali);
        const result = await collection.updateOne(query, { $set: update });
        console.log("Document updated:", result.modifiedCount);
    } catch (err) {
        console.error("Error updating document:", err);
    }
}

async function delate(kali, query) {
    try {
        const db = client.db();
        const collection = db.collection(kali);
        const result = await collection.deleteOne(query);
        console.log("Document deleted:", result.deletedCount);
    } catch (err) {
        console.error("Error deleting document:", err);
    }
}

async function main() {
    await connectDB();

    const [operation, kali, ...args] = process.argv.slice(2);

    switch (operation) {
        case 'create':
            const document = JSON.parse(args[0]);
            await create(kali, document);
            break;
        case 'read':
            const query = JSON.parse(args[0]);
            await read(kali, query);
            break;
        case 'update':
            const updateQuery = JSON.parse(args[0]);
            const updateData = JSON.parse(args[1]);
            await update(kali, updateQuery, updateData);
            break;
        case 'delete':
            const deleteQuery = JSON.parse(args[0]);
            await delate(kali, deleteQuery);
            break;
        default:
            console.log("Invalid operation");
    }

    await closeDB();
}

main().catch(console.error);

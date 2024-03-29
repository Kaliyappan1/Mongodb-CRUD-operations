const { MongoClient } = require('mongodb');

async function main() {
    const uri = "mongodb+srv://kali:kali123@kaliyappan.8uabkqs.mongodb.net/";
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Parse command-line arguments
        const [operation, ...args] = process.argv.slice(2);

        // Perform the appropriate operation based on the command-line arguments
        switch (operation) {
            case 'delete':
                await deleteListingByName(client, args[0]);
                break;
            case 'update':
                await updateListingByName(client, args[0], JSON.parse(args[1]));
                break;
            case 'find':
                await findOneListingByName(client, args[0]);
                break;
            case 'create':
                await createListing(client, JSON.parse(args[0]));
                break;
            case 'list':
                await listDatabases(client);
                break;
            default:
                console.log('Invalid operation. Usage: node filename.js operation arguments');
        }

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function deleteListingByName(client, nameOfListing) {
    const result = await client.db("kali").collection("kali")
        .deleteOne({ name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function updateListingByName(client, nameOfListing, updatedListing) {
    const result = await client.db("kali").collection("kali")
        .updateOne({ name: nameOfListing }, { $set: updatedListing });

    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("kali").collection("kali").findOne({ name: nameOfListing });

    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    } else {
        console.log(`No listings found with the name '${nameOfListing}'`);
    }
}

async function createListing(client, newListing) {
    const result = await client.db("kali").collection("kali").insertOne(newListing);
    console.log(`New listing created with the following id: ${result.insertedId}`);
}

async function listDatabases(client) {
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
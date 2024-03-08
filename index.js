const { MongoClient } = require('mongodb');

async function main(){
 
    const uri = "mongodb+srv://kali:kali123@kaliyappan.xjapsvq.mongodb.net/?retryWrites=true&w=majority";


    const client = new MongoClient(uri);

    try {
        await client.connect();

       await findOneListingByName(client, "Cazy Cottage");
       await findOneListingByName(client, "Cazy Cottage", {name: "Cazy Cottage", bedrooms:2, bathrooms: 1});

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function upsertListingByName(client, nameOfListing,updatedListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne(

        { name: nameOfListing},
        {$set: updatedListing},
        { upsert: true}
    );
    console.log(`${result.matchedCount} document matched the query criteria`);

    if (result.upsertedCount > 0) {
        console.log(`One document was inserted with the id ${result.upsertedId._id}`);
    }else {
        console.log(`${result.modifiedCount} document was/were updated`);
    }
}

async function updateListingByName(client,nameOfListing, updatedListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne(
        { name: nameOfListing},
        {$set: updatedListing}
    );
    console.log(`${result.matchedCount} document matched the query criteria`);
    console.log(` ${result.modifiedCount} document was/were updated`);
}

async function findListingsWithMinimumBedroomsBathromsAndMostRecentReviews(client,{
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms =0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
   const cursor = client.db("sample_airbnb").collection("listingsAndReviews")
   .find({
        bedrooms: {$gte:minimumNumberOfBedrooms},
        bathrooms: {$gte: minimumNumberOfBathrooms}
    })
    .sort( { last_review: -1})
    .limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found listing(s) with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms:`);
        results.forEach((result, i) => {
            date = new Date(result.last_review).toDateString();

            console.log();
            console.log(`${i + 1}. name: ${result.name}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   bedrooms: ${result.bedrooms}`);
            console.log(`   bathrooms: ${result.bathrooms}`);
            console.log(`   most recent review date: ${new Date(result.last_review).toDateString()}`);
        });
    } else {
        console.log(`No listings found with at least ${minimumNumberOfBedrooms} bedrooms and ${minimumNumberOfBathrooms} bathrooms`);
    }
}

async function findOneListingByName(client, nameOfListing){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: `Nice room in Barcelona Center`});
    if (result) {
        console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
        console.log(result);
    
    }else{
        console.log(`No lsitings found with the name '${nameOfListing}'`);
    }
}

async function createMultipleListings(client, newListings){
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(newListings);
    console.log(`${result.insertedCount} new listing(s) created following id(s):`);
    console.log(result.insertedIds);
}

async function createListing(client, newListing){
   const result =await client.db("sample_airbnb").collection("listingAndReviews").insertOne(newListing);
    console.log(`New listing created with the following id : ${result.insertedId}`);
}
async function listDatabases(client){
   const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
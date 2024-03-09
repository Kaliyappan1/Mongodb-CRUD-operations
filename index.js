const { MongoClient } = require('mongodb');
async function main(){
    
    const uri = "mongodb+srv://kali:kali123@kaliyappan.xjapsvq.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls
        await  listDatabases(client);

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};



// const {MongoClient} = require('mongodb');


// async function main(){
//     const uri = "mongodb+srv://kaliyappan1:kali123456789@cluster1.o4irqoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1"
//     const client = new MongoClient(uri);
//     try {
//         await client.connect();
//         await listDatabases(client);
//     }catch (e) {
//         console.error(e);
//     }finally {
//         await client.close();
//     }
// }
// main().catch(console.err);

// async function listDatabases(client){
//     const databasesList = await client.db().admin().listDatabases();

//     console.log("Databases:");
//     databasesList.databases.forEach( db => console.log(` - ${db.name}`));
// }
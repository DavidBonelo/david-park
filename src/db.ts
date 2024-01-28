import mongoose, { type ConnectOptions } from "mongoose";

if (process.env.MONGO_URI === undefined) {
  throw Error("Could not find MONGO_URI in your environment");
}

const uri = process.env.MONGO_URI;

const clientOptions: ConnectOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
};

export async function runDatabase(): Promise<void> {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}

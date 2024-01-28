import "dotenv/config";
import express from "express";
import { runDatabase } from "./db";

const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});

if (process.env.PORT === undefined) {
  throw Error("Could not find PORT in your environment");
}

const PORT = parseInt(process.env.PORT);
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

runDatabase().catch(console.dir);

import "dotenv/config";
import express from "express";
import { runDatabase } from "./db";
import router from "./routers";
import path from "path";

const app = express();
app.use(express.json());

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

app.use("/api", router());
app.use(express.static(path.join(__dirname, "public")));

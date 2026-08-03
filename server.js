import dotenv from "dotenv";
import express from "express";
import connectDB from "./db.js";

dotenv.config();

const app = express();
app.use(express.json());

connectDB().then(() => {
    app.listen(3000, () => console.log("Server chay o port 3000"));
}).catch(err => {
    console.error("Ket noi DB that bai: ", err);
    process.exit(1);
});
import 'dotenv/config';
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { Server } from "socket.io";
import {createServer} from "http";
import mongoose from "mongoose";
import { setIO } from './sockets/io.js';

// `socket.io` can 1 HTTP Server, khong the gan truc tiep vao `app` cua Express 
// nen phai tao httpServer khac 
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
setIO(io);

io.on("connection", (socket) => {
    socket.join("books"); // moi clients deu join room books 
});

async function testTransactionSuport(){ // transaction cung thanh cong hoac cung callback 
    const session = await mongoose.startSession();
    session.startTransaction();

    await session.abortTransaction(); // chi test session mo duoc

    session.endSession();
    console.log("Transaction support: Ok");
}

async function start(){
    await connectDB();
    await testTransactionSuport();
    httpServer.listen(process.env.PORT || 5000, () =>
        console.log(`Server dang chay o port http://localhost:${process.env.PORT || 5000}`)
    );
}

start();
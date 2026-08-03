import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import sachRoutes from './routes/sach.routes.js';

import {errorHandler} from './middleware/error.middleware.js';

export const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/sach', sachRoutes);

app.use(errorHandler); // luôn đặt sau cùng
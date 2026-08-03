import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import sachRoutes from './routes/sach.routes.js';
import docgiaRoutes from './routes/docgia.routes.js';
import nhaxuatbanRoutes from './routes/nhaxuatban.routes.js';
import muonsachRoutes from './routes/muonsach.routes.js';

import {errorHandler} from './middleware/error.middleware.js';

import path from 'path';
import { fileURLToPath } from 'url';

export const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use('/api/sach', sachRoutes);
app.use('/api/docgia', docgiaRoutes);
app.use('/api/nhaxuatban', nhaxuatbanRoutes);
app.use('/api/muon-sach', muonsachRoutes);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, '../../client/dist')));
app.get('/*splat', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'));
});

app.use(errorHandler); // luôn đặt sau cùng
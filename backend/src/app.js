import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

// import routes
import userRouter from './routes/user.routes.js';
import caseRouter from './routes/case.routes.js';

import citizenRouter from './routes/citizen.routes.js';
// declare routes
app.use("/api/users", userRouter);
app.use("/api/citizens", citizenRouter);
app.use("/api/case",caseRouter);

export { app }
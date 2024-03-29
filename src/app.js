"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const questions_1 = __importDefault(require("./routes/questions"));
const users_1 = __importDefault(require("./routes/users"));
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const http_errors_1 = __importStar(require("http-errors"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const app = (0, express_1.default)(); // app represents the server application
// the order of function definitions mimicks the order of authority for errors and shit
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: validateEnv_1.default.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60 * 60 * 1000
    },
    rolling: true,
    store: connect_mongo_1.default.create({
        mongoUrl: validateEnv_1.default.MONGO_CONNECTION_STRING
    })
}));
if (validateEnv_1.default.DEV) {
    app.use("/api/users", users_1.default); //! for build change to /users
    app.use("/api/questions", questions_1.default); //! for build change to /questions
}
else {
    app.use("/users", users_1.default); //! for build change to /users
    app.use("/questions", questions_1.default); //! for build change to /questions
}
app.use((req, res, next) => {
    console.log(req.url);
    next((0, http_errors_1.default)(404, "Endpoint not found"));
});
// Error handler
app.use((error, req, res, next) => {
    console.log(error);
    let errorMessage = "An unknown error occured";
    let statusCode = 500;
    // check if it's actually an error error and not just an instance of null
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.default = app;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const validateEnv_1 = __importDefault(require("./util/validateEnv"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const port = validateEnv_1.default.PORT; // port the server connects to
mongoose_1.default.connect(validateEnv_1.default.MONGO_CONNECTION_STRING)
    .then(() => {
    console.log("Mongoose Connection Successful!");
    app_1.default.listen(port, () => {
        console.log(`Server Started, Listening on port ${port}...`);
    });
})
    .catch((console.error));

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const questionSchema = new mongoose_1.Schema({
    question: { type: String, require: true },
    answerChoiceA: { type: String, require: true },
    answerChoiceB: { type: String, require: true },
    answerChoiceC: { type: String, require: true },
    answerChoiceD: { type: String, require: true },
    answerChoiceE: { type: String, require: true },
    correctAnswer: { type: Number, require: true },
    pageNumberStart: { type: Number, require: false },
    pageNumberEnd: { type: Number, require: false }
});
exports.default = (0, mongoose_1.model)("Question", questionSchema);

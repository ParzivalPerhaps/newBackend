"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQuestion = exports.getRandomScienceQuestion = exports.getRandomSoSciQuestion = exports.getQuestion = exports.getQuestions = void 0;
require("dotenv/config");
const question_1 = __importDefault(require("../models/question"));
const questions_json_1 = __importDefault(require("../../question_bank/social_science/questions.json"));
const getQuestions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = questions_json_1.default.questions[0];
        res.status(200).json(questions);
    }
    catch (error) {
        next(error);
    }
});
exports.getQuestions = getQuestions;
const getQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.questionId;
    try {
        const questions = questions_json_1.default.questions[0];
        res.status(200).json(questions);
    }
    catch (error) {
        next(error);
    }
});
exports.getQuestion = getQuestion;
const getRandomSoSciQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(questions_json_1.default.questions.length);
        const index = getRandomInt(0, questions_json_1.default.questions.length);
        const questions = questions_json_1.default.questions[index];
        res.status(200).json(questions);
    }
    catch (error) {
        next(error);
    }
});
exports.getRandomSoSciQuestion = getRandomSoSciQuestion;
const getRandomScienceQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(questions_json_1.default.questions.length);
        const index = getRandomInt(0, questions_json_1.default.questions.length);
        const questions = questions_json_1.default.questions[index];
        res.status(200).json(questions);
    }
    catch (error) {
        next(error);
    }
});
exports.getRandomScienceQuestion = getRandomScienceQuestion;
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}
// delete?
const createQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const question = req.body.question;
    const answerChoiceA = req.body.answerChoiceA;
    const answerChoiceB = req.body.answerChoiceB;
    const answerChoiceC = req.body.answerChoiceC;
    const answerChoiceD = req.body.answerChoiceD;
    const answerChoiceE = req.body.answerChoiceE;
    const correctAnswer = req.body.correctAnswer;
    const pageNumberStart = req.body.pageNumberStart;
    const pageNumberEnd = req.body.pageNumberEnd;
    try {
        const newQuestion = yield question_1.default.create({
            question: question,
            answerChoiceA: answerChoiceA,
            answerChoiceB: answerChoiceB,
            answerChoiceC: answerChoiceC,
            answerChoiceD: answerChoiceD,
            answerChoiceE: answerChoiceE,
            correctAnswer: correctAnswer,
            pageNumberStart: pageNumberStart,
            pageNumberEnd: pageNumberEnd
        });
        res.status(201).json(newQuestion);
    }
    catch (error) {
        next(error);
    }
});
exports.createQuestion = createQuestion;

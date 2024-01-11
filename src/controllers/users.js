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
exports.logout = exports.setUserStat = exports.getUserStats = exports.login = exports.signUp = exports.getAuthenticatedUser = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const getAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authenticatedUserId = req.session.userId;
    try {
        if (!authenticatedUserId) {
            throw (0, http_errors_1.default)(401, "Authentication failed");
        }
        const user = yield user_1.default.findById(authenticatedUserId).select("+email").exec();
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getAuthenticatedUser = getAuthenticatedUser;
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const passwordRaw = req.body.password;
    console.log("Creating new user");
    try {
        if (!username || !email || !passwordRaw) {
            throw (0, http_errors_1.default)(400, "Missing parameters");
        }
        const existingUsername = yield user_1.default.findOne({ username: username });
        if (existingUsername) {
            throw (0, http_errors_1.default)(409, "Username already exists");
        }
        const existingEmail = yield user_1.default.findOne({ email: email });
        if (existingEmail) {
            throw (0, http_errors_1.default)(409, "Email already registered. Please log in instead");
        }
        const passwordHashed = yield bcrypt_1.default.hash(passwordRaw, 10);
        const newUser = yield user_1.default.create({
            username: username,
            email: email,
            password: passwordHashed
        });
        req.session.userId = newUser._id;
        res.status(201).json(newUser);
    }
    catch (error) {
        next(error);
    }
});
exports.signUp = signUp;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username || !password) {
            throw (0, http_errors_1.default)(400, "Missing parameters");
        }
        const user = yield user_1.default.findOne({ username: username }).select("+password +email").exec();
        if (!user) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwordMatch) {
            throw (0, http_errors_1.default)(401, "Invalid credentials");
        }
        req.session.userId = user._id;
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
const getUserStats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    try {
        if (!username) {
            throw (0, http_errors_1.default)(400, "Missing parameters");
        }
        const user = yield user_1.default.findOne({ username: username }).select("+socialScienceQuestionsAnswered +socialScienceQuestionsCorrect +scienceQuestionsAnswered +scienceQuestionsCorrect +econQuestionsAnswered +econQuestionsCorrect +litQuestionsAnswered +litQuestionsCorrect +artQuestionsAnswered +artQuestionsCorrect +musicQuestionsAnswered +musicQuestionsCorrect +mathQuestionsAnswered +mathQuestionsCorrect +questionNumSetting +liveCorrectionsSetting +pageNumbersSetting").exec();
        if (!user) {
            throw (0, http_errors_1.default)(401, "Invalid username");
        }
        res.status(200).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.getUserStats = getUserStats;
const setUserStat = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
    console.log("Got set stat request");
    const stat = req.body.stat;
    const newValue = req.body.newValue;
    const username = req.body.username;
    try {
        const user = yield user_1.default.findOne({ username: username }).select("+socialScienceQuestionsAnswered +socialScienceQuestionsCorrect +scienceQuestionsAnswered +scienceQuestionsCorrect +econQuestionsAnswered +econQuestionsCorrect +litQuestionsAnswered +litQuestionsCorrect +artQuestionsAnswered +artQuestionsCorrect +musicQuestionsAnswered +musicQuestionsCorrect +mathQuestionsAnswered +mathQuestionsCorrect +questionNumSetting +liveCorrectionsSetting +pageNumbersSetting").exec();
        if (!user) {
            (0, http_errors_1.default)(401, "Invalid user");
        }
        let answeredValue;
        let correctValue;
        switch (stat) {
            case "socialScience":
                console.log("Social science");
                answeredValue = (_a = user === null || user === void 0 ? void 0 : user.socialScienceQuestionsAnswered) !== null && _a !== void 0 ? _a : 0;
                correctValue = (_b = user === null || user === void 0 ? void 0 : user.socialScienceQuestionsCorrect) !== null && _b !== void 0 ? _b : 0;
                switch (newValue) {
                    case 1:
                        // correct
                        console.log("Correct");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ socialScienceQuestionsAnswered: answeredValue + 1 }));
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ socialScienceQuestionsCorrect: correctValue + 1 }));
                        break;
                    case 0:
                        // incorrect
                        console.log("Incorrect");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ socialScienceQuestionsAnswered: answeredValue + 1 }));
                        break;
                    default:
                        break;
                }
                break;
            case "science":
                answeredValue = (_c = user === null || user === void 0 ? void 0 : user.scienceQuestionsAnswered) !== null && _c !== void 0 ? _c : 0;
                correctValue = (_d = user === null || user === void 0 ? void 0 : user.scienceQuestionsCorrect) !== null && _d !== void 0 ? _d : 0;
                switch (newValue) {
                    case 1:
                        // correct
                        console.log("Correct");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ scienceQuestionsAnswered: answeredValue + 1 }));
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ scienceQuestionsCorrect: correctValue + 1 }));
                        break;
                    case 0:
                        // incorrect
                        console.log("Incorrect");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ scienceQuestionsAnswered: answeredValue + 1 }));
                        break;
                    default:
                        break;
                }
                break;
            case "econ":
                answeredValue = (_e = user === null || user === void 0 ? void 0 : user.econQuestionsAnswered) !== null && _e !== void 0 ? _e : 0;
                correctValue = (_f = user === null || user === void 0 ? void 0 : user.econQuestionsCorrect) !== null && _f !== void 0 ? _f : 0;
                switch (newValue) {
                    case 1:
                        // correct
                        console.log("Correct");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ econQuestionsAnswered: answeredValue + 1 }));
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ econQuestionsCorrect: correctValue + 1 }));
                        break;
                    case 0:
                        // incorrect
                        console.log("Incorrect");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ econQuestionsAnswered: answeredValue + 1 }));
                        break;
                    default:
                        break;
                }
                break;
            case "lit":
                answeredValue = (_g = user === null || user === void 0 ? void 0 : user.litQuestionsAnswered) !== null && _g !== void 0 ? _g : 0;
                correctValue = (_h = user === null || user === void 0 ? void 0 : user.litQuestionsCorrect) !== null && _h !== void 0 ? _h : 0;
                switch (newValue) {
                    case 1:
                        // correct
                        console.log("Correct");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ litQuestionsAnswered: answeredValue + 1 }));
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ litQuestionsCorrect: correctValue + 1 }));
                        break;
                    case 0:
                        // incorrect
                        console.log("Incorrect");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ litQuestionsAnswered: answeredValue + 1 }));
                        break;
                    default:
                        break;
                }
                break;
            case "art":
                answeredValue = (_j = user === null || user === void 0 ? void 0 : user.artQuestionsAnswered) !== null && _j !== void 0 ? _j : 0;
                correctValue = (_k = user === null || user === void 0 ? void 0 : user.artQuestionsCorrect) !== null && _k !== void 0 ? _k : 0;
                switch (newValue) {
                    case 1:
                        // correct
                        console.log("Correct");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ artQuestionsAnswered: answeredValue + 1 }));
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ artQuestionsCorrect: correctValue + 1 }));
                        break;
                    case 0:
                        // incorrect
                        console.log("Incorrect");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ artQuestionsAnswered: answeredValue + 1 }));
                        break;
                    default:
                        break;
                }
                break;
            case "music":
                answeredValue = (_l = user === null || user === void 0 ? void 0 : user.musicQuestionsAnswered) !== null && _l !== void 0 ? _l : 0;
                correctValue = (_m = user === null || user === void 0 ? void 0 : user.musicQuestionsCorrect) !== null && _m !== void 0 ? _m : 0;
                switch (newValue) {
                    case 1:
                        // correct
                        console.log("Correct");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ musicQuestionsAnswered: answeredValue + 1 }));
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ musicQuestionsCorrect: correctValue + 1 }));
                        break;
                    case 0:
                        // incorrect
                        console.log("Incorrect");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ musicQuestionsAnswered: answeredValue + 1 }));
                        break;
                    default:
                        break;
                }
                break;
            case "math":
                answeredValue = (_o = user === null || user === void 0 ? void 0 : user.mathQuestionsAnswered) !== null && _o !== void 0 ? _o : 0;
                correctValue = (_p = user === null || user === void 0 ? void 0 : user.mathQuestionsCorrect) !== null && _p !== void 0 ? _p : 0;
                switch (newValue) {
                    case 1:
                        // correct
                        console.log("Correct");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ mathQuestionsAnswered: answeredValue + 1 }));
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ mathQuestionsCorrect: correctValue + 1 }));
                        break;
                    case 0:
                        // incorrect
                        console.log("Incorrect");
                        yield (user === null || user === void 0 ? void 0 : user.updateOne({ mathQuestionsAnswered: answeredValue + 1 }));
                        break;
                    default:
                        break;
                }
                break;
            case "questionNumSetting":
                yield (user === null || user === void 0 ? void 0 : user.updateOne({ questionNumSetting: newValue }));
                break;
            case "liveCorrectionsSetting":
                yield (user === null || user === void 0 ? void 0 : user.updateOne({ liveCorrectionsSetting: (newValue == 1) }));
                break;
            case "pageNumbersSetting":
                yield (user === null || user === void 0 ? void 0 : user.updateOne({ pageNumbersSetting: (newValue == 1) }));
                break;
            default:
                break;
        }
    }
    catch (error) {
        next(error);
    }
});
exports.setUserStat = setUserStat;
const logout = (req, res, next) => {
    req.session.destroy(error => {
        if (error) {
            next(error);
        }
        else {
            res.sendStatus(200);
        }
    });
};
exports.logout = logout;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.icons = void 0;
const activities_1 = __importDefault(require("./activities"));
const smileys_and_emotion_1 = __importDefault(require("./smileys_and_emotion"));
const people_and_body_1 = __importDefault(require("./people_and_body"));
const animals_and_nature_1 = __importDefault(require("./animals_and_nature"));
const food_and_drink_1 = __importDefault(require("./food_and_drink"));
const travel_and_places_1 = __importDefault(require("./travel_and_places"));
const objects_1 = __importDefault(require("./objects"));
const symbols_1 = __importDefault(require("./symbols"));
const flags_1 = __importDefault(require("./flags"));
const recents_1 = __importDefault(require("./recents"));
exports.icons = {
    'smileys-emotion': smileys_and_emotion_1.default,
    'people-body': people_and_body_1.default,
    'animals-nature': animals_and_nature_1.default,
    'food-drink': food_and_drink_1.default,
    'travel-places': travel_and_places_1.default,
    'activities': activities_1.default,
    'objects': objects_1.default,
    'symbols': symbols_1.default,
    'flags': flags_1.default,
    'recents': recents_1.default,
};

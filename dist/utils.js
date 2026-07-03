"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.charFromEmojiString = exports.charFromEmojiObject = exports.mightRenderAsMultiple = void 0;
exports.deepMerge = deepMerge;
exports.throttle = throttle;
const grapheme_splitter_1 = __importDefault(require("grapheme-splitter"));
const splitter = new grapheme_splitter_1.default();
const mightRenderAsMultiple = (unicodeSequence) => {
    const emoji = charFromUtf16(unicodeSequence);
    if (splitter.countGraphemes(emoji) > 1) {
        return true; // Skip emojis that render as multiple graphemes
    }
    return false;
};
exports.mightRenderAsMultiple = mightRenderAsMultiple;
const charFromUtf16 = (utf16) => String.fromCodePoint(...utf16.split('-').map((u) => parseInt(u, 16)));
const charFromEmojiObject = (obj) => charFromUtf16(obj.unified);
exports.charFromEmojiObject = charFromEmojiObject;
const emojiCache = new Map();
const charFromEmojiString = (unified) => {
    if (emojiCache.has(unified)) {
        return emojiCache.get(unified);
    }
    const result = charFromUtf16(unified);
    emojiCache.set(unified, result);
    return result;
};
exports.charFromEmojiString = charFromEmojiString;
function deepMerge(target, source) {
    const output = { ...target };
    for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            if (source[key] &&
                typeof source[key] === 'object' &&
                !Array.isArray(source[key])) {
                output[key] = deepMerge(target[key] && typeof target[key] === 'object' ? target[key] : {}, source[key]);
            }
            else {
                output[key] = source[key];
            }
        }
    }
    return output;
}
function throttle(func, delay) {
    let lastCall = 0;
    let timeoutId = null;
    let lastArgs = null;
    return function (...args) {
        const now = Date.now();
        const timeSinceLastCall = now - lastCall;
        lastArgs = args;
        if (timeSinceLastCall >= delay) {
            lastCall = now;
            func(...(lastArgs ?? undefined));
        }
        else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                func(...(lastArgs ?? []));
                timeoutId = null;
            }, delay - timeSinceLastCall);
        }
    };
}

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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_svg_1 = __importStar(require("react-native-svg"));
const Recents = (props) => (<react_native_svg_1.default width={30} height={30} fill="none" viewBox="0 0 30 30" {...props}>
    <react_native_svg_1.Path fill="currentColor" fillRule="evenodd" d="M29.588 14.603C29.531 6.583 22.985.129 14.966.186 6.946.242.492 6.789.549 14.808c.056 8.019 6.603 14.474 14.622 14.417 8.019-.057 14.474-6.603 14.417-14.622Zm-1.815.013C27.723 7.599 21.995 1.95 14.98 2 7.962 2.05 2.314 7.778 2.364 14.795c.05 7.017 5.777 12.664 12.794 12.615 7.017-.05 12.665-5.778 12.615-12.794Zm-13.314-.53 1.815-.013.008 1.191-1.815.013-.008-1.191Zm0 0L14.387 3.82l1.814-.013.081 11.457.005.624-8.47.06-.013-1.815 6.655-.047Z" clipRule="evenodd"/>
  </react_native_svg_1.default>);
exports.default = Recents;

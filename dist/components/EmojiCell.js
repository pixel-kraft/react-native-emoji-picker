"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const utils_1 = require("../utils");
const EmojiCell = ({ unified, colSize, onPress, ...other }) => {
    const touchableStyle = (0, react_1.useMemo)(() => ({
        width: colSize,
        height: colSize,
        alignItems: 'center',
        justifyContent: 'center',
    }), [colSize]);
    const textStyle = (0, react_1.useMemo)(() => ({
        color: '#FFFFFF',
        fontSize: Math.max(colSize - 12, 6),
    }), [colSize]);
    const emojiChar = (0, react_1.useMemo)(() => (0, utils_1.charFromEmojiString)(unified), [unified]);
    return (<react_native_1.TouchableOpacity activeOpacity={0.5} style={touchableStyle} onPress={onPress} {...other}>
      <react_native_1.Text style={textStyle}>{emojiChar}</react_native_1.Text>
    </react_native_1.TouchableOpacity>);
};
exports.default = (0, react_1.memo)(EmojiCell, (prevProps, nextProps) => {
    return (prevProps.unified === nextProps.unified &&
        prevProps.colSize === nextProps.colSize &&
        prevProps.onPress === nextProps.onPress);
});

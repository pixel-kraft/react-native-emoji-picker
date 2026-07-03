"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const icons_1 = require("../icons");
const constants_1 = require("../constants");
const Toolbar = ({ selectedCategory, onSelectCategory, theme, iconWidth, withRecent }) => {
    const calculatedIconWidth = iconWidth || Math.min(Math.floor((react_native_1.Dimensions.get('window').width -
        styles.toolbarContainer.paddingHorizontal * 2 -
        styles.toolbarContainer.columnGap * (Object.keys(constants_1.Categories).length - 1)) /
        Object.keys(constants_1.Categories).length), 24);
    const getCategoryIcon = (0, react_1.useCallback)((category) => {
        const Icon = icons_1.icons[category];
        return <Icon width={calculatedIconWidth} color={selectedCategory === category
                ? theme.toolbar.icon.activeColor
                : theme.toolbar.icon.defaultColor}/>;
    }, [calculatedIconWidth, selectedCategory, theme]);
    return (<react_native_1.View style={[styles.toolbarContainer, theme.toolbar.container]}>
      {constants_1.Categories.map((key, index) => ((key === 'recents' && !withRecent) ? null :
            <react_native_1.TouchableOpacity key={key} onPress={() => {
                    onSelectCategory(key, withRecent ? index : index - 1);
                }}>
            {getCategoryIcon(key)}
          </react_native_1.TouchableOpacity>))}
    </react_native_1.View>);
};
exports.default = (0, react_1.memo)(Toolbar);
const styles = react_native_1.StyleSheet.create({
    toolbarContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingVertical: 8,
        columnGap: 8,
    },
});

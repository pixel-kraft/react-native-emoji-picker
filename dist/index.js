"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const utils_1 = require("./utils");
const react_1 = require("react");
const async_storage_1 = __importDefault(require("@react-native-async-storage/async-storage"));
const constants_1 = require("./constants");
const react_native_2 = require("react-native");
const react_native_3 = require("react-native");
const react_native_section_list_get_item_layout_1 = __importDefault(require("react-native-section-list-get-item-layout"));
const theme_1 = require("./theme");
const EmojiCell_1 = __importDefault(require("./components/EmojiCell"));
const Toolbar_1 = __importDefault(require("./components/Toolbar"));
const GRID_PADDING_HORIZONTAL = 8;
const GRID_GAP = 4;
const EmojiPicker = ({ mode = 'light', columnCount = 6, onSelect, theme: customTheme, searchPlaceholder = 'Search...', toolbarProps, searchBarProps, emojiData, categoryData }) => {
    const [isReady, setIsReady] = (0, react_1.useState)(false);
    const [colSize, setColSize] = (0, react_1.useState)(0);
    const [recentEmojis, setRecentEmojis] = (0, react_1.useState)([]);
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('smileys-emotion');
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const qualifiedEmoji = (0, react_1.useMemo)(() => {
        return emojiData.map(({ hexcode, ...emoji }) => ({
            ...emoji,
            unified: hexcode.startsWith('1F') ? hexcode : `${hexcode}-FE0F`,
            non_qualified: hexcode,
        }));
    }, [emojiData]);
    const themeMode = (0, react_1.useMemo)(() => {
        if (customTheme) {
            return (0, utils_1.deepMerge)(theme_1.theme, customTheme)[mode];
        }
        return theme_1.theme[mode];
    }, [mode]);
    const sectionListRef = (0, react_1.useRef)(null);
    const onLayout = (0, react_1.useCallback)((e) => {
        const { width } = e.nativeEvent.layout;
        const newColSize = Math.floor((width - (GRID_PADDING_HORIZONTAL * 2)) / columnCount) - (GRID_GAP - .75);
        if (newColSize !== colSize) {
            setColSize(newColSize);
            setIsReady(true);
        }
    }, [colSize, columnCount]);
    const setRecentEmojiAsync = (0, react_1.useCallback)(async (emoji) => {
        try {
            const data = await async_storage_1.default.getItem(constants_1.STORAGE_KEY);
            const recentEmojis = data ? JSON.parse(data) : [];
            if (!recentEmojis.some((e) => e.unified === emoji.unified)) {
                recentEmojis.unshift(emoji);
                if (recentEmojis.length > 20) {
                    recentEmojis.pop(); // Limit to 20 recent emojis
                }
                await async_storage_1.default.setItem(constants_1.STORAGE_KEY, JSON.stringify(recentEmojis));
            }
        }
        catch (error) {
            console.error('Error saving recent emoji:', error);
        }
    }, []);
    const onEmojiPress = (0, react_1.useCallback)((emoji) => {
        onSelect((0, utils_1.charFromEmojiObject)(emoji));
        setRecentEmojiAsync(emoji);
    }, [onSelect, setRecentEmojiAsync]);
    const handleSearch = (0, react_1.useCallback)((text) => {
        setSearchQuery(text);
    }, []);
    const filterEmojiesBySearch = (0, react_1.useCallback)((text) => {
        if (!text.trim())
            return qualifiedEmoji;
        return qualifiedEmoji.filter((emoji) => emoji.label.toLowerCase().includes(text.toLowerCase()) ||
            emoji.shortcodes?.some((shortCode) => shortCode.toLowerCase().includes(text.toLowerCase())) ||
            emoji.tags?.some((tag) => tag.toLowerCase().includes(text.toLowerCase())));
    }, [qualifiedEmoji]);
    const filterRecentEmojiesBySearch = (0, react_1.useCallback)((text) => {
        if (!text.trim())
            return recentEmojis;
        return recentEmojis.filter((emoji) => emoji.label.toLowerCase().includes(text.toLowerCase()) ||
            emoji.shortcodes?.some((shortCode) => shortCode.toLowerCase().includes(text.toLowerCase())) ||
            emoji.tags?.some((tag) => tag.toLowerCase().includes(text.toLowerCase())));
    }, [recentEmojis]);
    const filteredEmojies = (0, react_1.useMemo)(() => filterEmojiesBySearch(searchQuery), [searchQuery]);
    const filteredRecentEmojies = (0, react_1.useMemo)(() => filterRecentEmojiesBySearch(searchQuery), [searchQuery, recentEmojis]);
    const sections = (0, react_1.useMemo)(() => {
        const categories = categoryData.groups.filter((group) => constants_1.Categories.includes(group.key));
        if (filteredRecentEmojies.length > 0) {
            categories.unshift({
                order: 0,
                key: 'recents',
                message: 'Recents',
            });
        }
        return categories
            .map(({ key, message, order }, index) => {
            if (key === 'recents') {
                return {
                    data: [filteredRecentEmojies],
                    key: key,
                };
            }
            return {
                title: message,
                key: key,
                data: [
                    filteredEmojies
                        .filter((emoji) => emoji.group === order)
                        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
                ],
            };
        });
    }, [filteredEmojies, filteredRecentEmojies, categoryData]);
    const _getItemLayout = (0, react_1.useCallback)((0, react_native_section_list_get_item_layout_1.default)({
        // The height of the row with rowData at the given sectionIndex and rowIndex
        getItemHeight: (rowData, sectionIndex, rowIndex) => {
            if (rowIndex !== 0) {
                return 0;
            }
            const numberOfRows = Math.ceil(rowData.length / columnCount);
            const itemHeight = numberOfRows * colSize;
            return itemHeight;
        },
        // These three properties are optional
        getSeparatorHeight: () => 0,
        getSectionHeaderHeight: () => 18 + 16,
        getSectionFooterHeight: () => 0,
    }), [colSize]);
    const onSelectCategory = (0, react_1.useCallback)((category, index) => {
        sectionListRef.current?.scrollToLocation({
            sectionIndex: index,
            itemIndex: 0,
            animated: true,
        });
        setSelectedCategory(category);
    }, [setSelectedCategory, sectionListRef.current]);
    const renderToolbar = (0, react_1.useCallback)(() => {
        return (<Toolbar_1.default selectedCategory={selectedCategory || 'recents'} onSelectCategory={onSelectCategory} withRecent={recentEmojis.length > 0} theme={themeMode} {...toolbarProps}/>);
    }, [onSelectCategory, selectedCategory, themeMode, toolbarProps, recentEmojis.length]);
    const renderSectionItem = (0, react_1.useCallback)(({ item }) => {
        return (<react_native_1.View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                columnGap: GRID_GAP,
            }}>
        {item.map((emoji) => (<EmojiCell_1.default key={emoji.unified} unified={emoji.unified} colSize={colSize} onPress={() => onEmojiPress(emoji)}/>))}
      </react_native_1.View>);
    }, [colSize, onEmojiPress]);
    const onViewableItemsChanged = (0, react_1.useCallback)((0, utils_1.throttle)(({ viewableItems }) => {
        const firstVisibleSection = viewableItems.find((item) => item.isViewable && item.section && item.index !== null);
        if (firstVisibleSection) {
            const visibleSectionDataTitle = firstVisibleSection.section.key;
            const category = categoryData.groups.find(({ key }) => visibleSectionDataTitle === key);
            if (category) {
                setSelectedCategory(category.key);
            }
        }
    }, 300), [categoryData]);
    (0, react_1.useEffect)(() => {
        async_storage_1.default.getItem(constants_1.STORAGE_KEY).then((data) => {
            if (data) {
                const recentEmojis = JSON.parse(data);
                setRecentEmojis(recentEmojis);
                setSelectedCategory('recents');
            }
        });
    }, []);
    return (<react_native_1.View style={[styles.container]} onLayout={onLayout}>
      <react_native_1.View style={[styles.searchBarContainerStyle, themeMode.searchbar.container]}>
        <react_native_2.TextInput style={[styles.searchBarTextInputStyle, themeMode.searchbar.textInput]} placeholder={searchPlaceholder} placeholderTextColor={themeMode.searchbar.placeholderColor} clearButtonMode="always" returnKeyType="done" autoCorrect={false} value={searchQuery} onChangeText={handleSearch} {...searchBarProps}/>
      </react_native_1.View>
      {isReady && (<react_native_1.SectionList getItemLayout={_getItemLayout} horizontal={false} initialNumToRender={10} onViewableItemsChanged={onViewableItemsChanged} windowSize={21} contentContainerStyle={[styles.sectionListContentContainerStyle, themeMode.flatList.container]} ref={sectionListRef} sections={sections} renderItem={renderSectionItem} keyExtractor={(item, index) => sections[index].key} stickySectionHeadersEnabled={false} renderSectionHeader={({ section }) => {
                if (section.data[0].length === 0 || section.key === 'recents') {
                    return null;
                }
                return <react_native_1.Text style={[styles.sectionHeaderStyle, themeMode.flatList.section.header]}>{section.title}</react_native_1.Text>;
            }}/>)}
      {renderToolbar()}
    </react_native_1.View>);
};
exports.default = EmojiPicker;
const styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionListContentContainerStyle: {
        flexGrow: 1,
        paddingHorizontal: GRID_PADDING_HORIZONTAL,
        paddingBottom: 86,
    },
    sectionHeaderStyle: {
        fontSize: 14,
        fontFamily: 'Inter_600SemiBold',
        lineHeight: 18,
        marginVertical: 8,
        marginLeft: 8,
    },
    searchBarContainerStyle: {
        width: '100%',
        zIndex: 1,
    },
    searchBarTextInputStyle: {
        ...react_native_3.Platform.select({
            ios: {
                height: 36,
                backgroundColor: '#E5E8E9',
            },
        }),
        paddingLeft: 8,
        borderRadius: 10,
        margin: 8,
    },
});

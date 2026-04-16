import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TextInputProps,
  ViewToken,
} from 'react-native';
import { charFromEmojiObject, deepMerge, throttle } from './utils';
import {
  Category,
  CategoryWithoutComponent,
  DeepPartial,
  Emoji,
  MessagesDataset,
  QualifiedEmoji,
} from './types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LayoutChangeEvent } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEY, Categories } from './constants';
import { TextInput } from 'react-native';
import { Platform } from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import { ModedTheme, theme } from './theme';
import EmojiCell from './components/EmojiCell';
import Toolbar, { ToolbarProps } from './components/Toolbar';

const GRID_PADDING_HORIZONTAL = 8;
const GRID_GAP = 4;


type EmojiPickerProps = {
  mode: 'light' | 'dark';
  theme?: DeepPartial<ModedTheme>;
  columnCount?: number;
  searchPlaceholder?: string;
  onSelect: (emoji: string) => void;
  toolbarProps?: Pick<ToolbarProps, 'iconWidth'>;
  searchBarProps?: Partial<TextInputProps>;
  emojiData: Emoji[];
  categoryData: MessagesDataset;
};

const EmojiPicker: React.FC<EmojiPickerProps> = ({ mode = 'light', columnCount = 6, onSelect, theme: customTheme, searchPlaceholder = 'Search...', toolbarProps, searchBarProps, emojiData, categoryData }) => {
  const [isReady, setIsReady] = useState(false);
  const [colSize, setColSize] = useState(0);
  const [recentEmojis, setRecentEmojis] = useState<QualifiedEmoji[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>('smileys-emotion');
  const [searchQuery, setSearchQuery] = useState('');

  const qualifiedEmoji = useMemo(() => {
    return emojiData.map(({ hexcode, ...emoji }) => ({
      ...emoji,
      unified: hexcode.startsWith('1F') ? hexcode : `${hexcode}-FE0F`,
      non_qualified: hexcode,
    }))
  }, [emojiData]);

  const themeMode = useMemo(() => {
    if (customTheme) {
      return deepMerge(theme, customTheme)[mode];
    }
    return theme[mode];
  }, [mode]);

  const sectionListRef = useRef<SectionList>(null);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const { width } = e.nativeEvent.layout;
      const newColSize = Math.floor((width - (GRID_PADDING_HORIZONTAL * 2)) / columnCount) - (GRID_GAP - .75);
      if (newColSize !== colSize) {
        setColSize(newColSize);
        setIsReady(true);
      }
    },
    [colSize, columnCount]
  );


  const setRecentEmojiAsync = useCallback(async (emoji: QualifiedEmoji) => {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const recentEmojis = data ? JSON.parse(data) as unknown as QualifiedEmoji[] : [];
      if (!recentEmojis.some((e) => e.unified === emoji.unified)) {
        recentEmojis.unshift(emoji);
        if (recentEmojis.length > 20) {
          recentEmojis.pop(); // Limit to 20 recent emojis
        }
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recentEmojis));
      }
    } catch (error) {
      console.error('Error saving recent emoji:', error);
    }
  }, []);

  const onEmojiPress = useCallback((emoji: QualifiedEmoji) => {
    onSelect(charFromEmojiObject(emoji));
    setRecentEmojiAsync(emoji);
  }, [onSelect, setRecentEmojiAsync]);

  const handleSearch = useCallback((text: string) => {
    setSearchQuery(text);
  }, []);

  const filterEmojiesBySearch = useCallback((text: string) => {
    if (!text.trim()) return qualifiedEmoji;
    return qualifiedEmoji.filter(
      (emoji) =>
        emoji.label.toLowerCase().includes(text.toLowerCase()) ||
        emoji.shortcodes?.some((shortCode) => shortCode.toLowerCase().includes(text.toLowerCase())) ||
        emoji.tags?.some((tag) => tag.toLowerCase().includes(text.toLowerCase())),
    );
  }, [qualifiedEmoji]);

  const filterRecentEmojiesBySearch = useCallback((text: string) => {
    if (!text.trim()) return recentEmojis;
    return recentEmojis.filter(
      (emoji) =>
        emoji.label.toLowerCase().includes(text.toLowerCase()) ||
        emoji.shortcodes?.some((shortCode) => shortCode.toLowerCase().includes(text.toLowerCase())) ||
        emoji.tags?.some((tag) => tag.toLowerCase().includes(text.toLowerCase())),
    );
  }, [recentEmojis]);

  const filteredEmojies = useMemo(() => filterEmojiesBySearch(searchQuery), [searchQuery]);
  const filteredRecentEmojies = useMemo(() => filterRecentEmojiesBySearch(searchQuery), [searchQuery, recentEmojis]);

  const sections = useMemo(() => {
    const categories: MessagesDataset['groups'] = categoryData.groups.filter((group) => Categories.includes(group.key as CategoryWithoutComponent));

    if (filteredRecentEmojies.length > 0) {
      categories.unshift({
        order: 0,
        key: 'recents',
        message: 'Recents',
      })
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

  const _getItemLayout = useCallback(
    sectionListGetItemLayout({
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
    }),
    [colSize],
  );

  const onSelectCategory = useCallback(
    (category: Category, index: number) => {
      sectionListRef.current?.scrollToLocation({
        sectionIndex: index,
        itemIndex: 0,
        animated: true,
      });

      setSelectedCategory(category);
    },
    [setSelectedCategory, sectionListRef.current],
  );

  const renderToolbar = useCallback(() => {
    return (
      <Toolbar
        selectedCategory={selectedCategory || 'recents'}
        onSelectCategory={onSelectCategory}
        withRecent={recentEmojis.length > 0}
        theme={themeMode}
        {...toolbarProps}
      />
    );
  }, [onSelectCategory, selectedCategory, themeMode, toolbarProps, recentEmojis.length]);

  const renderSectionItem = useCallback(({ item }: { item: QualifiedEmoji[] }) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          columnGap: GRID_GAP,
        }}
      >
        {item.map((emoji) => (
          <EmojiCell
            key={emoji.unified}
            unified={emoji.unified}
            colSize={colSize}
            onPress={() => onEmojiPress(emoji)}
          />
        ))}
      </View>
    );
  }, [colSize, onEmojiPress]);

  const onViewableItemsChanged = useCallback(
    throttle(
      ({ viewableItems }: { viewableItems: ViewToken<QualifiedEmoji[]>[]; changed: ViewToken<QualifiedEmoji[]>[] }) => {
        const firstVisibleSection = viewableItems.find((item) => item.isViewable && item.section && item.index !== null);
        if (firstVisibleSection) {
          const visibleSectionDataTitle = firstVisibleSection.section.key;
          const category = categoryData.groups.find(
            ({ key }) => visibleSectionDataTitle === key
          );
          if (category) {
            setSelectedCategory(category.key);
          }
        }
      },
      300
    ),
    [categoryData]
  );

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) {
        const recentEmojis = JSON.parse(data);
        setRecentEmojis(recentEmojis);
        setSelectedCategory('recents');
      }
    });
  }, []);

  return (
    <View style={[styles.container]} onLayout={onLayout}>
      <View style={[styles.searchBarContainerStyle, themeMode.searchbar.container]}>
        <TextInput
          style={[styles.searchBarTextInputStyle, themeMode.searchbar.textInput]}
          placeholder={searchPlaceholder}
          placeholderTextColor={themeMode.searchbar.placeholderColor}
          clearButtonMode="always"
          returnKeyType="done"
          autoCorrect={false}
          value={searchQuery}
          onChangeText={handleSearch}
          {...searchBarProps}
        />
      </View>
      {isReady && (
        <SectionList
          getItemLayout={
            _getItemLayout as unknown as (
              data: any[] | null,
              index: number,
            ) => { length: number; offset: number; index: number }
          }
          horizontal={false}
          initialNumToRender={10}
          onViewableItemsChanged={onViewableItemsChanged}
          windowSize={21}
          contentContainerStyle={[styles.sectionListContentContainerStyle, themeMode.flatList.container]}
          ref={sectionListRef}
          sections={sections}
          renderItem={renderSectionItem}
          keyExtractor={(item, index) => sections[index].key}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => {
            if (section.data[0].length === 0 || section.key === 'recents') {
              return null;
            }
            return <Text style={[styles.sectionHeaderStyle, themeMode.flatList.section.header]}>{section.title}</Text>;
          }}
        />
      )}
      {renderToolbar()}
    </View>
  );
};

export default EmojiPicker;

const styles = StyleSheet.create({
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
    ...Platform.select({
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

import { TextInputProps } from 'react-native';
import { DeepPartial, Emoji, MessagesDataset } from './types';
import { ModedTheme } from './theme';
import { ToolbarProps } from './components/Toolbar';
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
declare const EmojiPicker: React.FC<EmojiPickerProps>;
export default EmojiPicker;

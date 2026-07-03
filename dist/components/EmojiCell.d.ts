import { TouchableOpacityProps } from 'react-native';
type EmojiCellProps = {
    unified: string;
    colSize: number;
    onPress?: () => void;
} & TouchableOpacityProps;
declare const _default: import("react").MemoExoticComponent<({ unified, colSize, onPress, ...other }: EmojiCellProps) => import("react").JSX.Element>;
export default _default;

import { Theme } from "../theme";
import { Category } from '../types';
export type ToolbarProps = {
    withRecent?: boolean;
    theme: Theme;
    selectedCategory: Category | null;
    iconWidth?: number;
    onSelectCategory: (category: Category, index: number) => void;
};
declare const _default: import("react").MemoExoticComponent<({ selectedCategory, onSelectCategory, theme, iconWidth, withRecent }: ToolbarProps) => import("react").JSX.Element>;
export default _default;

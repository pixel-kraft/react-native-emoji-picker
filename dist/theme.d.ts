import { StyleProp, TextStyle, ViewStyle } from "react-native";
export interface Theme {
    toolbar: {
        icon: {
            defaultColor: string;
            activeColor: string;
        };
        container: StyleProp<ViewStyle>;
    };
    searchbar: {
        container?: StyleProp<ViewStyle>;
        textInput: StyleProp<TextStyle>;
        placeholderColor: string;
    };
    flatList: {
        container?: StyleProp<ViewStyle>;
        section: {
            header: StyleProp<TextStyle>;
        };
    };
}
export interface ModedTheme {
    light: Theme;
    dark: Theme;
}
export declare const theme: ModedTheme;

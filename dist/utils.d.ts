import { QualifiedEmoji } from './types';
export declare const mightRenderAsMultiple: (unicodeSequence: string) => boolean;
export declare const charFromEmojiObject: (obj: QualifiedEmoji) => string;
export declare const charFromEmojiString: (unified: string) => string;
export declare function deepMerge<T extends Record<string, any>, S extends Record<string, any>>(target: T, source: S): T & S;
export declare function throttle<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void;

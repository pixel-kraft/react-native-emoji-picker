export { CompactEmoji as Emoji, Emoticon, Shortcode } from 'emojibase';
import type { MessagesDataset as BaseMessageDataset, GroupMessage as BaseGroupMessage, GroupKey, CompactEmoji } from 'emojibase';


export interface QualifiedEmoji extends Omit<CompactEmoji, 'hexcode'> {
  unified: string;
  non_qualified: string;
}

export interface GroupMessage extends Omit<BaseGroupMessage, 'key'> {
  key: Category | 'component'; // "component" will never be displayed as category
}
export interface MessagesDataset extends Omit<BaseMessageDataset, 'groups'> {
  groups: GroupMessage[];
}

export type Category = Exclude<GroupKey, 'component'> | 'recents';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

import { Ctrl } from './ctrl';

export type Page = 'home' | 'game' | 'seek' | 'challenge' | 'tv';

export type MaybeVNodes = (string | undefined)[];
export type Renderer = (ctrl: Ctrl) => MaybeVNodes;

export interface Game {
  [key: string]: any;
}

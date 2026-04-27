import compileOneBackground from '../assets/compile-1.png';

export type DraftAction = 'PICK' | 'BAN' | 'GIVE' | 'OTHER';
export type DraftItemStatus = 'PICK' | 'BAN' | 'GIVE' | 'AVAILABLE' | 'UNAVAILABLE' | 'OTHER';
import { PiNumberZeroFill, PiNumberOneFill, PiNumberTwoFill, PiNumberThreeFill, PiNumberFourFill, PiNumberFiveFill, PiNumberSixFill } from "react-icons/pi";
import { TbPlayCardQFilled, TbPlayCard1Filled, TbPlayCard2Filled, TbPlayCard3Filled, TbPlayCard4Filled, TbPlayCard5Filled, TbPlayCard6Filled } from "react-icons/tb";
import { type IconType} from 'react-icons';

export interface DraftStep {
    player: number;
    action: DraftAction;
}
export interface DraftItem {
    id: number;
    name: string;
    status?: DraftItemStatus;
    image: string;
    x: number;
    y: number;
    flavor: string;
    info: string;
}
export const SNAKE_SEQUENCE: DraftStep[] = [
    { player: 0, action: 'PICK' },
    { player: 1, action: 'PICK' },
    { player: 1, action: 'PICK' },
    { player: 0, action: 'PICK' },
    { player: 0, action: 'PICK' },
    { player: 1, action: 'PICK' },
];

export const COMPETITIVE_SNAKE_SEQUENCE: DraftStep[] = [
    { player: 0, action: 'BAN' },
    { player: 1, action: 'BAN' },
    { player: 1, action: 'BAN' },
    { player: 0, action: 'BAN' },
    { player: 0, action: 'PICK' },
    { player: 1, action: 'PICK' },
    { player: 1, action: 'PICK' },
    { player: 0, action: 'PICK' },
    { player: 0, action: 'PICK' },
    { player: 1, action: 'PICK' },
];

export const INITIAL_POOL: DraftItem[] = [
    { id: 1, name: 'Darkness', image: compileOneBackground, x: 5, y: 11, flavor: 'An absence of light', info: 'Draw, Shift, Manipulate'},
    { id: 2, name: 'Death', image: compileOneBackground, x: 35, y: 11, flavor: 'Nothing shall survive', info: 'Delete, Draw' },
    { id: 3, name: 'Fire', image: compileOneBackground, x: 65, y: 11, flavor: 'Burn at both ends', info: 'Discard for effect' },
    { id: 4, name: 'Gravity', image: compileOneBackground, x: 95, y: 11, flavor: 'Draw ever inward', info: 'Shift, Flip, Draw' },
    { id: 5, name: 'Life', image: compileOneBackground, x: 5, y: 50, flavor: 'Bring about new growth', info: 'Flip, Top Deck Play, Draw' },
    { id: 6, name: 'Light', image: compileOneBackground, x: 35, y: 50, flavor: 'Burn away the dark', info: 'Draw, Flip, Shift' },
    { id: 7, name: 'Metal', image: compileOneBackground, x: 65, y: 50, flavor: 'Hardened against all', info: 'Prevent, Draw, Flip' },
    { id: 8, name: 'Plague', image: compileOneBackground, x: 95, y: 50, flavor: 'Slow death from within', info: 'Force Discard, Flip' },
    { id: 9, name: 'Psychic', image: compileOneBackground, x: 5, y: 89, flavor: 'Know your foe\'s mind', info: 'Draw, Manipulate, Shift' },
    { id: 10, name: 'Speed', image: compileOneBackground, x: 35, y: 89, flavor: 'Quicken with every step', info: 'Draw, Play, Shift' },
    { id: 11, name: 'Spirit', image: compileOneBackground, x: 5, y: 89, flavor: 'True strength from within', info: 'Flip, Shift, Draw' },
    { id: 12, name: 'Water', image: compileOneBackground, x: 95, y: 89, flavor: 'Wash away and renew', info: 'Return, Draw, Flip' },
    { id: 13, name: 'Love', image: compileOneBackground, x: 5, y: 11, flavor: 'Giving is the true gift', info: 'Draw, Gift, Exchange' },
    { id: 14, name: 'Hate', image: compileOneBackground, x: 35, y: 11, flavor: 'Ultimate disdain', info: 'Delete theirs and yours' },
    { id: 15, name: 'Apathy', image: compileOneBackground, x: 65, y: 11, flavor: 'Uncaring, unfeeling', info: 'Flip Face-Down' },
    { id: 16, name: 'Chaos', image: compileOneBackground, x: 95, y: 11, flavor: 'Unpredictable Beware', info: 'Draw, Rearrange, Covered' },
    { id: 17, name: 'Clarity', image: compileOneBackground, x: 5, y: 50, flavor: 'I can see my path clearly', info: 'Draw, Reveal' },
    { id: 18, name: 'Corruption', image: compileOneBackground, x: 35, y: 50, flavor: 'One bad apple spoils the bunch', info: 'Flip, Discard' },
    { id: 19, name: 'Courage', image: compileOneBackground, x: 65, y: 50, flavor: 'A blaze in the face of adversity', info: 'Draw, Compare' },
    { id: 20, name: 'Fear', image: compileOneBackground, x: 95, y: 50, flavor: 'Run away', info: 'Shift, Discard' },
    { id: 21, name: 'Ice', image: compileOneBackground, x: 5, y: 89, flavor: 'Cold, Strong, and Slick', info: 'Shift, Prevent' },
    { id: 22, name: 'Luck', image: compileOneBackground, x: 35, y: 89, flavor: 'Roll the dice', info: 'Random, Delete, Play' },
    { id: 23, name: 'Mirror', image: compileOneBackground, x: 65, y: 89, flavor: 'A Reflection of the truth', info: 'Shift, Repeat' },
    { id: 24, name: 'Peace', image: compileOneBackground, x: 95, y: 89, flavor: 'Respite and solace as long as we can', info: 'Mutual Discard, Draw' },
    { id: 25, name: 'Smoke', image: compileOneBackground, x: 5, y: 11, flavor: 'A blanket of obfuscation', info: 'Face-Down, Shift' },
    { id: 26, name: 'Time', image: compileOneBackground, x: 35, y: 11, flavor: 'Forward to the past', info: 'Discard, Trash' },
    { id: 27, name: 'War', image: compileOneBackground, x: 65, y: 11, flavor: 'Raging conflict, but to what end?', info: 'React, Discard' },
    { id: 28, name: 'Assimilation', image: compileOneBackground, x: 95, y: 11, flavor: 'Complete exchange and understanding', info: 'Exchange' },
    { id: 29, name: 'Diversity', image: compileOneBackground, x: 5, y: 50, flavor: 'Our differences are our strength', info: 'Play, Compare, Covered' },
    { id: 30, name: 'Unity', image: compileOneBackground, x: 35, y: 50, flavor: 'Together we are strong', info: 'Cover, Flip, Compile' },
];

export const PACKS= [
    { id: 1, name: 'Main 1', contains: [1,2,3,4,5,6,7,8,9,10,11,12]},
    { id: 2, name: 'Aux 1', contains: [13,14,15]},
    { id: 3, name: 'Main 2', contains: [16,17,18,19,20,21,22,23,24,25,26,27]},
    { id: 4, name: 'Aux 2', contains: [28,29,30]}
]

export const COLORS = [
    '#eb8ce2',
    '#e9a91e'
]

export const MAX_DRAFT = 3;

export const VIEWS = {
    HOME: 'home',
    STATS: 'stats',
    DRAFT: 'draft',
    CODEX: 'codex',
    PROFILE: 'profile'
};

export interface Card {
    value: number;
    top: string;
    middle: string;
    bottom: string
}
export const cards: Card[] = [
    { value: 0, top: '', middle: '', bottom: '' },
    { value: 1, top: '', middle: '', bottom: '' },
    { value: 2, top: '', middle: '', bottom: '' },
    { value: 3, top: '', middle: '', bottom: '' },
    { value: 4, top: '', middle: '', bottom: '' },
    { value: 5, top: '', middle: 'Discard 1 card', bottom: '' },
]
export const iconMap: Record<number, IconType> = {
    0: PiNumberZeroFill,
    1: PiNumberOneFill,
    2: PiNumberTwoFill,
    3: PiNumberThreeFill,
    4: PiNumberFourFill,
    5: PiNumberFiveFill,
    6: PiNumberSixFill,
}

export const iconMap2: Record<number, IconType> = {
    0: TbPlayCardQFilled,
    1: TbPlayCard1Filled,
    2: TbPlayCard2Filled,
    3: TbPlayCard3Filled,
    4: TbPlayCard4Filled,
    5: TbPlayCard5Filled,
    6: TbPlayCard6Filled,
}
import { 
    PiNumberZeroFill,
    PiNumberOneFill,
    PiNumberTwoFill,
    PiNumberThreeFill,
    PiNumberFourFill,
    PiNumberFiveFill,
    PiNumberSixFill,
    PiNumberSevenFill,
    PiNumberEightFill,
    PiNumberNineFill
} from "react-icons/pi";
import {
    TbHexagonLetterSFilled,
    TbHexagonLetterAFilled,
    TbHexagonLetterBFilled,
    TbHexagonLetterCFilled,
    TbHexagonLetterDFilled,
    TbHexagonLetterEFilled,
    TbHexagonLetterFFilled
} from "react-icons/tb";

import { type IconType } from 'react-icons';

export const MAX_DRAFT = 3;
export type DraftAction = 'PICK' | 'BAN' | 'GIVE' | 'RANDOM' | 'OTHER' | 'DRAW' | 'DISPLAY';
export type DraftItemStatus = DraftAction | 'AVAILABLE' | 'UNAVAILABLE' | 'HIDDEN';

export const TAG_OPTIONS = [
    '__errata__',
    'Delete', 'Discard', 'Draw', 'Flip', 'Give', 'Play',
    'Rearrange', 'Return', 'Reveal', 'Refresh', 'Shift',
    'Swap', 'Take', 'Compile', 'Control', 'Prevent'
] as const;

export interface DraftStep {
    player: number;
    action: DraftAction;
    count?: number;
}
export interface DraftItem extends Protocol{
    status?: DraftItemStatus;
}

export interface Pack {
    id: number;
    cycle: number;
    codename: string;
    name: string;
    contains: number[];
    released: boolean;
}

export interface Protocol {
    codename: string;
    id: number;
    name: string;
    flavor: string;
    info: string;
    cards: Card[];
}

export interface Card {
    value: number;
    tags: Tag[];
    errata?: string[]
}

export type Tag = typeof TAG_OPTIONS[number];

export interface DraftInformation {
    group: string;
    label: string;
    value: DraftStep[];
    info?: string;
}

export interface DataContextType {
    protocols: Protocol[];
    packs: Pack[];
    loading: boolean;
}


export const SNAKE_DRAFT: DraftStep[] = [
    { player: 0, action: 'DISPLAY', count: 12 },
    { player: 1, action: 'PICK' },
    { player: 2, action: 'PICK' },
    { player: 2, action: 'PICK' },
    { player: 1, action: 'PICK' },
    { player: 1, action: 'PICK' },
    { player: 2, action: 'PICK' },
];

export const REVERSE_SNAKE_DRAFT: DraftStep[] = [
    { player: 1, action: 'GIVE' },
    { player: 2, action: 'GIVE' },
    { player: 2, action: 'GIVE' },
    { player: 1, action: 'GIVE' },
    { player: 1, action: 'GIVE' },
    { player: 2, action: 'GIVE' },
];

export const RANDOM_DRAFT: DraftStep[] = [
    { player: 1, action: 'RANDOM' },
    { player: 2, action: 'RANDOM' },
    { player: 2, action: 'RANDOM' },
    { player: 1, action: 'RANDOM' },
    { player: 1, action: 'RANDOM' },
    { player: 2, action: 'RANDOM' },
]

export const COMPETITIVE_SNAKE_DRAFT: DraftStep[] = [
    { player: 0, action: 'DISPLAY', count: 12},
    { player: 1, action: 'BAN' },
    { player: 2, action: 'BAN' },
    { player: 2, action: 'BAN' },
    { player: 1, action: 'BAN' },
    { player: 1, action: 'PICK' },
    { player: 2, action: 'PICK' },
    { player: 2, action: 'PICK' },
    { player: 1, action: 'PICK' },
    { player: 1, action: 'PICK' },
    { player: 2, action: 'PICK' },
];

export const PACKS: Pack[] = [
    { id: 1, cycle: 1, codename: 'main-1', name: 'Main 1', contains: [1,2,3,4,5,6,7,8,9,10,11,12], released: true },
    { id: 2, cycle: 1, codename: 'aux-1', name: 'Aux 1', contains: [13,14,15], released: true },
    { id: 3, cycle: 2, codename: 'main-2', name: 'Main 2', contains: [16,17,18,19,20,21,22,23,24,25,26,27], released: true },
    { id: 4, cycle: 2, codename: 'aux-2', name: 'Aux 2', contains: [28,29,30], released: true },
    { id: 5, cycle: 3, codename: 'main-3', name: 'Main 3', contains: [31,32,33,34,35,36,37,38,39,40,41,42], released: false },
    { id: 6, cycle: 3, codename: 'aux-3', name: 'Aux 3', contains: [43,44,45], released: false }
]

export const VIEWS = {
    HOME: 'home',
    STATS: 'stats',
    STATS_GLOBAL: 'stats-global',
    STATS_PERSONAL: 'stats-personal',
    DRAFT: 'draft',
    DRAFT_START: 'draft-start',
    DRAFT_JOIN: 'draft-join',
    CODEX: 'codex',
    CODEX_PROTOCOLS: 'codex-protocols',
    CODEX_CARDS: 'codex-cardss',
    PROFILE: 'profile'

};

export const iconMap: Record<number, IconType> = {
    0: PiNumberZeroFill,
    1: PiNumberOneFill,
    2: PiNumberTwoFill,
    3: PiNumberThreeFill,
    4: PiNumberFourFill,
    5: PiNumberFiveFill,
    6: PiNumberSixFill,
    7: PiNumberSevenFill,
    8: PiNumberEightFill,
    9: PiNumberNineFill,
}

export const tierMap: Record<string, IconType> = {
    'S': TbHexagonLetterSFilled,
    'A': TbHexagonLetterAFilled,
    'B': TbHexagonLetterBFilled,
    'C': TbHexagonLetterCFilled,
    'D': TbHexagonLetterDFilled,
    'E': TbHexagonLetterEFilled,
    'F': TbHexagonLetterFFilled,
}

export type TierLevel = keyof typeof tierMap;

const rawCardImages = import.meta.glob('@/assets/cards/*.webp', {
    eager: true,
    import: 'default'
});
export const cardImages: Record<string, string> = Object.entries(rawCardImages).reduce(
    (acc, [path, url]) => {
        const name = path.split('/').pop()!.replace('.webp', '');
        acc[name] = url as string;
        return acc;
    },
    {} as Record<string, string>
);

const rawProtocolImages = import.meta.glob('@/assets/protocols/*.webp', {
    eager: true,
    import: 'default'
});
export const protocolImages: Record<string, string> = Object.entries(rawProtocolImages).reduce(
    (acc, [path, url]) => {
        const name = path.split('/').pop()!.replace('.webp', '');
        acc[name] = url as string;
        return acc;
    },
    {} as Record<string, string>
);
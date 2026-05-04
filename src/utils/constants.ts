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

import { type IconType } from 'react-icons';

export const MAX_DRAFT = 3;
export type DraftAction = 'PICK' | 'BAN' | 'GIVE' | 'RANDOM' | 'OTHER' | 'DRAW' | 'DISPLAY';
export type DraftItemStatus = DraftAction | 'AVAILABLE' | 'UNAVAILABLE' | 'HIDDEN';

export interface DraftStep {
    player: number;
    action: DraftAction;
    count?: number;
}
export interface DraftItem {
    id: number;
    name: string;
    status?: DraftItemStatus;
    flavor: string;
    info: string;
}

export interface Pack {
    id: number;
    cycle: number;
    codename: string;
    name: string;
    contains : number[];
}

export interface DraftInformation {
    group: string;
    label: string;
    value: DraftStep[];
    info?: string;
}

export interface Errata {
    top?: string;
    middle?: string;
    bottom?: string
}

export type Tag = 'Delete' | 'Discard' | 'Draw' | 'Flip' | 'Give' | 'Play' |
    'Rearrange' | 'Return' | 'Reveal' | 'Refresh' | 'Shift' | 'Swap' | 'Take' | 'Compile' |
    'Control' | 'Prevent'
;

export interface Card {
    protocol: number;
    value: number;
    tags: Tag[];
    errata?: string[]
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
    { id: 1, cycle: 1, codename: 'main-1', name: 'Main 1', contains: [1,2,3,4,5,6,7,8,9,10,11,12]},
    { id: 2, cycle: 1, codename: 'aux-1', name: 'Aux 1', contains: [13,14,15]},
    { id: 3, cycle: 2, codename: 'main-2', name: 'Main 2', contains: [16,17,18,19,20,21,22,23,24,25,26,27]},
    { id: 4, cycle: 2, codename: 'aux-2', name: 'Aux 2', contains: [28,29,30]}
]
export const INITIAL_POOL: DraftItem[] = [
    { id: 1, name: 'Darkness', flavor: 'An absence of light', info: 'Draw, Shift, Manipulate'},
    { id: 2, name: 'Death', flavor: 'Nothing shall survive', info: 'Delete, Draw' },
    { id: 3, name: 'Fire', flavor: 'Burn at both ends', info: 'Discard for effect' },
    { id: 4, name: 'Gravity', flavor: 'Draw ever inward', info: 'Shift, Flip, Draw' },
    { id: 5, name: 'Life', flavor: 'Bring about new growth', info: 'Flip, Top Deck Play, Draw' },
    { id: 6, name: 'Light', flavor: 'Burn away the dark', info: 'Draw, Flip, Shift' },
    { id: 7, name: 'Metal', flavor: 'Hardened against all', info: 'Prevent, Draw, Flip' },
    { id: 8, name: 'Plague', flavor: 'Slow death from within', info: 'Force Discard, Flip' },
    { id: 9, name: 'Psychic', flavor: 'Know your foe\'s mind', info: 'Draw, Manipulate, Shift' },
    { id: 10, name: 'Speed', flavor: 'Quicken with every step', info: 'Draw, Play, Shift' },
    { id: 11, name: 'Spirit', flavor: 'True strength from within', info: 'Flip, Shift, Draw' },
    { id: 12, name: 'Water', flavor: 'Wash away and renew', info: 'Return, Draw, Flip' },
    { id: 13, name: 'Love', flavor: 'Giving is the true gift', info: 'Draw, Gift, Exchange' },
    { id: 14, name: 'Hate', flavor: 'Ultimate disdain', info: 'Delete theirs and yours' },
    { id: 15, name: 'Apathy', flavor: 'Uncaring, unfeeling', info: 'Flip Face-Down' },
    { id: 16, name: 'Chaos', flavor: 'Unpredictable Beware', info: 'Draw, Rearrange, Covered' },
    { id: 17, name: 'Clarity', flavor: 'I can see my path clearly', info: 'Draw, Reveal' },
    { id: 18, name: 'Corruption', flavor: 'One bad apple spoils the bunch', info: 'Flip, Discard' },
    { id: 19, name: 'Courage', flavor: 'A blaze in the face of adversity', info: 'Draw, Compare' },
    { id: 20, name: 'Fear', flavor: 'Run away', info: 'Shift, Discard' },
    { id: 21, name: 'Ice', flavor: 'Cold, Strong, and Slick', info: 'Shift, Prevent' },
    { id: 22, name: 'Luck', flavor: 'Roll the dice', info: 'Random, Delete, Play' },
    { id: 23, name: 'Mirror', flavor: 'A Reflection of the truth', info: 'Shift, Repeat' },
    { id: 24, name: 'Peace', flavor: 'Respite and solace as long as we can', info: 'Mutual Discard, Draw' },
    { id: 25, name: 'Smoke', flavor: 'A blanket of obfuscation', info: 'Face-Down, Shift' },
    { id: 26, name: 'Time', flavor: 'Forward to the past', info: 'Discard, Trash' },
    { id: 27, name: 'War', flavor: 'Raging conflict, but to what end?', info: 'React, Discard' },
    { id: 28, name: 'Assimilation', flavor: 'Complete exchange and understanding', info: 'Exchange' },
    { id: 29, name: 'Diversity', flavor: 'Our differences are our strength', info: 'Play, Compare, Covered' },
    { id: 30, name: 'Unity', flavor: 'Together we are strong', info: 'Cover, Flip, Compile' },
];

export const CARDS: Card[] = [
    // Darkness
    { protocol: 1, value: 0, tags: ['Draw', 'Shift'], },
    { protocol: 1, value: 1, tags: ['Flip', 'Shift'], },
    { protocol: 1, value: 2, tags: ['Flip'], },
    { protocol: 1, value: 3, tags: ['Play'], },
    { protocol: 1, value: 4, tags: ['Shift'], },
    { protocol: 1, value: 5, tags: ['Discard'] },
    // Death
    { protocol: 2, value: 0, tags: ['Delete'], errata: [
        "CLARIFICATION: When Death 0's middle command triggers, the owner notes the lines that need to be acted in. Then, they choose which line to process, one at a time. For each line, they select an uncovered card to delete, processing the consequences of that delete before addressing the next line."
    ]},
    { protocol: 2, value: 1, tags: ['Draw', 'Delete'], errata: [
        "ERRATA(10/2024): The top command should be: “Start: You may draw 1 card. If you do, delete 1 other card. Then, delete this card.”"
    ]},
    { protocol: 2, value: 2, tags: ['Delete'], },
    { protocol: 2, value: 3, tags: ['Delete'], },
    { protocol: 2, value: 4, tags: ['Delete'], },
    { protocol: 2, value: 5, tags: ['Discard'] },
    // Fire
    { protocol: 3, value: 0, tags: ['Flip', 'Draw'], errata: [
        "ERRATA(12/2024): The bottom command should be: “When this card would be covered: First, draw 1 card. Then, flip 1 other card.”"
    ]},
    { protocol: 3, value: 1, tags: ['Discard', 'Delete'], },
    { protocol: 3, value: 2, tags: ['Discard', 'Return'], },
    { protocol: 3, value: 3, tags: ['Discard', 'Flip'], },
    { protocol: 3, value: 4, tags: ['Discard', 'Draw'], },
    { protocol: 3, value: 5, tags: ['Discard'] },
    // Gravity
    { protocol: 4, value: 0, tags: ['Play'] },
    { protocol: 4, value: 1, tags: ['Draw', 'Shift'], },
    { protocol: 4, value: 2, tags: ['Flip', 'Shift'], errata: [
        "CLARIFICATION: Gravity 2 will still shift the flipped card if it’s covered. “That card”  references a specific card that supersedes the covered manipulation rule."
    ]},
    { protocol: 4, value: 3, tags: ['Shift'], },
    { protocol: 4, value: 5, tags: ['Discard'] },
    { protocol: 4, value: 6, tags: ['Play'], },
    // Life
    { protocol: 5, value: 0, tags: ['Play', 'Delete'], errata: [
        "ERRATA(10/2024): The top command should be: “End: If this card is covered, delete this card.” This card should have no bottom command.", 
        "CLARIFICATION: When Life 0's middle command triggers, the owner notes the lines that need to be acted in. Then, they choose which line to process, one at a time. For each line, they play the top card of their deck face-down, processing the consequences of that card play before addressing the next line. If Life 0 gets covered during this process, its middle command stops.", 
        "CLARIFICATION: Playing cards from the top of a deck does not force a shuffle if that deck is empty."
    ]},
    { protocol: 5, value: 1, tags: ['Flip'], },
    { protocol: 5, value: 2, tags: ['Draw', 'Flip'], },
    { protocol: 5, value: 3, tags: ['Play'], },
    { protocol: 5, value: 4, tags: ['Draw'], },
    { protocol: 5, value: 5, tags: ['Discard'] },
    // Light
    { protocol: 6, value: 0, tags: ['Flip', 'Draw'], errata: [
        "CLARIFICATION: The middle command reads ”Flip 1 card. Draw cards equal to that card’s value.” When played, the card owner chooses one uncovered card, flips that card, and then resolves any triggered text. Then, they draw cards equal to the current value of the chosen card (e.g. Light 0 selects Fire 5. First, Fire 5 is flipped face-down. Then, Light 0 checks the current value of the card, which is now 2. As a result, the active player draws 2 cards.)", 
        "RULING: If the chosen card is removed from play, it is still referred to directly by the \"that card\" text on Light 0. (e.g. Light 0 selects Metal 6. First, Metal 6's top command triggers: because it is about to be flipped, it deletes itself. Then, Light 0 checks the value of Metal 6, and, if it’s in the trash, its current value is 6 since all cards in the trash are face-up. The active player draws 6 cards. If the Metal 6 is private information (i.e. it was shuffled into your deck) it has a value of 2.)"
    ]},
    { protocol: 6, value: 1, tags: ['Draw'], },
    { protocol: 6, value: 2, tags: ['Draw', 'Reveal', 'Shift', 'Flip'], },
    { protocol: 6, value: 3, tags: ['Shift'], errata: [
        "CLARIFICATION: The face-down cards shifted by Light 3 maintain the same relative positioning in their stacks and are all moved to the same line."
    ]},
    { protocol: 6, value: 4, tags: ['Reveal'], },
    { protocol: 6, value: 5, tags: ['Discard'] },
    // Metal
    { protocol: 7, value: 0, tags: ['Flip'], },
    { protocol: 7, value: 1, tags: ['Draw', 'Compile'], errata: [
        "ERRATA(12/2024): The middle command should be: “Draw 2 cards. Your opponent cannot compile on their next turn.”",
        "CLARIFICATION: Metal 1 prevents your opponent from taking the compile action on their next turn, provided the text is visible. Since a player gets 1 action on their turn (compile, play, or refresh), they must either play or refresh on their next turn since they cannot compile."
    ]},
    { protocol: 7, value: 2, tags: ['Prevent'], },
    { protocol: 7, value: 3, tags: ['Draw', 'Delete'], },
    { protocol: 7, value: 5, tags: ['Discard'] },
    { protocol: 7, value: 6, tags: ['Delete'], errata: [
        "CLARIFICATION: When Metal 6 deletes itself because of its top command, if it is covering a card with text that would trigger, that text triggers before the committed card enters the field.",
        "CLARIFICATION: When Metal 6 deletes itself as a result of being flipped, the “flip” command is used up and cannot be used on another card, nor can it be used on Metal 6 in the trash, as cards in the trash can’t be flipped."
    ]},
    // Plague
    { protocol: 8, value: 0, tags: ['Discard', 'Prevent'], },
    { protocol: 8, value: 1, tags: ['Draw', 'Discard'], },
    { protocol: 8, value: 2, tags: ['Discard'], },
    { protocol: 8, value: 3, tags: ['Flip'], errata: [
        "ERRATA(9/2025): The middle command should be “Flip each other uncovered face-up card.” Note that this doesn’t change the card’s functionality but makes its intended use case more clear.",
        "CLARIFICATION: The middle command reads “Flip each other face-up card.” This only affects uncovered cards, since it does not say “all”.",
        "CLARIFICATION: When Plague 3's middle command triggers, the owner notes each uncovered face-up card. Then, they choose which card to process, one at a time. For each card, they flip it and process any consequences before addressing the next card."
    ]},
    { protocol: 8, value: 4, tags: ['Delete', 'Flip'], },
    { protocol: 8, value: 5, tags: ['Discard'] },
    // Psychic
    { protocol: 9, value: 0, tags: ['Draw', 'Discard', 'Reveal'], },
    { protocol: 9, value: 1, tags: ['Prevent', 'Flip'], },
    { protocol: 9, value: 2, tags: ['Discard', 'Rearrange'], },
    { protocol: 9, value: 3, tags: ['Discard', 'Shift'], },
    { protocol: 9, value: 4, tags: ['Return', 'Flip'], },
    { protocol: 9, value: 5, tags: ['Discard'] },
    // Speed
    { protocol: 10, value: 0, tags: ['Play'], },
    { protocol: 10, value: 1, tags: ['Draw'], },
    { protocol: 10, value: 2, tags: ['Shift'], errata: [
        "CLARIFICATION: When compiling, all cards in the line are deleted at the same time. When Speed 2 would be deleted this way, instead, you shift it to another line, preventing the delete of Speed 2 only, and not altering the compile."
    ]},
    { protocol: 10, value: 3, tags: ['Shift', 'Flip'], },
    { protocol: 10, value: 4, tags: ['Shift'], },
    { protocol: 10, value: 5, tags: ['Discard'] },
    // Spirit
    { protocol: 11, value: 0, tags: ['Refresh', 'Draw'], errata: [
        " CLARIFICATION: When you refresh as instructed, it is a normal refresh action, including spending the control component, if applicable."
    ]},
    { protocol: 11, value: 1, tags: ['Draw', 'Discard', 'Flip'], errata: [
        "ERRATA(10/2024): The top command should be: “When you play cards face-up, they may be played without matching protocols.”"
    ]},
    { protocol: 11, value: 2, tags: ['Flip'], },
    { protocol: 11, value: 3, tags: ['Shift'], },
    { protocol: 11, value: 4, tags: ['Swap'], },
    { protocol: 11, value: 5, tags: ['Discard'] },
    // Water
    { protocol: 12, value: 0, tags: ['Flip'], },
    { protocol: 12, value: 1, tags: ['Play'], errata: [
        "CLARIFICATION: When Water 1's middle command triggers, the owner notes the lines that need to be acted in. Then, they choose which line to process, one at a time. For each line, they play the top card of their deck face-down, processing the consequences of that card play before addressing the next line.",
        "CLARIFICATION: Playing cards from the top of a deck does not force a shuffle if that deck is empty."]},
    { protocol: 12, value: 2, tags: ['Draw', 'Rearrange'], },
    { protocol: 12, value: 3, tags: ['Return'], },
    { protocol: 12, value: 4, tags: ['Return'], },
    { protocol: 12, value: 5, tags: ['Discard'] },
    // Love
    { protocol: 13, value: 1, tags: ['Draw', 'Give'], },
    { protocol: 13, value: 2, tags: ['Draw', 'Refresh'], },
    { protocol: 13, value: 3, tags: ['Take', 'Give'], },
    { protocol: 13, value: 4, tags: ['Reveal', 'Flip'], },
    { protocol: 13, value: 5, tags: ['Discard'] },
    { protocol: 13, value: 6, tags: ['Draw'], },
    // Hate
    { protocol: 14, value: 0, tags: ['Delete'], },
    { protocol: 14, value: 1, tags: ['Discard', 'Delete'], },
    { protocol: 14, value: 2, tags: ['Delete'], errata: [
        "ERRATA(10/2024): The middle command should be: “Delete your highest value uncovered card. Delete your opponent's highest value uncovered card.”",
        "CLARIFICATION: Multiple cards can be tied for the highest value. The player would choose one of the tied cards.",
        "CLARIFICATION: If Hate 2 is the highest value card you own it deletes itself as a result of the first clause. Thus, the second clause no longer exists and does not trigger."
    ]},
    { protocol: 14, value: 3, tags: ['Draw'], },
    { protocol: 14, value: 4, tags: ['Delete'], },
    { protocol: 14, value: 5, tags: ['Discard'] },
    // Apathy
    { protocol: 15, value: 0, tags: [], },
    { protocol: 15, value: 1, tags: ['Flip'], },
    { protocol: 15, value: 2, tags: ['Flip'], },
    { protocol: 15, value: 3, tags: ['Flip'], },
    { protocol: 15, value: 4, tags: ['Flip'], },
    { protocol: 15, value: 5, tags: ['Discard'] },
    // Chaos
    { protocol: 16, value: 0, tags: ['Draw', 'Shift'], errata: [
        "ERRATA(9/2025): The middle command should be: “Flip 1 covered card in each line.”",
        "CLARIFICATION: When Chaos 0's middle command triggers, the owner notes each line that needs to be acted in. Then, they choose which line to process, one at a time. For each line, they select a covered card to flip, processing the consequences of that flip before addressing the next line. Covered cards never activate their middle command when flipped."
    ]},
    { protocol: 16, value: 1, tags: ['Flip', 'Shift'], errata: [
        "CLARIFICATION: You must make a change to the protocols of both players."
    ]},
    { protocol: 16, value: 2, tags: ['Flip'], },
    { protocol: 16, value: 3, tags: ['Play'], },
    { protocol: 16, value: 4, tags: ['Shift'], },
    { protocol: 16, value: 5, tags: ['Discard'] },
    // Clarity
    { protocol: 17, value: 0, tags: ['Delete'], },
    { protocol: 17, value: 1, tags: ['Draw', 'Delete'], },
    { protocol: 17, value: 2, tags: ['Delete'], },
    { protocol: 17, value: 3, tags: ['Delete'], },
    { protocol: 17, value: 4, tags: ['Delete'], },
    { protocol: 17, value: 5, tags: ['Discard'] },
    // Corruption
    { protocol: 18, value: 0, tags: ['Flip', 'Draw'], },
    { protocol: 18, value: 1, tags: ['Discard', 'Delete'], },
    { protocol: 18, value: 2, tags: ['Discard', 'Return'], },
    { protocol: 18, value: 3, tags: ['Discard', 'Flip'], },
    { protocol: 18, value: 5, tags: ['Discard'] },
    { protocol: 18, value: 6, tags: ['Discard', 'Draw'], errata: [
        "CLARIFICATION: This will trigger the middle command of the card it was covering if it deletes itself at the end of turn."
    ]},
    // Courage
    { protocol: 19, value: 0, tags: ['Play'] },
    { protocol: 19, value: 1, tags: ['Draw', 'Shift'], },
    { protocol: 19, value: 2, tags: ['Flip', 'Shift'], },
    { protocol: 19, value: 3, tags: ['Shift'], errata: [
        "CLARIFICATION: Multiple lines can be tied for “highest total value”. In this case, the player chooses."
    ]},
    { protocol: 19, value: 5, tags: ['Discard'] },
    { protocol: 19, value: 6, tags: ['Play'], },
    // Fear
    { protocol: 20, value: 0, tags: ['Play', 'Delete'], },
    { protocol: 20, value: 1, tags: ['Flip'], },
    { protocol: 20, value: 2, tags: ['Draw', 'Flip'], },
    { protocol: 20, value: 3, tags: ['Play'], },
    { protocol: 20, value: 4, tags: ['Draw'], },
    { protocol: 20, value: 5, tags: ['Discard'] },
    // Ice
    { protocol: 21, value: 0, tags: ['Flip', 'Draw'], },
    { protocol: 21, value: 1, tags: ['Draw'], },
    { protocol: 21, value: 2, tags: ['Draw', 'Reveal', 'Shift', 'Flip'], },
    { protocol: 21, value: 3, tags: ['Shift'], },
    { protocol: 21, value: 5, tags: ['Discard'] },
    { protocol: 21, value: 6, tags: ['Reveal'], errata: [
        "CLARIFICATION: Cards are drawn in a batch. Refreshing with 0 cards in hand will draw you 5 cards."
    ]},
    // Luck
    { protocol: 22, value: 0, tags: ['Flip'], errata: [
        "CLARIFICATION: The played card must be one that you drew with Luck 0. You can play the card face-up or face-down."
    ]},
    { protocol: 22, value: 1, tags: ['Draw', 'Compile'], errata: [
        "ERRATA(9/2025): The middle command should be: “Play the top card of your deck face-down. Flip that card, ignoring its middle command.”",
        "CLARIFICATION: The middle command is only ignored for the flip."
    ]},
    { protocol: 22, value: 2, tags: ['Prevent'], },
    { protocol: 22, value: 3, tags: ['Draw', 'Delete'], errata: [
        "ERRATA(8/2025): The middle command should be: “State a protocol. Discard the top card of your opponent's deck. If the discarded card matched the stated protocol, delete 1 card.”"
    ]},
    { protocol: 22, value: 5, tags: ['Discard'] },
    { protocol: 22, value: 6, tags: ['Delete'], },
    // Mirror
    { protocol: 23, value: 0, tags: ['Discard', 'Prevent'], },
    { protocol: 23, value: 1, tags: ['Draw', 'Discard'], errata: [
        "CLARIFICATION: Mirror 1’s bottom text is blocked by Fear 0 because the text is treated “as if it were on this card” but there’s no text to copy because Fear 0 says the “cards do not have middle commands”."
    ]},
    { protocol: 23, value: 2, tags: ['Discard'], errata: [
        "CLARIFICATION: The swapped cards keep the same relative positions. A stack must have at least 1 card in it to swap."
    ]},
    { protocol: 23, value: 3, tags: ['Flip'], errata: [
        "CLARIFICATION: If Mirror 3 flips itself first, the second flip doesn’t happen."
    ]},
    { protocol: 23, value: 4, tags: ['Delete', 'Flip'], },
    { protocol: 23, value: 5, tags: ['Discard'] },
    // Peace
    { protocol: 24, value: 0, tags: ['Draw', 'Discard', 'Reveal'], },
    { protocol: 24, value: 1, tags: ['Prevent', 'Flip'], errata: [
        "CLARIFICATION: The owner decides which player discards their hand first."
    ]},
    { protocol: 24, value: 2, tags: ['Discard', 'Rearrange'], },
    { protocol: 24, value: 3, tags: ['Discard', 'Shift'], },
    { protocol: 24, value: 4, tags: ['Return', 'Flip'], },
    { protocol: 24, value: 5, tags: ['Discard'] },
    // Smoke
    { protocol: 25, value: 0, tags: ['Play'], errata: [
        "CLARIFICATION: Both Smoke 0 and 3 count your opponent’s face-down cards."
    ]},
    { protocol: 25, value: 1, tags: ['Draw'], },
    { protocol: 25, value: 2, tags: ['Shift'], },
    { protocol: 25, value: 3, tags: ['Shift', 'Flip'], errata: [
        "CLARIFICATION: Both Smoke 0 and 3 count your opponent’s face-down cards."
    ]},
    { protocol: 25, value: 4, tags: ['Shift'], },
    { protocol: 25, value: 5, tags: ['Discard'] },
    // Time
    { protocol: 26, value: 0, tags: ['Refresh', 'Draw'], },
    { protocol: 26, value: 1, tags: ['Draw', 'Discard', 'Flip'], },
    { protocol: 26, value: 2, tags: ['Flip'], errata: [
        "ERRATA (8/2025): The top command should be: “After you shuffle your deck: Draw 1 card. Then, you may shift this card.”"
    ]},
    { protocol: 26, value: 3, tags: ['Shift'], },
    { protocol: 26, value: 4, tags: ['Swap'], },
    { protocol: 26, value: 5, tags: ['Discard'] },
    // War
    { protocol: 27, value: 0, tags: ['Flip'], },
    { protocol: 27, value: 1, tags: ['Play'], },
    { protocol: 27, value: 2, tags: ['Draw', 'Rearrange'], },
    { protocol: 27, value: 3, tags: ['Return'], },
    { protocol: 27, value: 4, tags: ['Return'], },
    { protocol: 27, value: 5, tags: ['Discard'] },
    // Assimilation
    { protocol: 28, value: 1, tags: ['Draw', 'Give'], },
    { protocol: 28, value: 2, tags: ['Draw', 'Refresh'], },
    { protocol: 28, value: 3, tags: ['Take', 'Give'], },
    { protocol: 28, value: 4, tags: ['Reveal', 'Flip'], },
    { protocol: 28, value: 5, tags: ['Discard'] },
    { protocol: 28, value: 6, tags: ['Draw'], },
    // Diversity
    { protocol: 29, value: 0, tags: ['Delete'], },
    { protocol: 29, value: 1, tags: ['Discard', 'Delete'], },
    { protocol: 29, value: 2, tags: ['Delete'], },
    { protocol: 29, value: 3, tags: ['Draw'], },
    { protocol: 29, value: 4, tags: ['Delete'], },
    { protocol: 29, value: 5, tags: ['Discard'] },
    // Unity
    { protocol: 30, value: 0, tags: [], },
    { protocol: 30, value: 1, tags: ['Flip'], },
    { protocol: 30, value: 2, tags: ['Flip'], },
    { protocol: 30, value: 3, tags: ['Flip'], },
    { protocol: 30, value: 4, tags: ['Flip'], },
    { protocol: 30, value: 5, tags: ['Discard'] },
]

export const VIEWS = {
    HOME: 'home',
    STATS: 'stats',
    DRAFT: 'draft',
    CODEX: 'codex',
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
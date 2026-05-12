export interface PageProps {
    subMenu?: { id: string; title: string }[];
    activeSub?: string | null;
    onSubChange?: (id: string) => void;
}

export interface Draft {
    timestamp: string; // ISO format
    winner: 'player1' | 'player2';
    remaining: string[];
    banned: string[];
    player1: string[];
    player2: string[];
}
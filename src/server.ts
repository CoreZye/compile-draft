import express, { type Request, type Response } from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import path from 'path';
import type {TierLevel} from "@/utils/constants.ts";

export interface Draft {
    timestamp: string;
    winner: 'player1' | 'player2';
    remaining: string[];
    banned: string[];
    player1: string[];
    player2: string[];
}

export interface InteractionStats {
    games: FieldValue;
    wins: FieldValue;
}

export interface Stats {
    available: FieldValue;
    games: FieldValue;
    wins: FieldValue;
    bans: FieldValue;
    synergies: {
        [protocolId: string]: InteractionStats;
    };
    matchups: {
        [protocolId: string]: InteractionStats;
    };
}

type StatsUpdate = {
    [K in keyof Omit<Stats, 'synergies' | 'matchups'>]?: number | FieldValue;
} & {
    // Dot-notation keys (synergies.id.games, etc.)
    [key: string]: FieldValue;
};
admin.initializeApp();
const db = admin.firestore();

const calculateBayesian = (wins: number, games: number, avgWinRate: number, m = 5) => {
    if (games === 0) return 0;
    const R = wins / games;
    return ((R * games) + (avgWinRate * m)) / (games + m);
};

// The structure of a single entry in the matchups or synergies objects
export interface SubStat {
    games: number;
    wins: number;
}


// The document structure in Firestore 'Stats' collection
export interface FirestoreStatDoc {
    available: number;
    bans: number;
    games: number;
    wins: number;
    matchups: Record<string, SubStat>;
    synergies: Record<string, SubStat>;
}

// What the Table API returns
export interface TableRow {
    codename: string;
    isValid: boolean;
    tier: string;
    games: number;
    winRatio: number;
    pickRatio: number;
    bayesian: number;
    bans: number;
    available: number;
    playRatio: number;
    relativePlayRatio:number;
    banRatio: number;
    presenceRatio: number;
}

// What the Detail API returns
export interface StatDetail {
    codename: string;
    general: {
        games: number;
        wins: number;
        winRate: string;
    };
    matchups: Array<{ name: string; games: number; winRate: string }>;
    synergies: Array<{ name: string; games: number; winRate: string }>;
}

interface StatsCache {
    data: TableRow[] | null;
    lastUpdated: number;
}

const cache: StatsCache = {
    data: null,
    lastUpdated: 0
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

const getTier = (val: number): TierLevel => {
    if (val < 10) return 'F';
    if (val < 25) return 'E';
    if (val < 50) return 'D';
    if (val < 65) return 'C';
    if (val < 75) return 'B';
    if (val < 85) return 'A';
    if (val >= 85) return 'S';
    return '';
};

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

app.post('/api/draft', async (req, res) => {
    const draft: Draft = req.body;
    const requiredFields = ['winner', 'player1', 'player2', 'banned', 'remaining'];
    const missing = requiredFields.filter(field => !draft[field as keyof Draft]);

    if (missing.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
    }

    try {
        const batch = db.batch();
        const draftRef = db.collection('Drafts').doc();
        batch.set(draftRef, {...draft, timestamp: draft.timestamp || new Date().toISOString()});

        const allProtocolsInvolved = [
            ...draft.player1,
            ...draft.player2,
            ...draft.banned,
            ...draft.remaining
        ];

        allProtocolsInvolved.forEach(id => {
            const statsRef = db.collection('Stats').doc(id);
            const isPlayed = draft.player1.includes(id) || draft.player2.includes(id);
            const isWinner = draft.winner === 'player1' ? draft.player1.includes(id) : draft.player2.includes(id);
            batch.set(statsRef, {}, { merge: true });
            const updates: StatsUpdate = {
                available: admin.firestore.FieldValue.increment(1),
                games: admin.firestore.FieldValue.increment(isPlayed ? 1 : 0),
                wins: admin.firestore.FieldValue.increment(isWinner ? 1 : 0),
                bans: admin.firestore.FieldValue.increment(draft.banned.includes(id) ? 1 : 0)
            };

            if (isPlayed) {
                const team = draft.player1.includes(id) ? draft.player1 : draft.player2;
                const enemies = draft.player1.includes(id) ? draft.player2 : draft.player1;

                team.forEach(partnerId => {
                    if (partnerId === id) return;
                    updates[`synergies.${partnerId}.games`] = admin.firestore.FieldValue.increment(1);
                    updates[`synergies.${partnerId}.wins`] = admin.firestore.FieldValue.increment(isWinner ? 1 : 0);
                });

                enemies.forEach(oppId => {
                    updates[`matchups.${oppId}.games`] = admin.firestore.FieldValue.increment(1);
                    updates[`matchups.${oppId}.wins`] = admin.firestore.FieldValue.increment(isWinner ? 1 : 0);
                });
            }
            batch.update(statsRef, updates);
        });

        await batch.commit();

        res.status(201).json({ message: "Draft saved and stats updated successfully." });

    } catch (error) {
        console.error("Draft Transaction Error:", error);
        res.status(500).json({ error: "Internal Server Error during stats update." });
    }
});

app.get('/api/stats', async (_req: Request, res: Response<TableRow[] | { error: string }>) => {
    const now = Date.now();

    // 2. Check if cache is valid
    if (cache.data && (now - cache.lastUpdated < CACHE_DURATION)) {
        console.log("Serving from Cache");
        return res.json(cache.data);
    }
    try {
        const snapshot = await db.collection('Stats').get();

        const docs = snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data() as FirestoreStatDoc
        }));

        let totalGamesGlobal = 0;
        let totalWinsGlobal = 0;
        let highestPlayedGames = 0;

        docs.forEach(({ data }) => {
            if (data.games > highestPlayedGames) {
                highestPlayedGames = data.games;
            }
            totalGamesGlobal += data.games;
            totalWinsGlobal += data.wins;
        });

        const avgWinRate = totalWinsGlobal / (totalGamesGlobal || 1);

        const tableData: TableRow[] = docs.map(({ id, data }) => {
            const isValid = data.games >= 5;
            const winRatio = data.games > 0 ? (data.wins / data.games) * 100 : 0;
            const banRatio = data.games > 0 ? (data.bans / data.games) * 100 : 0;
            const playRatio = totalGamesGlobal > 0 ? (data.games / totalGamesGlobal) * 100 : 0;
            const relativePlayRatio = (data.games / highestPlayedGames) * 100;
            const pickRatio = data.available > 0 ? (data.games / data.available) * 100 : 0;
            const presenceRatio = data.available > 0 ? ((data.bans + data.games) / data.available) * 100 : 0;
            const bayesian = calculateBayesian(data.wins, data.games, avgWinRate) * 100;
            const tier = data.games >= 5 ? getTier(winRatio) : '';

            return {
                isValid: isValid,
                codename: id,
                tier: tier,
                games: data.games,
                bans: data.bans,
                available: data.available,
                pickRatio: pickRatio,
                playRatio: playRatio,
                relativePlayRatio: relativePlayRatio,
                winRatio: winRatio,
                banRatio: banRatio,
                presenceRatio: presenceRatio,
                bayesian: bayesian,
            };
        });


        cache.data = tableData;
        cache.lastUpdated = now;
        console.log('Save new cache');

        res.json(tableData.sort((a, b) => Number(b.bayesian) - Number(a.bayesian)));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats ' + error });
    }
});

app.get('/api/stats/:codename', async (req: Request, res: Response<StatDetail | { error: string }>) => {
    const { codename } = req.params;
    const codenameStr = codename as string;

    try {
        const doc = await db.collection('Stats').doc(codenameStr).get();

        if (!doc.exists) {
            return res.status(404).json({ error: 'Codename not found' });
        }

        const data = doc.data() as FirestoreStatDoc;

        const formatMap = (obj: Record<string, SubStat>) => {
            return Object.entries(obj).map(([name, stats]) => ({
                name,
                games: stats.games,
                winRate: stats.games > 0 ? ((stats.wins / stats.games) * 100).toFixed(1) : "0"
            })).sort((a, b) => Number(b.winRate) - Number(a.winRate));
        };

        const response: StatDetail = {
            codename: codenameStr,
            general: {
                games: data.games,
                wins: data.wins,
                winRate: data.games > 0 ? ((data.wins / data.games) * 100).toFixed(1) : "0"
            },
            matchups: formatMap(data.matchups),
            synergies: formatMap(data.synergies)
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error ' + error });
    }
});

app.get(/^(?!\/api).+/, (req, res) => {
    if (path.extname(req.path)) {
        res.status(404).send('Resource not found');
    } else {
        res.sendFile(path.join(distPath, 'index.html'));
    }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
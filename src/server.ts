import express from 'express';
import cors from 'cors'; // 1. Import cors
import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
// import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import type {Draft} from "@/utils/types.ts";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


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
// Initialize Firebase Admin (GOD MODE)
// Make sure you have your serviceAccountKey.json in the root!
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
// });
admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
// 1. API ROUTES
// app.post('/api/drafts', async (req: Request, res: Response) => {
//     try {
//         const { name, content } = req.body;
//         const docRef = await db.collection('drafts').add({
//             name,
//             content,
//             date: admin.firestore.FieldValue.serverTimestamp(),
//         });
//         res.status(201).json({ id: docRef.id });
//     } catch (error) {
//         res.status(500).json({ error: "Failed to save", message: error});
//     }
// });

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

        // 6. Atomic Commit
        await batch.commit();

        res.status(201).json({ message: "Draft saved and stats updated successfully." });

    } catch (error) {
        console.error("Draft Transaction Error:", error);
        res.status(500).json({ error: "Internal Server Error during stats update." });
    }
});

app.get(/^(?!\/api).+/, (req, res) => {
    if (path.extname(req.path)) {
        res.status(404).send('Resource not found');
    } else {
        res.sendFile(path.join(distPath, 'index.html'));
    }
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
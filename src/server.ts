import express, { type Request, type Response } from 'express';
import cors from 'cors'; // 1. Import cors
import admin from 'firebase-admin';
import serviceAccount from "../serviceAccountKey.json" with { type: "json" };

import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Firebase Admin (GOD MODE)
// Make sure you have your serviceAccountKey.json in the root!
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
});
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
app.post('/api/drafts', async (req: Request, res: Response) => {
    try {
        const { name, content } = req.body;
        const docRef = await db.collection('drafts').add({
            name,
            content,
            date: admin.firestore.FieldValue.serverTimestamp(),
        });
        res.status(201).json({ id: docRef.id });
    } catch (error) {
        res.status(500).json({ error: "Failed to save", message: error});
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
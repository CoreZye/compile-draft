import { useState, useEffect } from 'react';
import { Button } from "rsuite";
import { db } from '@/utils/firebase';
import {
    collection,
    onSnapshot,
    query,
    limit,
    orderBy,
    Timestamp,
    type DocumentData,
    QuerySnapshot
} from "firebase/firestore";


interface DraftItem {
    id: string;
    order: number;
    name: string;
}

interface Draft {
    id: string;
    name: string;
    date: Timestamp | null;
    content: DraftItem[];
}

function Settings() {
    const [drafts, setDrafts] = useState<Draft[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const draftsCol = collection(db, "drafts");
        const q = query(draftsCol, orderBy("date", "desc"), limit(5));

        const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot<DocumentData>) => {
            const draftArray: Draft[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data() as Omit<Draft, 'id'>;

                draftArray.push({
                    id: doc.id,
                    ...data
                });
            });

            setDrafts(draftArray);
            setLoading(false);
        }, (error) => {
            console.error("Listener failed:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        const draftData = {
            name: "Backend-Verified Draft",
            content: [
                { id: "i1", order: 1, name: "Faction X" },
                { id: "i2", order: 2, name: "Faction Y" }
            ]
        };

        try {
            const response = await fetch('http://localhost:4001/api/drafts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draftData)
            });

            if (!response.ok) throw new Error('Failed to save via backend');

            console.log("Draft sent to backend successfully!");
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Syncing with database...</p>;

    return (
        <div>
            <Button onClick={handleSave} appearance="primary">
                Add New Row
            </Button>

            <div style={{ display: 'grid', gap: '10px', marginTop: '20px' }}>
                {drafts.map((draft) => (
                    <div key={draft.id} style={{ border: '1px solid #ccc', padding: '10px' }}>
                        <strong>{draft.name}</strong>
                        <p style={{ fontSize: '0.8em', color: '#666' }}>
                            {draft.date ? draft.date.toDate().toLocaleString() : 'Saving...'}
                        </p>
                        <ul>
                            {draft.content?.map((item) => (
                                <li key={item.id}>
                                    {item.name} (Order: {item.order})
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Settings;
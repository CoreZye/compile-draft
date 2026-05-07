import { useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    type DocumentData,
} from 'firebase/firestore';
import { db } from '@/utils/firebase';

export function useFirestoreCollection<T = DocumentData>(
    collectionName: string,
) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const q = query(collection(db, collectionName));
        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const items = snapshot.docs.map((doc) => ({
                    codename: doc.id,
                    ...doc.data(),
                })) as T[];

                setData(items);
                setLoading(false);
            },
            (err) => {
                console.error(err);
                setError(err);
                setLoading(false);
            }
        );
        return () => unsubscribe();
    }, [collectionName]);

    return { data, loading, error };
}
import { useState } from 'react';
import { type Draft } from '@/utils/types';
import {useGetData} from "@/context/DataContext.tsx";


export const DraftCreator = () => {
    const [isSaving, setIsSaving] = useState(false);
    const { protocols } = useGetData()
    const badShuffle = protocols.sort(() => Math.random() - 0.5);

    const submitDraftData = async (draft: Draft) => {
        const response = await fetch('/api/draft', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(draft),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Server error occurred');
        }

        return await response.json();
    };

    const saveDraft = async () => {
        setIsSaving(true);

        // 1. Prepare the data object
        const newDraft: Draft = {
            timestamp: new Date().toISOString(),
            winner: Math.random() < 0.5 ? 'player1' : 'player2',
            remaining: [badShuffle[0].codename, badShuffle[1].codename],
            banned: [badShuffle[2].codename, badShuffle[3].codename, badShuffle[4].codename, badShuffle[5].codename],
            player1: [badShuffle[6].codename, badShuffle[7].codename, badShuffle[8].codename],
            player2: [badShuffle[9].codename, badShuffle[10].codename, badShuffle[11].codename],
        };

        const finalDraft = {
            timestamp: new Date().toISOString(),
            winner: newDraft.winner, // 'player1' or 'player2'
            remaining: newDraft.remaining, // ['lust', 'envy']
            banned: newDraft.banned,      // ['war', 'life', ...]
            player1: newDraft.player1,          // ['speed', 'water', ...]
            player2: newDraft.player2,          // ['truth', 'lies', ...]
        };

        try {
            await submitDraftData(finalDraft);
            alert('Stats Updated!');
            // Navigate away or reset the draft board
        } catch (err) {
            alert(`Error: ${err}`);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <button
            onClick={saveDraft}
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
        >
            {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
    );
};
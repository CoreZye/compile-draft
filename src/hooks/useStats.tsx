import { useState, useEffect } from 'react';

export interface TableRow {
    codename: string;
    isValid: boolean;
    tier: string;
    games: number;
    winRatio: number;
    pickRatio: number;
    playRatio: number;
    relativePlayRatio: number;
    banRatio: number;
    bayesian: number;
    bans: number;
}

export const useStats = () => {
    const [data, setData] = useState<TableRow[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');
                if (!response.ok) throw new Error('Failed to fetch global stats');
                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return { data, loading, error };
};
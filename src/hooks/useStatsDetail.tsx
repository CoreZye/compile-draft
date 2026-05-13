import { useState, useEffect } from 'react';

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

export const useStatDetail = (codename: string | undefined) => {
    const [detail, setDetail] = useState<StatDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!codename) return;

        const fetchDetail = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/stats/${codename}`);
                if (!response.ok) throw new Error('Detail not found');
                const result = await response.json();
                setDetail(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [codename]);

    return { detail, loading, error };
};
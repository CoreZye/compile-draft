import { type ReactNode, useEffect } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { type Protocol, type Pack } from '@/utils/constants';
import { DataContext } from '@/context/DataContext';

const getByteSize = (obj: object): number => {
    return new TextEncoder().encode(JSON.stringify(obj)).length;
};

const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};


export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { data: protocols, loading: pLoad } = useFirestoreCollection<Protocol>('Protocols');
    const { data: packs, loading: packLoad } = useFirestoreCollection<Pack>('Packs');
    const { data: drafts, loading: draftLoad } = useFirestoreCollection<Pack>('Drafts');
    const { data: stats, loading: statsLoad } = useFirestoreCollection<Pack>('Stats');

    const value = {
        protocols,
        packs,
        drafts,
        stats,
        loading: pLoad || packLoad || draftLoad || statsLoad,
    };

    useEffect(() => {
        if (!pLoad && !packLoad && !draftLoad && !statsLoad) {
            const protoSize = getByteSize(protocols);
            const packSize = getByteSize(packs);
            const draftSize = getByteSize(drafts);
            const statsSize = getByteSize(stats);
            const totalSize = protoSize + packSize + draftSize;

            console.group('🔥 Firestore Data Load Estimates');
            console.log(`Protocols: ${formatSize(protoSize)}`);
            console.log(`Packs: ${formatSize(packSize)}`);
            console.log(`Drafts: ${formatSize(draftSize)}`);
            console.log(`Stats: ${formatSize(statsSize)}`);
            console.log(`Total: ${formatSize(totalSize)}`);
            console.groupEnd();
        }
    }, [protocols, packs, drafts, stats, pLoad, packLoad, draftLoad, statsLoad]);

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
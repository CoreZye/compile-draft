import { type ReactNode } from 'react';
import { useFirestoreCollection } from '../hooks/useFirestoreCollection';
import { type Protocol, type Pack } from '@/utils/constants';
import { DataContext } from '@/context/DataContext';

export const DataProvider = ({ children }: { children: ReactNode }) => {
    const { data: protocols, loading: pLoad } = useFirestoreCollection<Protocol>('Protocols');
    const { data: packs, loading: packLoad } = useFirestoreCollection<Pack>('Packs');

    const value = {
        protocols,
        packs,
        loading: pLoad || packLoad,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
import { createContext, useContext } from 'react';
import { type Protocol, type Pack } from '@/utils/constants'

interface DataContextType {
    protocols: Protocol[];
    packs: Pack[];
    loading: boolean;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);

export const useGetData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useGetData must be used within a GameDataProvider');
    }
    return context;
};
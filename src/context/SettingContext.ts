import { createContext, useContext } from 'react';

// Define the shape of your settings
export interface AppSettings {
    ownedBoxIds: number[];
    theme: 'dark' | 'light';
    draftLocked: boolean;
}

// Define the shape of the Context (settings + updater functions)
export interface SettingsContextType extends AppSettings {
    setOwnedBoxIds: (ids: number[]) => void;
    setTheme: (t: 'dark' | 'light') => void;
    toggleLock: () => void;
}

// Create the context
export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// The custom hook for components to access the data
export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
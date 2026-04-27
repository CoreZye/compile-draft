import { createContext, useContext } from 'react';

// Define the shape of your settings
export interface AppSettings {
    ownedBoxIds: number[];
    beSure: boolean;
    isLoggedIn: boolean;
    token: string | null;
    name: string | undefined;
    family: string | undefined;
    email: string | undefined;
    subject: string  | undefined;
    image: string | undefined;
    theme: 'dark' | 'light';
    draftLocked: boolean;
}

// Define the shape of the Context (settings + updater functions)
export interface SettingsContextType extends AppSettings {
    setOwnedBoxIds: (ids: number[]) => void;
    setBeSure: (sure: boolean) => void;
    login: (token: string) => void;
    logout: () => void;
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
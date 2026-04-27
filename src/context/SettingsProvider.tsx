import React, { useState, useEffect, useMemo } from 'react';
import { SettingsContext, type AppSettings } from './SettingContext';

const LOCAL_STORAGE_KEY = 'draft_tool_v1_settings';

const DEFAULT_SETTINGS: AppSettings = {
    ownedBoxIds: [],
    beSure: false,
    theme: 'dark',
    draftLocked: false,
};

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
    // 1. Initialize State (Lazy Load from LocalStorage)
    const [settings, setSettings] = useState<AppSettings>(() => {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!saved) return DEFAULT_SETTINGS;
        try {
            return JSON.parse(saved);
        } catch (e) {
            console.error("Malformed settings in localStorage", e);
            return DEFAULT_SETTINGS;
        }
    });

    // 2. Persist to LocalStorage whenever settings change
    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    }, [settings]);

    // 3. Define Updater Actions
    const setOwnedBoxIds = (ids: number[]) => {
        setSettings(prev => ({ ...prev, ownedBoxIds: ids }));
    };

    const setBeSure = (sure: boolean) => {
        setSettings(prev => ({ ...prev, beSure: sure }));
    };

    const setTheme = (theme: 'dark' | 'light') => {
        setSettings(prev => ({ ...prev, theme }));
    };

    const toggleLock = () => {
        setSettings(prev => ({ ...prev, draftLocked: !prev.draftLocked }));
    };

    // 4. Memoize the value to prevent unnecessary re-renders of consumers
    const contextValue = useMemo(() => ({
        ...settings,
        setOwnedBoxIds,
        setBeSure,
        setTheme,
        toggleLock
    }), [settings]);

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
};
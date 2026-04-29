import React, { useState, useEffect, useMemo } from 'react';
import { SettingsContext, type AppSettings } from './SettingContext';
import { jwtDecode, type JwtPayload } from "jwt-decode";

const LOCAL_STORAGE_KEY = 'draft_tool_v1_settings';

const DEFAULT_SETTINGS: AppSettings = {
    ownedBoxIds: [],
    beSure: false,
    theme: 'dark',
    isLoggedIn: false,
    token: null,
    name: undefined,
    family: undefined,
    email: undefined,
    subject: undefined,
    image: undefined,
    draftLocked: false,
    lastPlayerOneName: undefined,
    lastPlayerTwoName: undefined
};

interface CustomJwtPayload extends JwtPayload {
    given_name?: string;
    picture?: string;
    family_name?: string;
    email?: string;
}

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
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

    const setPlayerNames = (nameOne: string, nameTwo: string) => {
        setSettings(prev => ({ ...prev, lastPlayerOneName: nameOne, lastPlayerTwoName: nameTwo }));
    };

    const login = (token: string) => {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        setSettings(prev => ({ ...prev, 
            isLoggedIn: true,
            token: token,
            name: decoded.given_name,
            subject: decoded.sub,
            image: decoded.picture,
            email: decoded.email,
            family: decoded.family_name
        }));
    }

    const logout = () => {
        setSettings(prev => ({ ...prev,
            isLoggedIn: false,
            name: undefined,
            subject: undefined,
            email: undefined,
            family: undefined
        }));
    }

    // 4. Memoize the value to prevent unnecessary re-renders of consumers
    const contextValue = useMemo(() => ({
        ...settings,
        setOwnedBoxIds,
        setBeSure,
        setTheme,
        login,
        logout,
        toggleLock,
        setPlayerNames,
    }), [settings]);

    return (
        <SettingsContext.Provider value={contextValue}>
            {children}
        </SettingsContext.Provider>
    );
};
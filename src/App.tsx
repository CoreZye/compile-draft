import './App.css'
import { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.css';
import {SettingsProvider} from "./context/SettingsProvider.tsx";
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { faHome, faUser, faBook, faLineChart, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import Draft from "@/components/Draft";
import Toolbar from "@/components/Toolbar";
import Home from '@/components/Home';
import Stats from '@/components/Stats';
import Codex from '@/components/Codex';
//import Settings from '@/components/Settings';
import Profile from '@/components/Profile';
import { VIEWS}  from "@/utils/constants.ts";
import { CustomProvider } from 'rsuite';
import _FactionManager from './components/minor/FactionManager';

export interface MenuItem {
    id: string;
    title: string;
    icon: IconDefinition;
    component: React.FC
}

const menu : MenuItem[] = [
    { id: VIEWS.HOME, title: 'Home', icon: faHome, component: Home },
    { id: VIEWS.STATS, title: 'Stats', icon: faLineChart, component: Stats },
    { id: VIEWS.DRAFT, title: 'Draft', icon: faCrosshairs, component: Draft },
    { id: VIEWS.CODEX, title: 'Codex', icon: faBook, component: Codex },
    { id: VIEWS.PROFILE, title: 'Profile', icon: faUser, component: Profile },
]
const lsActiveComp = 'activeComponent';

function App() {
    const [activeView, setActiveView] = useState(() => {
        const saved = localStorage.getItem(lsActiveComp);
        const isValid = menu.some(item => item.id === saved);
        return isValid ? saved! : VIEWS.HOME;
    });
    const currentMenuItem = menu.find(item => item.id === activeView);
    const ActivePage = currentMenuItem?.component ?? Home;

    const updateActiveComponent = (newComp: string) => {
        setActiveView(newComp);
        localStorage.setItem(lsActiveComp, newComp);
    }

    useGoogleOneTapLogin({
        onSuccess: (credentialResponse) => {
            console.log(credentialResponse);
        },
        onError: () => {
            console.log('One Tap Login Failed');
        },
        auto_select: true,
    });

    return (
        <div id={'main'}>
            <CustomProvider theme={'dark'}>
                <SettingsProvider>
                    <div className='app' id='app'>
                        <ActivePage />
                    </div>
                    <Toolbar menu={menu} activeView={activeView} onViewChange={updateActiveComponent}/>
                </SettingsProvider>
            </CustomProvider>
        </div>
    )
}

export default App

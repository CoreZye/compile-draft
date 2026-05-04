import '@/css/App.css'
import { useState } from 'react';
import { CustomProvider, Text } from 'rsuite';
import { SettingsProvider } from "@/context/SettingsProvider.tsx";
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { VIEWS }  from "@/utils/constants.ts";
import Draft from "@/components/Draft";
import Toolbar from "@/components/Toolbar";
import Home from '@/components/Home';
import Stats from '@/components/Stats';
import Codex from '@/components/Codex';
import Profile from '@/components/Profile';
import { type IconType } from 'react-icons';
import { GiCardExchange } from "react-icons/gi";
import { FaBook, FaHome, FaUser } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { PWAProvider } from '@/context/PWAContext';
import useWindowSize from '@/hooks/useWindowSize';

export interface MenuItem {
    id: string;
    title: string;
    icon: IconType;
    component: React.FC
}

const menu : MenuItem[] = [
    { id: VIEWS.HOME, title: 'Home', icon: FaHome, component: Home },
    { id: VIEWS.STATS, title: 'Stats', icon: FaChartLine, component: Stats },
    { id: VIEWS.DRAFT, title: 'Draft', icon: GiCardExchange, component: Draft },
    { id: VIEWS.CODEX, title: 'Codex', icon: FaBook, component: Codex },
    { id: VIEWS.PROFILE, title: 'Profile', icon: FaUser, component: Profile },
]
const lsActiveComp = 'activeComponent';

function App() {
    const { width, height } = useWindowSize();
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
                <PWAProvider>
                    <SettingsProvider>
                        <div className='app' id='app'>
                            {width < 300 || height < 500 ?
                                <div className='applicationSizeError'>
                                    Screen too small for the application to function properly
                                    <Text muted>Try in another orientation</Text>
                                </div>
                                
                            :
                                <ActivePage />       
                            }
                        </div>
                        <Toolbar menu={menu} activeView={activeView} onViewChange={updateActiveComponent}/> 
                    </SettingsProvider>
                </PWAProvider>
            </CustomProvider>
        </div>
    )
}

export default App

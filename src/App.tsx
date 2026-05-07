import '@/css/App.css'
import { useState } from 'react';
import { CustomProvider, Text } from 'rsuite';
import { SettingsProvider } from "@/context/SettingsProvider.tsx";
// import { useGoogleOneTapLogin } from '@react-oauth/google';
import { VIEWS }  from "@/utils/constants.ts";
import Draft from "@/components/pages/Draft.tsx";
import Toolbar from "@/components/Toolbar";
import Home from '@/components/pages/Home.tsx';
import Stats from '@/components/pages/Stats.tsx';
import Codex from '@/components/pages/Codex.tsx';
import Profile from '@/components/pages/Profile.tsx';
import { type IconType } from 'react-icons';
import { GiCardExchange } from "react-icons/gi";
import { FaBook, FaHome, FaUser } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { PWAProvider } from '@/context/PWAContext';
import useWindowSize from '@/hooks/useWindowSize';
import { DataProvider } from '@/context/DataProvider';
import { type PageProps} from "@/utils/types.ts";

export interface MenuItem {
    id: string;
    title: string;
    icon: IconType;
    component: React.FC<PageProps>,
    sub?: SubMenuItem[]
}

export interface SubMenuItem {
    id: string;
    title: string;
}

const menu : MenuItem[] = [
    { id: VIEWS.HOME, title: 'Home', icon: FaHome, component: Home },
    { id: VIEWS.STATS, title: 'Stats', icon: FaChartLine, component: Stats, sub: [
            {id: VIEWS.STATS_GLOBAL, title: 'Global', },
            {id: VIEWS.STATS_PERSONAL, title: 'Personal', },
        ]
    },
    { id: VIEWS.DRAFT, title: 'Draft', icon: GiCardExchange, component: Draft, sub: [
            {id: VIEWS.DRAFT_START, title: 'Start Draft', },
            {id: VIEWS.DRAFT_JOIN, title: 'Join Draft', }
        ]
    },
    { id: VIEWS.CODEX, title: 'Codex', icon: FaBook, component: Codex, sub: [
            {id: VIEWS.CODEX_OVERVIEW, title: 'All Protocols', },
            {id: VIEWS.CODEX_TAGS, title: 'Filtered', }
        ]
    },
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
    const [activeSubMenuItem, setActiveSubMenuItem] = useState<string | undefined>(undefined);
    const currentMenuItem = menu.find(item => item.id === activeView);
    const ActivePage = currentMenuItem?.component ?? Home;

    const updateActiveComponent = (newComp: string) => {
        setActiveView(newComp);
        localStorage.setItem(lsActiveComp, newComp);
    }

    const updateActiveSubItem = (newMenuItem: string|undefined) => {
        setActiveSubMenuItem(newMenuItem)
    }

    // useGoogleOneTapLogin({
    //     onSuccess: (credentialResponse) => {
    //         console.log(credentialResponse);
    //     },
    //     onError: () => {
    //         console.log('One Tap Login Failed');
    //     },
    //     auto_select: true,
    // });

    return (
        <div id={'main'}>
            <CustomProvider theme={'dark'}>
                <PWAProvider>
                    <SettingsProvider>
                        <DataProvider>
                            <div className='app' id='app'>
                                {width < 300 || height < 500 ?
                                    <div className='applicationSizeError'>
                                        Screen too small for the application to function properly
                                        <Text muted>Try in another orientation</Text>
                                    </div>

                                :
                                    <ActivePage
                                        subMenu={currentMenuItem!.sub}
                                        activeSub={activeSubMenuItem ?? currentMenuItem!.sub?.[0].id}
                                    />
                                }
                            </div>
                            <Toolbar menu={menu} activeView={activeView} onViewChange={updateActiveComponent} onSubChange={updateActiveSubItem}/>
                        </DataProvider>
                    </SettingsProvider>
                </PWAProvider>
            </CustomProvider>
        </div>
    )
}

export default App

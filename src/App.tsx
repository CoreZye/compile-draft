import {useState} from 'react';
import './App.css'
import '@fortawesome/fontawesome-free/css/all.css';
import {SettingsProvider} from "./context/SettingsProvider.tsx";
import { useGoogleOneTapLogin } from '@react-oauth/google';
import Draft from "@/components/Draft";
import Toolbar from "@/components/Toolbar";
import Home from '@/components/Home';
import Stats from '@/components/Stats';
import Codex from '@/components/Codex';
import Profile from '@/components/Profile';
import {VIEWS} from "@/utils/constants.ts";
import { CustomProvider } from 'rsuite';

const COMPONENT_REGISTRY = {
    [VIEWS.HOME]: Home,
    [VIEWS.STATS]: Stats,
    [VIEWS.DRAFT]: Draft,
    [VIEWS.CODEX]: Codex,
    [VIEWS.PROFILE]: Profile,
};
function App() {
    const [activeView, setActiveView] = useState(VIEWS.HOME);
    useGoogleOneTapLogin({
        onSuccess: (credentialResponse) => {
            console.log(credentialResponse);
        },
        onError: () => {
            console.log('One Tap Login Failed');
        },
        auto_select: true,
    });
    const ActivePage = COMPONENT_REGISTRY[activeView];
  return (
    <div id={'main'}>
        <CustomProvider theme={'dark'}>
            <SettingsProvider>
                <div className='app'>
                    {ActivePage ? <ActivePage /> : <Home />}
                </div>
                <Toolbar activeView={activeView} onViewChange={setActiveView}/>
            </SettingsProvider>
        </CustomProvider>
    </div>
  )
}

export default App

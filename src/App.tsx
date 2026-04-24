import {useState} from 'react';
import './App.css'
import '@fortawesome/fontawesome-free/css/all.css';
import {SettingsProvider} from "./context/SettingsProvider.tsx";
import { useGoogleOneTapLogin } from '@react-oauth/google';
import Draft from "@/components/Draft";
import Toolbar from "@/components/Toolbar.tsx";
import {VIEWS} from "@/utils/constants.ts";
import Settings from "@/components/Settings.tsx";
import Profile from "@/components/Profile.tsx";
import Home from "@/components/Home.tsx";
import Stats from "@/components/Stats.tsx";
import { CustomProvider } from 'rsuite';

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
  return (
    <div id={'main'}>
        <CustomProvider theme={'dark'}>
            <SettingsProvider>
                <div className={'app'}>
                    {activeView === VIEWS.HOME && <Home/>}
                    {activeView === VIEWS.STATS && <Stats/>}
                    {activeView === VIEWS.DRAFT && <Draft/>}
                    {activeView === VIEWS.SETTINGS && <Settings/>}
                    {activeView === VIEWS.PROFILE && <Profile/>}
                </div>
                <Toolbar activeView={activeView} onViewChange={setActiveView}/>
            </SettingsProvider>
        </CustomProvider>
    </div>
  )
}

export default App

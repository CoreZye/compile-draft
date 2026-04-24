import {useState} from 'react';
import './App.css'
import '@fortawesome/fontawesome-free/css/all.css';
import {SettingsProvider} from "./context/SettingsProvider.tsx";
import Toolbar from "@/components/Toolbar.tsx";
// import Setup from "./components/Setup";
// import Template from "./components/Template.tsx";
import  {VIEWS, MENU} from "@/utils/constants.ts";
import Home from '@/components/Home';
import Stats from '@/components/Stats';
import Draft from '@/components/Draft';
import Codex from '@/components/Codex';
import Profile from '@/components/Profile';

const COMPONENT_REGISTRY = {
    [VIEWS.HOME]: Home,
    [VIEWS.STATS]: Stats,
    [VIEWS.DRAFT]: Draft,
    [VIEWS.CODEX]: Codex,
    [VIEWS.PROFILE]: Profile,
};
function App() {
    const [activeView, setActiveView] = useState(VIEWS.HOME);
    const ActivePage = COMPONENT_REGISTRY[activeView];
  return (
    <div id={'main'}>
        <SettingsProvider>
            <div className='app'>
                {ActivePage ? <ActivePage /> : <Home />}
            </div>
            <Toolbar activeView={activeView} onViewChange={setActiveView}/>
        </SettingsProvider>
    </div>
  )
}

export default App

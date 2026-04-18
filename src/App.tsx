import {useState} from 'react';
import './App.css'
import '@fortawesome/fontawesome-free/css/all.css';
import {SettingsProvider} from "./context/SettingsProvider.tsx";
import Draft from "@/components/Draft";
import Toolbar from "@/components/Toolbar.tsx";
// import Setup from "./components/Setup";
// import Template from "./components/Template.tsx";
import  {VIEWS} from "@/utils/constants.ts";
import Settings from "@/components/Settings.tsx";
import Profile from "@/components/Profile.tsx";
import Home from "@/components/Home.tsx";
import Stats from "@/components/Stats.tsx";

function App() {
    const [activeView, setActiveView] = useState(VIEWS.HOME);
  return (
    <div id={'main'}>
        <SettingsProvider>
            <div className={'app'}>
                {activeView === VIEWS.HOME && <Home/>}
                {activeView === VIEWS.STATS && <Stats/>}
                {activeView === VIEWS.DRAFT && <Draft/>}
                {activeView === VIEWS.SETTINGS && <Settings/>}
                {activeView === VIEWS.PROFILE && <Profile/>}
                {/*<Setup/>*/}
                {/*<Template/>*/}
            </div>
            <Toolbar activeView={activeView} onViewChange={setActiveView}/>
        </SettingsProvider>
    </div>
  )
}

export default App

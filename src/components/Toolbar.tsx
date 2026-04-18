import './Toolbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faCog, faLineChart, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
import  {VIEWS} from "@/utils/constants.ts";

interface ToolbarProps {
    activeView: string;
    onViewChange: (view: string) => void;
}
function Toolbar({ activeView, onViewChange }: ToolbarProps) {
    const menu = [
        { id: VIEWS.HOME, title: 'Home', icon: faHome },
        { id: VIEWS.STATS, title: 'Stats', icon: faLineChart },
        { id: VIEWS.DRAFT, title: 'Draft', icon: faCrosshairs },
        { id: VIEWS.SETTINGS, title: 'Settings', icon: faCog },
        { id: VIEWS.PROFILE, title: 'Profile', icon: faUser },
    ]
    return (
        <nav className="toolbar">
            {menu.map((item) => {
                return (
                    <div className={'toolbar-item' + (activeView=== item.id ? ' active': '') } onClick={()=> {
                        onViewChange(item.id);
                    }}>
                        <div className="nav-item">
                            <FontAwesomeIcon icon={item.icon} size={'lg'} />
                            {item.title}
                        </div>
                    </div>
                )
            })}
        </nav>
    );
}

export default Toolbar;
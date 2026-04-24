import './Toolbar.css';
import {Badge, Avatar} from 'rsuite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUser, faBook, faLineChart, faCrosshairs } from '@fortawesome/free-solid-svg-icons';
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
        { id: VIEWS.CODEX, title: 'Codex', icon: faBook },
        { id: VIEWS.PROFILE, title: 'Profile', icon: faUser },
    ]
    const loggedIn = true;
    return (
        <nav className="toolbar">
            {menu.map((item, idx) => {
                return (
                    <div key={idx} className={'toolbar-item' + (activeView=== item.id ? ' active': '') } onClick={()=> {
                        onViewChange(item.id);
                    }}>
                        <div className="nav-item">
                            {item.id === VIEWS.PROFILE && loggedIn?
                                <Badge content={2} shape="circle" invisible>
                                    <Avatar src="https://i.pravatar.cc/150?u=2" circle size={'md'} style={{marginBottom: '2.5px'}} />
                                </Badge>
                                :
                                <>
                                    <FontAwesomeIcon icon={item.icon} size={'lg'} />
                                    {item.title}
                                </>
                            }

                        </div>
                    </div>
                )})
            }
        </nav>
    );
}

export default Toolbar;
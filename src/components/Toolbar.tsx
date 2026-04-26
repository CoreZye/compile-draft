import './Toolbar.css';
import {Badge, Avatar} from 'rsuite';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VIEWS } from "@/utils/constants.ts";
import { type MenuItem } from '@/App';

interface ToolbarProps {
    activeView: string;
    onViewChange: (view: string) => void;
    menu: MenuItem[];
}
function Toolbar({ activeView, onViewChange, menu }: ToolbarProps) {
    const [loggedIn, _setLoggedIn] = useState(true);
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
                                    <Avatar 
                                        src="https://lh3.googleusercontent.com/a/ACg8ocJk8u6dy43ensnKJXUBqKJG-OjRYFH3wO7aGsN4QCSf4dS_v8J2=s96-c" 
                                        circle size={'md'} 
                                        style={{marginBottom: '2.5px'}} 
                                    />
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
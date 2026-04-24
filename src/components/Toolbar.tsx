import './Toolbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import  {MENU} from "@/utils/constants.ts";

interface ToolbarProps {
    activeView: string;
    onViewChange: (view: string) => void;
}
function Toolbar({ activeView, onViewChange }: ToolbarProps) {
    return (
        <nav className="toolbar">
            {MENU.map((item) => {
                return (
                    <div 
                        key={item.id}
                        className={'toolbar-item' + (activeView=== item.id ? ' active': '') }
                        onClick={()=> {
                            onViewChange(item.id);
                        }}
                    >
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
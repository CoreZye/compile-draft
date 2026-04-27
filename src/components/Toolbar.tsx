import './Toolbar.css';
import {Badge, Avatar, Modal, ButtonGroup, Button} from 'rsuite';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { VIEWS } from "@/utils/constants.ts";
import { type MenuItem } from '@/App';

interface ToolbarProps {
    activeView: string;
    onViewChange: (view: string) => void;
    menu: MenuItem[];
    beSure?: boolean
}
function Toolbar({ activeView, onViewChange, menu, beSure = false }: ToolbarProps) {
    const [loggedIn] = useState(false);
    const [chosen, setChosen] = useState<string|null>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleClick = (proceed: boolean) => {
        setOpenModal(false);
        if (proceed) {
            onViewChange(chosen!);
        }
    }
    return (
        <nav className="toolbar">
            {menu.map((item, idx) => {
                return (
                    <div key={idx} className={'toolbar-item' + (activeView=== item.id ? ' active': '') } onClick={()=> {
                        if (beSure) {
                            setChosen(item.id);
                            setOpenModal(true);
                        } else {
                            onViewChange(item.id);
                        }
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
            <Modal open={openModal} size={'xs'} centered >
                <Modal.Title style={{fontSize: 24}}>
                    Are you sure?
                </Modal.Title>
                <Modal.Body textAlign={'center'} style={{
                    margin: 10
                }}>
                    You might lose some progress
                </Modal.Body>
                <Modal.Footer>
                    <ButtonGroup justified>
                        <Button onClick={() => {
                            handleClick(false)
                        }}>No</Button>
                        <Button className={'closeBtn'} onClick={() => {
                            handleClick(true)
                        }}>Yes</Button>
                    </ButtonGroup>
                </Modal.Footer>
            </Modal>
        </nav>
    );
}

export default Toolbar;
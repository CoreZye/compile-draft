import '@/css/Toolbar.less';
import { Badge, Avatar, Modal, ButtonGroup, Button, Text } from 'rsuite';
import { useState } from 'react';
import { VIEWS } from "@/utils/constants.ts";
import { type MenuItem } from '@/App';
import { useSettings } from "@/context/SettingContext.ts";

interface ToolbarProps {
    activeView: string;
    onViewChange: (view: string) => void;
    menu: MenuItem[];
    beSure?: boolean
}
function Toolbar({ activeView, onViewChange, menu }: ToolbarProps) {
    const {beSure, setBeSure, isLoggedIn, image } = useSettings();
    const [chosen, setChosen] = useState<string|null>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleClick = (proceed: boolean) => {
        setOpenModal(false);
        if (proceed) {
            onViewChange(chosen!);
            setBeSure(false);
        }
    }
    return (
        <nav className="toolbar">
            {menu.map((item, idx) => {
                return (
                    <div key={idx} className={'toolbar-item' + (activeView === item.id ? ' active': '') } 
                        onClick={()=> {
                            if (activeView !== item.id) {
                                if (beSure) {
                                    setChosen(item.id);
                                    setOpenModal(true);
                                } else {
                                    onViewChange(item.id);
                                }
                            }
                        }}
                    >
                        <div className="nav-item">
                            {item.id === VIEWS.PROFILE && isLoggedIn?
                                <Badge content={2} shape="circle" invisible>
                                    <Avatar 
                                        src={image}
                                        circle size={'md'} 
                                        style={{marginBottom: '4px'}} 
                                    />
                                </Badge>
                                :
                                <>
                                    <item.icon size={24} />
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
                <Modal.Body 
                    textAlign={'center'} 
                    style={{
                        margin: 20
                    }}
                >
                    <Text>
                        You might lose some progress
                    </Text>
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
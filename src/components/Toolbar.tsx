import '@/css/Toolbar.less';
import {Badge, Avatar, Modal, ButtonGroup, Button, Text, Nav} from 'rsuite';
import {useEffect, useState} from 'react';
import { VIEWS } from "@/utils/constants.ts";
import { type MenuItem } from '@/App';
import { useSettings } from "@/context/SettingContext.ts";

interface ToolbarProps {
    activeView: string;
    onViewChange: (view: string) => void;
    onSubChange: (item: string|undefined) => void;
    menu: MenuItem[];
    beSure?: boolean
}
function Toolbar({ activeView, onViewChange, menu, onSubChange }: ToolbarProps) {
    const {beSure, setBeSure, isLoggedIn, image } = useSettings();
    const [chosen, setChosen] = useState<string|null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [activeSub, setActiveSub] = useState<string|undefined>(undefined);
    const subMenu = menu.find((item) => {
        return item.id === activeView
    })?.sub;

    const handleClick = (proceed: boolean) => {
        setOpenModal(false);
        if (proceed) {
            updateSelected(chosen!);
            setBeSure(false);
        }
    }

    const updateSelected = (key: string) => {
        setActiveSub(undefined);
        onViewChange(key);
    }

    const updateSelectedSubmenu = (key: string) => {
        if (key !== activeSub) {
            setActiveSub(key);
        }
    }

    useEffect(() => {
        onSubChange(activeSub)
    }, [onSubChange, activeSub])

    return (
        <>
            {subMenu &&
                <nav className="sub-nav" key={activeView}>
                    <Nav
                        reversed
                        activeKey={activeSub || subMenu[0].id}
                        onSelect={updateSelectedSubmenu}
                        appearance="subtle"
                        justified
                    >
                        {subMenu.map(item => (
                            <Nav.Item key={item.id} eventKey={item.id}>{item.title}</Nav.Item>
                        ))}
                    </Nav>
                </nav>
            }

            <nav className={"toolbar " + (subMenu ? 'hasSubNav' : '')}>
                {menu.map((item, idx) => {
                    return (
                        <div key={idx} className={'toolbar-item' + (activeView === item.id ? ' active': '') }
                            onClick={()=> {
                                if (activeView !== item.id) {
                                    if (beSure) {
                                        setChosen(item.id);
                                        setOpenModal(true);
                                    } else {
                                        updateSelected(item.id);
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
        </>
    );
}

export default Toolbar;
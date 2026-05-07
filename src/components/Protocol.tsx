import '@/css/Protocol.less'
import React, { useState, useImperativeHandle, forwardRef, useRef } from 'react';
import {
    Modal,
    Steps,
    Divider,
    Text,
    HStack,
    Tag,
    Heading,
    TagGroup,
    IconButton,
    ButtonGroup,
    Drawer
} from 'rsuite';
import { Close } from "@rsuite/icons";
import { iconMap, type Protocol, type Pack} from '@/utils/constants.ts';
import tempCard from '@/assets/temp-card.webp';
const rawImages = import.meta.glob('@/assets/cards/*.webp', {
    eager: true,
    import: 'default'
});
const cardImages: Record<string, string> = Object.entries(rawImages).reduce(
    (acc, [path, url]) => {
        const name = path.split('/').pop()!.replace('.webp', '');
        acc[name] = url as string;
        return acc;
    },
    {} as Record<string, string>
);

export interface ProtocolModalHandle {
    open: (protocol: Protocol, pack?: Pack | undefined) => void;
}

type ProtocolModalProps = object;

const ProtocolModal = forwardRef<ProtocolModalHandle, ProtocolModalProps>((_props, ref) => {
    const elementMargin = 20;
    const [open, setOpen] = useState(false);
    const [protocol, setProtocol] = useState<Protocol | null>(null);
    const [pack, setPack] = useState<Pack | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
    const closeDrawer = () => setActiveDrawerId(null);

    useImperativeHandle(ref, () => ({
        open: (data, pack) => {
            setProtocol(data);
            setPack(pack ?? null)
            setOpen(true);
            setCurrentStep(0);
        }
    }));

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        const index = Math.round(element.scrollLeft / (element.offsetWidth+(elementMargin*2)));

        if (index !== currentStep) {
            setCurrentStep(index);
        }
    }

    const handleClick = (step: number) => {
        setCurrentStep(step);
        const container = containerRef.current;
        if (container) {
            const slideWidth = container.offsetWidth + elementMargin*2;
            const targetScroll = step * slideWidth;
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    }

    if (!protocol) return null;

    return (
        <Modal className={'protocolModal'} open={open} onClose={() => setOpen(false)} size="full" backdrop={'static'}>
            {pack && <div className={'protocol-banner card-view ' + ('cycle-' + pack.cycle)}>{pack.name}</div>}
            <Modal.Body>
                <div id="protocol-view">
                    <div className='headerInfo'>
                        <Heading textAlign={'center'}>{protocol.name}</Heading>
                        <Text align="center">{protocol.flavor}</Text>
                        <Text align="center" muted><i>{protocol.info}</i></Text>
                        <Divider />
                    </div>
                    
                    <div className={'carousel-parent'} ref={containerRef} onScroll={handleScroll} >
                        {protocol.cards.map((card, idx) => {
                            const cardName = protocol.name + ' ' + card.value;
                            const cardCodename = protocol.name.toLowerCase() + '-' + card.value;
                            const cardImage = cardImages[cardCodename] ?? tempCard;
                            return (
                                <div key={idx} className={'carousel-item'} style={{margin: `0 ${elementMargin}px`,}} >
                                    <div className={'cardImage'} style={{backgroundImage: `url(${cardImage})`,}} ></div>

                                    <div className={'tags'}>
                                        <Divider />                                        
                                        <HStack justify={'center'} >
                                            <TagGroup justify={'center'}>
                                                {card.tags.map((tag, idx) => (
                                                    <Tag key={idx} size="sm">{tag}</Tag>
                                                ))}
                                                {card.errata && Object.entries(card.errata).length > 0 &&
                                                    <Tag size="sm" className={'errataTag'} onClick={() => {
                                                        setActiveDrawerId(cardCodename);
                                                    }}>Errata*</Tag>
                                                }
                                            </TagGroup>
                                        </HStack>
                                        <Divider />
                                    </div>

                                    <Drawer
                                        className={'errataDrawer'}
                                        backdrop={false}
                                        key={`drawer-${cardCodename}`}
                                        open={activeDrawerId === cardCodename}
                                        onClose={closeDrawer}
                                        onClick={closeDrawer}
                                        closeButton={false}
                                        size="md"
                                    >
                                        <Drawer.Header>
                                            <Drawer.Title>
                                                {cardName}
                                            </Drawer.Title>
                                        </Drawer.Header>
                                        <Drawer.Body>
                                            <div style={{overflowY: 'scroll'}}>
                                                <Divider/>
                                                {card.errata && card.errata.map((text) => {
                                                    if (!text) return null;
                                                    return (
                                                        <div className={'errataText'}>
                                                            {text}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className={'footer'}>
                                                <Drawer.Actions style={{width: '100%'}}>
                                                    <ButtonGroup justified>
                                                        <IconButton className={'closeBtn'} placement={'right'} onClick={closeDrawer} icon={<Close />} size="md">
                                                            Close Errata
                                                        </IconButton>
                                                    </ButtonGroup>
                                                </Drawer.Actions>
                                            </div>
                                        </Drawer.Body>
                                    </Drawer>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className={'footer'} >
                <Steps current={currentStep} small className={'custom-steps'}>
                    {protocol.cards.map((card, idx) => {
                        const Icon = iconMap[card.value];
                        return (
                            <Steps.Item
                                key={idx}
                                icon={<Icon size={26} />}
                                status={currentStep === idx ? 'process' : 'wait'}
                                onClick={() => handleClick(idx)}
                            />
                        );
                    })}
                </Steps>
                <ButtonGroup justified>
                    <IconButton className={'closeBtn'} placement={'right'} onClick={() => setOpen(false)} icon={<Close />} size="md" >Close</IconButton>
                </ButtonGroup>
            </Modal.Footer>
        </Modal>
    );
});

export default ProtocolModal;
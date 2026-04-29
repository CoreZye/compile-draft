import '@/css/Protocol.css'
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
import { Close, Star } from "@rsuite/icons";
import { iconMap, CARDS, type DraftItem, PACKS } from '@/utils/constants.ts';
import compileCard from '@/assets/temp-card.webp';
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
    open: (protocol: DraftItem) => void;
}

type ProtocolModalProps = object;

const ProtocolModal = forwardRef<ProtocolModalHandle, ProtocolModalProps>((_props, ref) => {
    const [open, setOpen] = useState(false);
    const [protocol, setProtocol] = useState<DraftItem | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeDrawerId, setActiveDrawerId] = useState<string | null>(null);
    const closeDrawer = () => setActiveDrawerId(null);

    useImperativeHandle(ref, () => ({
        open: (data) => {
            setProtocol(data);
            setOpen(true);
            setCurrentStep(0);
        }
    }));

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const element = e.currentTarget;
        const index = Math.round(element.scrollLeft / element.offsetWidth);

        if (index !== currentStep) {
            setCurrentStep(index);
        }
    }

    const handleClick = (step: number) => {
        setCurrentStep(step);
        const container = containerRef.current;
        if (container) {
            const slideWidth = container.offsetWidth;
            const targetScroll = step * slideWidth;
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    }

    if (!protocol) return null;

    const pack = PACKS.find((pack) =>  (
        pack.contains.includes(protocol.id)
    ))

    const cards = CARDS.filter((card) => (
        card.protocol === protocol.id
    ))

    return (
        <Modal open={open} onClose={() => setOpen(false)} size="full" backdrop={'static'}>
            <Modal.Body>
                <div id="protocol-view">
                    <Heading textAlign={'center'}>{protocol.name}</Heading>
                    <Text align="center">{protocol.flavor}</Text>
                    <Text align="center" muted><i>{protocol.info}</i></Text>

                    <Divider />
                    <div
                        ref={containerRef}
                        onScroll={handleScroll}
                        className={'carousel-parent'}
                    >
                        {cards.map((card, idx) => {
                            const cardName = protocol.name + ' ' + card.value;
                            const cardCodename = protocol.name.toLowerCase() + '-' + card.value;
                            const cardImage = cardImages[cardCodename] ?? compileCard;
                            return (
                                <div key={idx} className={'carousel-item'} >
                                    <div className={'cardImage'}>
                                        <img alt={cardName} src={cardImage} style={{ width: '100%' }} />
                                        {card.errata && Object.entries(card.errata).length > 0 &&
                                            <Star color={'red'} size={45} className={'errata'} onClick={() => {
                                                setActiveDrawerId(cardCodename);
                                            }}/>
                                        }
                                    </div>
                                    <Divider />

                                    <HStack justify={'center'}>
                                        <TagGroup justify={'center'}>
                                            {card.tags.map((tag, idx) => (
                                                <Tag key={idx} size="sm">{tag}</Tag>
                                            ))}
                                            {pack &&
                                                <Tag size="sm" className={'pack-name ' + ('cycle-' + pack.cycle)}>{pack.name}</Tag>
                                            }
                                            {card.errata && Object.entries(card.errata).length > 0 &&
                                                <Tag size="sm" className={'errataTag'} onClick={() => {
                                                    setActiveDrawerId(cardCodename);
                                                }}>Errata*</Tag>
                                            }
                                        </TagGroup>
                                    </HStack>

                                    <div key={'errata-' + protocol.id} className={'errata'}>
                                        <Drawer
                                            className={'errataDrawer'}
                                            backdropClassName={'errataDrawer'}
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
                                                    {card.errata && Object.entries(card.errata).map(([place, text]) => {
                                                        if (!text) return null;
                                                        return (
                                                            <div className={'errataText ' + place}>
                                                                {text}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className={'flexBottom'}>
                                                    <Drawer.Actions>
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
                                </div>
                            )
                        })}
                    </div>

                    <Divider />

                    <Steps current={currentStep} small className={'custom-steps'}>
                        {cards.map((card, idx) => {
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
                </div>
            </Modal.Body>
            <Modal.Footer>
                <ButtonGroup justified>
                    <IconButton className={'closeBtn'} placement={'right'} onClick={() => setOpen(false)} icon={<Close />} size="md" >Close</IconButton>
                </ButtonGroup>
            </Modal.Footer>
        </Modal>
    );
});

export default ProtocolModal;
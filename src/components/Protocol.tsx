import '@/css/Protocol.css'
import { useState, useImperativeHandle, forwardRef } from 'react';
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
    Whisper,
    Tooltip
} from 'rsuite';
import {Close, Star} from "@rsuite/icons";
import {iconMap, CARDS, type DraftItem, PACKS} from '@/utils/constants.ts';
import compileCard from '@/assets/temp-card.webp';
import {useSwipe} from "@/utils/useSwipe.ts";

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

    useImperativeHandle(ref, () => ({
        open: (data) => {
            setProtocol(data);
            setOpen(true);
            setCurrentStep(0);
        }
    }));

    const handlers = useSwipe(
        () => {
            const nextStep = currentStep +1;
            if (nextStep < 6) {
                setCurrentStep(nextStep);
            }
        },
        () => {
            const prevStep = currentStep -1;
            if (prevStep >= 0) {
                setCurrentStep(prevStep);
            }
        }
    );

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
                    {cards.map((card, idx) => {
                        const cardCodename = protocol.name.toLowerCase() + '-' + card.value;
                        const cardImage = cardImages[cardCodename] ?? compileCard;
                        return (
                            <div key={idx} hidden={currentStep !== idx} {...handlers}>
                                <div className={'cardImage'}>
                                    <img
                                        style={{ width: '100%' }}
                                        src={cardImage}
                                        alt={protocol.name + ' ' + card.value}
                                    />
                                    {card.errata && Object.entries(card.errata).map(([place, text]) => {
                                        if (!text) return null;
                                        return (
                                            <div key={protocol.id + place} className={'errata ' + place}>
                                                <Whisper
                                                    placement={'autoVerticalEnd'}
                                                    trigger="click"
                                                    speaker={
                                                        <Tooltip className={'full-width-tooltip'}>
                                                            <Text size={16}>
                                                                {text}
                                                            </Text>
                                                        </Tooltip>
                                                    }
                                                >
                                                    <Star size={28} color={'red'}/>
                                                </Whisper>

                                            </div>
                                        );
                                    })}
                                </div>
                                <Divider />

                                <HStack justify={'center'}>
                                    <TagGroup justify={'center'}>
                                        {card.tags.map((tag, idx) => (
                                            <Tag key={idx} size="sm">{tag}</Tag>
                                        ))}
                                        {card.errata && Object.entries(card.errata).length > 0 &&
                                            <Tag size="sm" className={'errataTag'}>Errata*</Tag>
                                        }
                                        {pack &&
                                            <Tag size="sm" className={'pack-name ' + ('cycle-' + pack.cycle)}>{pack.name}</Tag>
                                        }
                                    </TagGroup>
                                </HStack>
                            </div>
                        )
                    })}


                    <Divider />

                    <Steps current={currentStep} small className={'custom-steps'}>
                        {cards.map((card, idx) => {
                            const Icon = iconMap[card.value];
                            return (
                                <Steps.Item
                                    key={idx}
                                    icon={<Icon size={26} />}
                                    //status={currentStep === idx ? 'process' : 'wait'}
                                    onClick={() => setCurrentStep(idx)}
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
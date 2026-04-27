import './Protocol.css'
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
import {iconMap, cards, type DraftItem} from '../utils/constants.ts';
import compileCard from '@/assets/compile-card.webp';
import {Close, Star} from "@rsuite/icons";

export interface ProtocolModalHandle {
    open: (protocol: DraftItem) => void;
}

type ProtocolModalProps = object;

const ProtocolModal = forwardRef<ProtocolModalHandle, ProtocolModalProps>((_props, ref) => {
    const [open, setOpen] = useState(false);
    const [protocol, setProtocol] = useState<DraftItem | null>(null);
    const [currentStep, setCurrentStep] = useState<number>(1);
    const errata = [
        {place: 'top', text: '● CLARIFICATION: When Death 0\'s middle command triggers, the owner notes the lines\n' +
                '                                                that need to be acted in. Then, they choose which line to process, one at a time. For\n' +
                '                                                each line, they select an uncovered card to delete, processing the consequences of that\n' +
                '                                                delete before addressing the next line.'},
        {place: 'bottom', text: '● CLARIFICATION: When Death 0\'s middle command triggers, the owner notes the lines\n' +
                '                                                that need to be acted in. Then, they choose which line to process, one at a time. For\n' +
                '                                                each line, they select an uncovered card to delete, processing the consequences of that\n' +
                '                                                delete before addressing the next line.'}
    ]

    useImperativeHandle(ref, () => ({
        open: (data) => {
            setProtocol(data);
            setOpen(true);
            setCurrentStep(1);
        }
    }));

    if (!protocol) return null;

    return (
        <Modal open={open} onClose={() => setOpen(false)} size="full" backdrop={'static'}>
            <Modal.Body>
                <div id="protocol-view">

                    <Heading textAlign={'center'}>{protocol.name}</Heading>
                    <Text align="center">{protocol.flavor}</Text>
                    <Text align="center" muted><i>{protocol.info}</i></Text>

                    <Divider />
                    <div className={'cardImage'}>
                        <img style={{ width: '100%' }} src={compileCard} alt="Shadow" />
                        {errata.map((info) => (
                            <div className={'errata ' + info.place}>
                                <Whisper
                                    placement={'autoVerticalEnd'}
                                    trigger="click"
                                    speaker={
                                        <Tooltip className={'full-width-tooltip'}>
                                            <Text size={16}>
                                                {info.text}
                                            </Text>
                                        </Tooltip>
                                    }
                                >
                                    <Star size={28} color={'red'}/>
                                </Whisper>

                            </div>
                        ))}
                    </div>
                    <Divider />

                    <HStack justify={'center'}>
                        <TagGroup justify={'center'}>
                            <Tag size="sm">Draw</Tag>
                            <Tag size="sm">Flip</Tag>
                            <Tag size="sm">Reveal</Tag>
                            <Tag size="sm">Shift</Tag>
                            {errata.length > 0 ?
                                <Tag size="sm" className={'errataTag'}>Errata*</Tag>
                                 :
                                <></>
                            }
                        </TagGroup>
                    </HStack>

                    <Divider />

                    <Steps current={currentStep} small className={'custom-steps'}>
                        {cards.map((card, idx) => {
                            const cardIdx = idx + 1;
                            const Icon = iconMap[card.value];
                            return (
                                <Steps.Item
                                    key={idx}
                                    icon={<Icon size={26} />}
                                    status={currentStep === cardIdx ? 'process' : 'wait'}
                                    onClick={() => setCurrentStep(cardIdx)}
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
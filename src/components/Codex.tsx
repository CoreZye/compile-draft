import './Codex.css'
import compileCard from '@/assets/compile-card.webp';
import { INITIAL_POOL } from "@/utils/constants";
import { useState, useEffect, useRef } from 'react';
import { Accordion, Steps, Card, Tag, TagGroup, Divider, Text, HStack } from 'rsuite';
import { type IconType} from 'react-icons';
//import { TbNumber0, TbNumber1, TbNumber2, TbNumber3, TbNumber4, TbNumber5, TbNumber6,  } from "react-icons/tb";
import { PiNumberZeroFill, PiNumberOneFill, PiNumberTwoFill, PiNumberThreeFill, PiNumberFourFill, PiNumberFiveFill, PiNumberSixFill } from "react-icons/pi";
 

interface Card {
    value: number;
    top: string;
    middle: string;
    bottom: string
}
const cards: Card[] = [
    { value: 0, top: '', middle: '', bottom: '' },
    { value: 1, top: '', middle: '', bottom: '' },
    { value: 2, top: '', middle: '', bottom: '' },
    { value: 3, top: '', middle: '', bottom: '' },
    { value: 4, top: '', middle: '', bottom: '' },
    { value: 5, top: '', middle: 'Discard 1 card', bottom: '' },
]
const iconMap: Record<number, IconType> = {
    0: PiNumberZeroFill,
    1: PiNumberOneFill,
    2: PiNumberTwoFill,
    3: PiNumberThreeFill,
    4: PiNumberFourFill,
    5: PiNumberFiveFill,
    6: PiNumberSixFill,
}

function Codex () {
    const [currentStep, setCurrentStep] = useState<number>(1);
    const [activeProtocol, setActiveProtocol] = useState<number>(0);
    const panelRefs = useRef<Record<string | number, HTMLDivElement | null>>({});

    useEffect(() => {
        const container = document.getElementById('app')
        const timer = setTimeout(() => {
        if (container) {
                const targetPosition = ((activeProtocol-1) * 44);
                console.log(activeProtocol, targetPosition);

                container.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth',
                });
            }
        }, 10)
        return () => clearTimeout(timer)
    }, [activeProtocol]);

    return (
        <div id={'codex'} >
            <Accordion 
                defaultActiveKey={activeProtocol} 
            >
                {INITIAL_POOL.map((protocol) => {
                    return (
                        <Accordion.Panel 
                            key={protocol.id} 
                            header={protocol.name} 
                            eventKey={protocol.id}
                            onSelect={() => {
                                setActiveProtocol(protocol.id);
                                setCurrentStep(1);
                            }}
                            ref={(el: HTMLDivElement | null) => {
                                if (el) {
                                    panelRefs.current[protocol.id] = el;
                                }
                            }}
                        >
                            <div>
                                <Divider/>
                                <Text align={'center'}>
                                    {protocol.flavor}
                                </Text>
                                <Text align={'center'} muted >
                                    <i>{protocol.info}</i>
                                </Text>
                                <Divider/>
                                <Steps current={currentStep} small >
                                    {cards.map((card, idx) => {
                                        const cardIdx = idx+1;
                                        const Icon = iconMap[card.value];
                                        return (
                                            <>
                                                <Steps.Item
                                                    icon={<Icon size={26} />}
                                                    status={currentStep === cardIdx ? 'process' : 'wait'}
                                                    onClick={() => {
                                                        setCurrentStep(cardIdx)
                                                    }}
                                                />
                                            </>
                                        )
                                    })}
                                </Steps>
                                <Divider/>
                                <HStack justify={'center'}>
                                     <TagGroup>
                                            <Tag size="sm">Flip</Tag>
                                            <Tag size="sm">Draw</Tag>
                                        </TagGroup>
                                </HStack>
                                <Divider/>
                                <img
                                    src={compileCard}
                                    alt="Shadow"
                                />
                                <Divider/>
                            </div>
                        </Accordion.Panel>
                    )
                })}
            </Accordion>
        </div>
    );
}

export default Codex;
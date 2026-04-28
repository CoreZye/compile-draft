import '@/css/Draft.css'
import { useRef, useState } from 'react';
import {Button, Divider, Toggle, HStack, Text, Heading, SelectPicker, Box, Input } from 'rsuite';
import { TbCardsFilled } from "react-icons/tb";
import { 
    type DraftItem,
    SNAKE_DRAFT,
    COMPETITIVE_SNAKE_DRAFT,
    RANDOM_DRAFT,
    INITIAL_POOL, 
    PACKS, 
    MAX_DRAFT
} from '@/utils/constants.ts'
import ProtocolModal, { type ProtocolModalHandle } from '@/components/Protocol';
import BorderBox from '@/components//minor/BorderBox.tsx';
import { useSettings } from "@/context/SettingContext.ts";
import { GiCardPlay, GiCardRandom, GiCardExchange } from "react-icons/gi";
import { PiHandDepositFill } from "react-icons/pi";
import { FaBan } from "react-icons/fa";
import {Close, Check} from '@rsuite/icons';

function Draft() {
    const { setBeSure, ownedBoxIds, name, lastPlayerOneName, lastPlayerTwoName, setPlayerNames } = useSettings();
    const [pool, setPool] = useState<DraftItem[]>(INITIAL_POOL);
    const [parties, setParties] = useState<DraftItem[][]>([[], []]);
    const [turnIndex, setTurnIndex] = useState<number>(0);
    const [draftActive, setDraftActive] = useState<boolean>(false);
    const [selectedProtocol, setSelectedProtocol] = useState<DraftItem|null>(null);
    const [currentDraft, setCurrentDraft] = useState(SNAKE_DRAFT);
    const isDraftOver = turnIndex >= currentDraft.length;
    const currentStep = currentDraft[turnIndex];
    const protocolModalRef = useRef<ProtocolModalHandle>(null);

    const [random, setRandom] = useState(true);
    const [opponentStart, setOpponentStart] = useState(false);
    const [onlineDraft, setOnlineDraft] = useState(false);
    const [playerOne, setPlayerOne] = useState(lastPlayerOneName ?? name ?? 'Me')
    const [playerTwo, setPlayerTwo] = useState(lastPlayerTwoName ?? 'Opponent')
    const handleOpen = (item: DraftItem) => {
        protocolModalRef.current?.open(item);
    };

    const hideUnavailable = true;
    const initializePool = (masterItems: DraftItem[], ownedBoxIds: number[]): DraftItem[] => {
        const ownedItemIds = new Set(
            PACKS.filter(box => ownedBoxIds.includes(box.id))
                .flatMap(box => box.contains)
        );
        return masterItems.filter(item => {
            return !hideUnavailable || ownedItemIds.has(item.id);
        }).map(item => ({
            ...item,
            status: ownedItemIds.has(item.id) ? 'AVAILABLE' : 'UNAVAILABLE'
        }));
    };

    const startDraft = () => {
        const initialPool = initializePool(INITIAL_POOL, ownedBoxIds);
        if (random) {
            setOpponentStart(Math.random() < 0.5)
        }
        setPool(initialPool);
        setTurnIndex(0);
        setDraftActive(true);
        setBeSure(true);
        setPlayerNames(playerOne, playerTwo);
    };

    const handleAction = (selectedItem: DraftItem) => {
        if (isDraftOver || selectedItem.status !== 'AVAILABLE') return;
        const { player, action } = currentStep;

        setPool((prevPool) =>
            prevPool.map((item) =>
                item.id === selectedItem.id
                    ? { ...item, status: action }
                    : item
            )
        );

        if (action === 'PICK' || action === 'GIVE' || action === 'RANDOM') {
            const recivePlayer = action === 'GIVE' ? player === 0 ? 1 : 0 : player;
            setParties((prevParties) => {
                const newParties = [...prevParties];
                newParties[recivePlayer] = [...newParties[recivePlayer], { ...selectedItem, status: action }];
                return newParties;
            });
        }
        setSelectedProtocol(null);
        setTurnIndex((prev) => prev + 1);
    };

    const players: Record<number, string> = {
        0: opponentStart ? playerTwo : playerOne,
        1: !opponentStart ? playerTwo : playerOne,
    }
    const draftPool = [
        { group: 'Default', label: 'Normal Draft', value: SNAKE_DRAFT },
        { group: 'Default', label: 'Competitive Draft', value: COMPETITIVE_SNAKE_DRAFT },
        { group: 'Default', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Official', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Official', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Official', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Submitted', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Submitted', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Submitted', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Submitted', label: 'Random Draft', value: RANDOM_DRAFT },
    ]
    return (
        <>
            {draftActive ?
                <>
                    <div className={'draft-header'}>
                        {parties.map((playerItems, playerIdx) => {
                            const playerName = players[playerIdx]
                            return (
                                <section key={playerIdx} className={"protocol-draft" + (' player-'+playerIdx)}>
                                    <h4 className={'player-name'}>{playerName}</h4>
                                    <div className={'picked-protocols'}>
                                        {Array.from({ length: MAX_DRAFT }).map((_, slotIdx) => {
                                            const item = playerItems[slotIdx];
                                            const otherPlayer = currentStep?.player === 1 ? 0 : 1;
                                            const otherPlayerItems = parties[otherPlayer]
                                            const isCurrent =
                                                (
                                                    slotIdx === playerItems.length &&
                                                    playerIdx === currentStep.player &&
                                                    currentStep.action === 'PICK'
                                                ) ||
                                                (
                                                    slotIdx === otherPlayerItems.length &&
                                                    playerIdx === otherPlayer &&
                                                    currentStep.action === 'GIVE'
                                                )
                                                ;

                                            return (
                                                <BorderBox
                                                    key={slotIdx}
                                                    active={isCurrent}
                                                    className={'picked-protocol'}
                                                >
                                                    {item ? (
                                                        <span>{item.name}</span>
                                                    ) : (
                                                        <span></span>
                                                    )}
                                                </BorderBox>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        })}
                        <div className={'draft-steps'}>
                            {currentDraft.map((step, idx) => {
                                return (
                                    <span key={idx}
                                        className={
                                            'step' +
                                            (' player-' + step.player) +
                                            (idx < turnIndex ? ' done' : '') +
                                            (step === currentStep ? ' active' : '')
                                        }
                                    >
                                        {step.action === 'BAN' && <FaBan size={20} />}
                                        {step.action === 'PICK' && <GiCardPlay size={20}/>}
                                        {step.action === 'GIVE' && <PiHandDepositFill size={20}/>}
                                        {step.action === 'RANDOM' && <GiCardRandom size={20}/>}
                                        {step.action === 'OTHER' && <GiCardExchange size={20}/>}
                                    </span>
                                )
                            })}
                        </div>
                        <Divider style={{margin: 0}}/>
                    </div>

                    <div className={'draft-pool collapsible' + (isDraftOver ? ' closed' : '')}>
                        {pool.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => item.status === 'AVAILABLE' && currentStep.action !== 'RANDOM' && setSelectedProtocol(item)}
                                disabled={isDraftOver}
                                className={
                                    'protocol status-' +
                                    (item.status !== undefined ? item.status.toLowerCase() : 'unknown') +
                                    (item.id === selectedProtocol?.id ? ' active' : '')
                                }
                            >
                                <div className={'protocol-sprite'} style={{
                                    backgroundImage: `url(${item.image})`,
                                    backgroundPosition: `${item.x}% ${item.y}%`
                                }}>
                                </div>
                                <div className={'protocol-overlay ' + (item.status !== 'AVAILABLE' ? 'striped-overlay' : '')}></div>
                            </button>
                        ))}
                    </div>
                    {currentStep?.action === 'RANDOM' &&
                        <div className={'draft-select'}>
                            <div className={'selected-protocol'}>
                                <h4>Random Protocol</h4>
                                <div className={'protocol-info'}>
                                    <span className={'flavor-text'}>Does what?</span>
                                    <span className={'info-text'}>And how?</span>
                                </div>
                            </div>
                            <Button onClick={() => {
                                const rngPool = pool.filter((item) => {
                                    return item.status === 'AVAILABLE'
                                });
                                handleAction(rngPool[Math.floor(Math.random() * rngPool.length)]);
                            }}>
                                Confirm {currentStep.action.toLowerCase()}
                            </Button>
                        </div>
                    }
                    {selectedProtocol &&
                        <div className={'draft-select'}>
                            <div className={'extraInfo'}>
                                <TbCardsFilled onClick={() => handleOpen(selectedProtocol)} className={'protocol-info'} size={30}/>
                                <ProtocolModal ref={protocolModalRef} />
                            </div>
                            <div className={'selected-protocol'}>
                                <h4>{selectedProtocol.name}</h4>
                                <div className={'protocol-info'}>
                                    <span className={'flavor-text'}>{selectedProtocol.flavor}</span>
                                    <span className={'info-text'}>{selectedProtocol.info}</span>
                                </div>
                            </div>
                            <Button onClick={() => {
                                handleAction(selectedProtocol);
                            }}>
                                Confirm {currentStep.action.toLowerCase()}
                            </Button>
                        </div>
                    }

                </>
                :
                <>
                    <div className={'pre-draft'}>
                        <div className={'draft-options'}>

                            <Divider spacing={25} >
                                <Heading level={4}>Drafting Tool setup</Heading>
                            </Divider>
                            <Toggle width={200}
                                    labelPlacement={'start'}
                                    label={'Starting player:'}
                                    size={'xl'}
                                    checkedChildren="Random"
                                    unCheckedChildren="Selected"
                                    checked={random}
                                    onChange={setRandom}
                            />
                            <Divider spacing={20}/>
                            <HStack spacing={10} className={'double-sided-toggle'}>
                                <Input className={'line-input player-1 ' + (!random ? (opponentStart ? '': 'start') : '')} value={playerOne} onChange={setPlayerOne}/>
                                <Toggle disabled={random} checked={opponentStart} onChange={setOpponentStart} className={'dst'} size={'xl'}/>
                                <Input className={'line-input player-2 ' + (!random ? (opponentStart ? 'start': '') : '')} value={playerTwo} onChange={setPlayerTwo} style={{textAlign: 'right'}} />
                            </HStack>
                            <Divider spacing={20}/>
                            <SelectPicker
                                size="lg"
                                placeholder="Select draft type"
                                data={draftPool}
                                value={currentDraft}
                                onSelect={setCurrentDraft}
                                groupBy={'group'}
                                block
                            />
                            <Divider spacing={20}/>
                            <Toggle width={200}
                                    labelPlacement={'start'}
                                    label={'Online Draft?'}
                                    size={'xl'}
                                    checkedChildren={<Check />}
                                    unCheckedChildren={<Close />}
                                    checked={onlineDraft}
                                    onChange={setOnlineDraft}
                            />
                            {onlineDraft &&
                                <Box style={{marginTop: 10}}>
                                    <Text size={15} muted align={'center'}>
                                        a code will be generated for another player to join the room, and draft on two seperate devices [NYI]
                                    </Text>
                                </Box>
                            }
                            <Divider spacing={20}/>

                        </div>
                        <div className={'start-draft'}>
                            <Button className={'closeBtn'} onClick={startDraft}>Start Draft</Button>
                        </div>
                    </div>
                </>
            }
        </>
    );
}

export default Draft;

/*

                                    Pick Start player vs Random
                                    Pick Draft type
                                    Use Names or not?
                                    Share screen or join by Code

Avoid "Look-alike" Characters
To make it user-friendly (so people don't ask "Is that an 'O' or a '0'?"), 
use a reduced alphabet. Remove 0, O, 1, I, L, and S/5.If you use a 30-character set ($A-Z$ minus confusing 
ones + some numbers):5 characters still gives you $30^5 = \mathbf{24.3\ million}$ combinations. This is the 
"sweet spot" for mobile games (like Jackbox or Among Us).

Implementation LogicTo 
ensure the code is "unusable" 
after, your Firebase/Database logic should look like this:Generation: Generate a random 5-char string.Validation: 
Check if that document ID already exists in an active_drafts collection. If yes, generate a new one.Active State:
 Keep a field status: "waiting" | "active".Cleanup: When the draft is submitted, move the data to a completed_drafts 
 collection (or change status to archived) and delete the record from the active_drafts lookup table.
 
 Preventing Brute Force
 If you are worried about people guessing codes, implement a rate limit:If a device tries 5 incorrect codes in a 
 row, block their ability to "Join" for 10 minutes. This makes the $0.06\%$ chance effectively impossible to exploit.
 
 Final Recommendation: 
 Go with 5 characters. It's easy for a human to type on a phone, feels "pro," and provides over 
 60 million combinations—far more than you'll likely ever have concurrent users for.
*/
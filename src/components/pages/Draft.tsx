import '@/css/Draft.less'
import { useRef, useState } from 'react';
import {
    Button, Divider, Toggle, HStack, Text, Heading, SelectPicker, 
    Box, Input, Whisper, Popover, PinInput, RadioTileGroup, RadioTile
} from 'rsuite';
import { TbCardsFilled } from "react-icons/tb";
import {
    type DraftItem,
    SNAKE_DRAFT,
    COMPETITIVE_SNAKE_DRAFT,
    RANDOM_DRAFT,
    REVERSE_SNAKE_DRAFT,
    MAX_DRAFT,
    VIEWS,
    type Protocol,
    type DraftItemStatus,
    type DraftInformation,
} from '@/utils/constants.ts';
import { useSubmitDraft } from '@/hooks/useSubmitDraft';
import ProtocolModal, { type ProtocolModalHandle } from '@/components/Protocol';
import BorderBox from '@/components/minor/BorderBox';
import { useSettings } from "@/context/SettingContext";
import { GiCardPlay, GiCardRandom, GiCardExchange, GiCardDraw } from "react-icons/gi";
import { PiHandDepositFill } from "react-icons/pi";
import { FaUserAstronaut } from "react-icons/fa6";
import { FaBan } from "react-icons/fa";
import {Close, Check} from '@rsuite/icons';
import tempProtocol from '@/assets/temp-protocol.webp';
import { shuffle } from '@/utils/arraySort';
import {useGetData} from "@/context/DataContext";
import type { PageProps, Draft } from '@/utils/types';

function DraftPage({ activeSub, onReset }: PageProps) {
    const { protocols, packs } = useGetData()
    const { setBeSure, ownedBoxIds, name, lastPlayerOneName, lastPlayerTwoName, setPlayerNames } = useSettings();
    const [draftStart, setDraftStart] = useState<Date>(new Date(0));
    const [pool, setPool] = useState<DraftItem[]>([]);
    const [parties, setParties] = useState<DraftItem[][]>([[], []]);
    const [turnIndex, setTurnIndex] = useState<number>(0);
    const [winner, setWinner] = useState<'player1'|'player2'>();
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
    const hideUnavailable = true;
    const handleOpen = (item: Protocol) => {
        protocolModalRef.current?.open(item);
    };
    const { mutate } = useSubmitDraft();

    const initializePool = (masterItems: Protocol[], ownedBoxIds: number[]): DraftItem[] => {
        const ownedItemIds = new Set(
            packs.filter(box => ownedBoxIds.includes(box.id))
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
        const initialPool = initializePool(protocols, ownedBoxIds);
        if (random) {
            setOpponentStart(() => Math.random() < 0.5);
        }
        setPool(initialPool);
        advanceTurn(0, initialPool);
        setDraftActive(true);
        setBeSure(true);
        setPlayerNames(playerOne, playerTwo);
        setDraftStart(new Date());
    };

    const advanceTurn = (forcedIndex?: number, pool?: DraftItem[]) => {
        setSelectedProtocol(null);

        setTurnIndex((prev) => {
            const nextIndex = forcedIndex !== undefined ? forcedIndex : prev + 1;
            handleGameLogic(nextIndex, pool);
            return nextIndex;
        });
    };

    const handleSubmitDraft = () => {
        if (winner) {
            const newDraft: Draft = {
                timestamp: draftStart.toISOString(),
                player1: parties[0].map(item => item.codename),
                player2: parties[1].map(item => item.codename),
                banned: pool.filter(item => item.status === 'BAN').map(item => item.codename),
                remaining: pool.filter(item => item.status === 'AVAILABLE').map(item => item.codename),
                winner: winner,
            };
            mutate(newDraft, {
                onSuccess: (() => {
                    setBeSure(false);
                    onReset?.();
                })
            });
        }
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
            const recivePlayer = (action === 'GIVE' ? player === 1 ? 2 : 1 : player) -1;
            setParties((prevParties) => {
                const newParties = [...prevParties];
                newParties[recivePlayer] = [...newParties[recivePlayer], { ...selectedItem, status: action }];
                return newParties;
            });
        }
        advanceTurn();
    };

    const players: Record<number, string> = {
        1: opponentStart ? playerTwo : playerOne,
        2: !opponentStart ? playerTwo : playerOne,
    }

    const draftPool: DraftInformation[] = [
        { group: 'Default', label: 'Normal Draft', value: SNAKE_DRAFT, info:
            '<div>A normal snake draft where each player ends up with 3 protocols</div>'+
            '<div>The game randoms picks 12 of the owned protocols</div>'+
            'Player 1 gets first pick, then player 2 gets 2 picks and so on until both have 3'
        },
        { group: 'Default', label: 'Competitive Draft', value: COMPETITIVE_SNAKE_DRAFT },
        { group: 'Default', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Default', label: 'Hate Draft', value: REVERSE_SNAKE_DRAFT },
        { group: 'Official', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Official', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Official', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Submitted', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Submitted', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Submitted', label: 'Random Draft', value: RANDOM_DRAFT },
        { group: 'Submitted', label: 'Random Draft', value: RANDOM_DRAFT },
    ]

    const currentDraftInfo = draftPool.find((item) => {
        return item.value === currentDraft
    } )

    const ACTION_ICONS: Record<string, React.ReactNode> = {
        BAN: <FaBan size={20} />,
        PICK: <GiCardPlay size={20} />,
        GIVE: <PiHandDepositFill size={20} />,
        RANDOM: <GiCardRandom size={20} />,
        OTHER: <GiCardExchange size={20} />,
        DRAW: <GiCardDraw size={20} />,
        DISPLAY: <GiCardDraw size={20} />,
    };

    const handleGameLogic = (stepIdx: number, newPool?: DraftItem[]) => {
        const currStep = currentDraft[stepIdx];
        if (currStep && currStep.player === 0 && newPool) {
            if (currStep.action === 'DISPLAY') {
                setPool(() => {
                    const needCount = currStep.count ?? newPool.length;
                    const shuffled = shuffle([...newPool]);
                    const selected = shuffled.slice(0, needCount);
                    const remaining = shuffled.slice(needCount);
                    const hidden = remaining.map(item => ({ ...item, status: 'HIDDEN' as DraftItemStatus }));
                    return [...selected, ...hidden];
                });
            }
            setTurnIndex(stepIdx + 1);
        }
    }

    const renderPreDraft = () => (
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
                    <Input className={'line-input ' + (!random ? (opponentStart ? 'player-2': 'player-1') : '')} value={playerOne} onChange={setPlayerOne}/>
                    <Toggle disabled={random} checked={opponentStart} onChange={setOpponentStart} className={'dst'} size={'xl'}/>
                    <Input className={'line-input ' + (!random ? (opponentStart ? 'player-1': 'player-2') : '')} value={playerTwo} onChange={setPlayerTwo} style={{textAlign: 'right'}} />
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
                { currentDraftInfo &&
                    <>
                        <Divider spacing={10} style={{borderColor: 'transparent'}}/>
                        <div className={'draft-info'} style={{width: '100%'}}>
                            <div style={{textAlign: 'center', marginBottom: 20}} className={'draft-desc'}>
                                <div dangerouslySetInnerHTML={{ __html: currentDraftInfo.info ?? 'No description' }} />
                            </div>
                            <div className={'draft-steps'}>
                                {currentDraft.map((step, idx) => {
                                    return (
                                        <Whisper 
                                            key={idx} 
                                            placement="top" 
                                            trigger="click" 
                                            speaker={
                                                <Popover>
                                                    {`${step.player === 0 ? 'Game' : `Player ${step.player}`} ${step.action.toLowerCase()} ${step.count ?? ''}`}
                                                </Popover>
                                            }
                                        >
                                            <span key={idx} className={'step' + (' player-' + step.player)}>
                                                <>{ACTION_ICONS[step.action] || null}</>
                                            </span>
                                        </Whisper>
                                    )
                                })}
                            </div>
                        </div>
                    </>
                }
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
    )

    const renderDraftHeader = () =>  (
        <div className={'draft-header'}>
            {parties.map((playerItems, plIdx) => {
                const playerNum = plIdx + 1;
                const playerName = players[playerNum]
                return (
                    <section key={playerNum} className={"protocol-draft" + (' player-'+playerNum)}>
                        <h4 className={'player-name'}>{playerName}</h4>
                        <div className={'picked-protocols'}>
                            {Array.from({ length: MAX_DRAFT }).map((_, slotIdx) => {
                                const item = playerItems[slotIdx];
                                const otherPlayer = currentStep?.player === 1 ? 2 : 1;
                                const otherPlayerItems = parties[otherPlayer-1]
                                const isCurrent =
                                    (
                                        slotIdx === playerItems.length &&
                                        playerNum === currentStep.player &&
                                        currentStep.action === 'PICK'
                                    ) ||
                                    (
                                        slotIdx === otherPlayerItems.length &&
                                        playerNum === otherPlayer &&
                                        currentStep.action === 'GIVE'
                                    )
                                ;

                                return (
                                    <BorderBox 
                                        onClick={() => handleOpen(item)}
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
                    {ACTION_ICONS[step.action] || null}
                </span>
                    )
                })}
            </div>
            <Divider style={{margin: 0}}/>
        </div>
    );

    const renderDraftPool = () =>  (
        <div className={'draft-pool'}>
            {pool.filter((item) => (item.status !== 'HIDDEN')).map((item) => (
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
                        backgroundImage: `url(${tempProtocol})`,
                    }}>
                        <Text>{item.name}</Text>
                    </div>
                    <div className={'protocol-overlay ' + (item.status !== 'AVAILABLE' ? 'striped-overlay' : '')}></div>
                </button>
            ))}
        </div>
    );

    const renderDraftActions = () =>  (
        <>
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
    );

    const renderRunDraft = () =>  (
        <>
            {renderDraftHeader()}
            {renderDraftPool()}
            {isDraftOver ?
                renderPostDraft()
            :
                renderDraftActions()
            }
        </>
    );

    const renderPostDraft = () => (
        <div className={'draft-after'}>
            <div className={'submit-draft'}>
                <Heading level={5} >Winner</Heading>
                <RadioTileGroup defaultValue="blank" >
                    {Object.entries(players).map(([key, name]) => {
                        const value = `player${key}` as 'player1' | 'player2';
                        return (
                            <RadioTile 
                                icon={<FaUserAstronaut/>} 
                                label={name} 
                                value={value} 
                                onClick={() => setWinner(value)} 
                            />
                        )
                    })}
                </RadioTileGroup>
                <Button
                    key={'saveDraft'}
                    onClick={handleSubmitDraft}
                    disabled={!winner}
                    className={'saveDraft closeBtn'}
                >
                    Submit game
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <ProtocolModal ref={protocolModalRef} />
            {activeSub === VIEWS.DRAFT_START && (
                !draftActive ? renderPreDraft() : renderRunDraft()
            )}
            
            {activeSub === VIEWS.DRAFT_JOIN &&
                <div className={'code-box'}>
                    <Text>Join draft with Code:</Text>
                    <PinInput 
                        className={'code-input'} 
                        otp 
                        size={'lg'} 
                        length={5} 
                        type={'alphanumeric'}
                        onComplete={(val) => {
                            if (val.length === 5) {
                                alert(val.toUpperCase());
                            }
                        }}
                    />
                </div>
            }
        </>
    );
}

export const DraftComponent = ({activeSub}: PageProps) => {
  const [resetKey, setResetKey] = useState(0);

  return (
    <DraftPage 
      key={resetKey} 
      activeSub={activeSub}
      onReset={() => setResetKey(prev => prev + 1)} 
    />
  );
};

export default DraftComponent;
import {useRef, useState} from 'react';
import {Button, Divider} from 'rsuite';
import { type DraftItem, COMPETITIVE_SNAKE_SEQUENCE, INITIAL_POOL, PACKS, MAX_DRAFT} from '../utils/constants.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faMapMarker, faHandHolding, faOtter } from '@fortawesome/free-solid-svg-icons';
import { TbCardsFilled } from "react-icons/tb";
import './Draft.css'
import BorderBox from '@/components//minor/BorderBox.tsx';
import ProtocolModal, { type ProtocolModalHandle } from './Protocol';

function Draft() {
    const [pool, setPool] = useState<DraftItem[]>(INITIAL_POOL);
    const [parties, setParties] = useState<DraftItem[][]>([[], []]);
    const [turnIndex, setTurnIndex] = useState<number>(0);
    const [ownedBoxes] = useState<number[]>([1,3]);
    const [draftActive, setDraftActive] = useState<boolean>(false);
    const [selectedProtocol, setSelectedProtocol] = useState<DraftItem|null>(null);
    const currentDraft = COMPETITIVE_SNAKE_SEQUENCE;
    const isDraftOver = turnIndex >= currentDraft.length;
    const currentStep = currentDraft[turnIndex];
    const protocolModalRef = useRef<ProtocolModalHandle>(null);
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
        const initialPool = initializePool(INITIAL_POOL, ownedBoxes);
        setPool(initialPool);
        setTurnIndex(0);
        setDraftActive(true);
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

        if (action === 'PICK' || action === 'GIVE') {
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

    return (
        <>
            {draftActive ?
                <>
                    <div className={'draft-header'}>
                        {parties.map((playerItems, playerIdx) => {
                            const playerName = 'Player ' + (playerIdx + 1);
                            return (
                                <section key={playerIdx} className={"protocol-draft" + (' player-'+playerIdx)}>
                                    <h4 className={'player-name'}>{playerName}</h4>
                                    <div className={'picked-protocols'}>
                                        {Array.from({ length: MAX_DRAFT }).map((_, slotIdx) => {
                                            const item = playerItems[slotIdx];
                                            const isCurrent =
                                                slotIdx === playerItems.length &&
                                                playerIdx === currentStep.player &&
                                                currentStep.action === 'PICK';

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
                                        {step.action === 'BAN' && <FontAwesomeIcon icon={faBan} size={'lg'} />}
                                        {step.action === 'PICK' && <FontAwesomeIcon icon={faMapMarker} size={'lg'} />}
                                        {step.action === 'GIVE' && <FontAwesomeIcon icon={faHandHolding} size={'lg'} />}
                                        {step.action === 'OTHER' && <FontAwesomeIcon icon={faOtter} size={'lg'} />}
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
                                onClick={() => item.status ==='AVAILABLE' && setSelectedProtocol(item)}
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
                                    {/*item.name*/}
                                </div>
                                <div className={'protocol-overlay ' + (item.status !== 'AVAILABLE' ? 'striped-overlay' : '')}></div>
                            </button>
                        ))}
                    </div>
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
                    <div style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                        {`
                            Pick Start player vs Random
                            Pick Draft type
                            Use Names or not?
                            Share screen or join by Code

                        `.trim().replace(/^\s+/gm, '')}
                    </div>
                    <div style={{display: 'flex', flexGrow: 1, justifyContent: 'center', alignItems: 'center'}}>
                        
                        <Button onClick={startDraft}>Start Draft</Button>
                    </div>
                </>
            }
        </>
    );
}

export default Draft;

/*
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
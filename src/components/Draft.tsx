import {useState} from 'react';
import {Button, Divider} from 'rsuite';
import { type DraftItem, SNAKE_SEQUENCE, INITIAL_POOL, PACKS, MAX_DRAFT} from '../utils/constants.ts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faMapMarker, faSpinner } from '@fortawesome/free-solid-svg-icons';
import './Draft.css'

function Draft() {
    const [pool, setPool] = useState<DraftItem[]>(INITIAL_POOL);
    const [parties, setParties] = useState<DraftItem[][]>([[], []]);
    const [turnIndex, setTurnIndex] = useState<number>(0);
    const [ownedBoxes] = useState<number[]>([1,3]);
    const [draftActive, setDraftActive] = useState<boolean>(false);
    const [selectedProtocol, setSelectedProtocol] = useState<DraftItem|null>(null);
    const isDraftOver = turnIndex >= SNAKE_SEQUENCE.length;
    const currentDraft = SNAKE_SEQUENCE;
    const currentStep = currentDraft[turnIndex];
    const initializePool = (masterItems: DraftItem[], ownedBoxIds: number[]): DraftItem[] => {
        const ownedItemIds = new Set(
            PACKS.filter(box => ownedBoxIds.includes(box.id))
                .flatMap(box => box.contains)
        );

        return masterItems.map(item => ({
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

        if (action === 'PICK') {
            setParties((prevParties) => {
                const newParties = [...prevParties];
                newParties[player] = [...newParties[player], { ...selectedItem, status: action }];
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
                            return (
                                <section key={playerIdx} className={"protocol-draft" + (' player-'+playerIdx)}>
                                    <h4 className={'player-name'}>Player {playerIdx + 1}</h4>
                                    <div className={'picked-protocols'}>
                                        {Array.from({ length: MAX_DRAFT }).map((_, slotIdx) => {
                                            const isCurrent =
                                                slotIdx === playerItems.length &&
                                                currentStep.action === 'PICK' &&
                                                playerIdx === currentStep.player;
                                            const item = playerItems[slotIdx];

                                            return (
                                                <div className={'picked-protocol ' + (item ? 'status-picked' : '')} key={slotIdx} >
                                                    {item ? (
                                                        <span>{item.name}</span>
                                                    ) : (
                                                        <span>
                                                            {isCurrent ?
                                                                <FontAwesomeIcon icon={faSpinner} size={'lg'} spinPulse/>
                                                            :
                                                                <>...</>
                                                            }
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            );
                        })}
                        <div className={'draft-steps'}>
                            {currentDraft.map((step, idx) => {
                                return (
                                    <span key={idx} className={'step ' + ('player-' + step.player) + (step === currentStep ? ' active' : '')}>
                                        {step.action === 'BAN' && <FontAwesomeIcon icon={faBan} size={'lg'} />}
                                        {step.action === 'PICK' && <FontAwesomeIcon icon={faMapMarker} size={'lg'} />}
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
                                    {item.name}
                                </div>
                                <div className={'protocol-overlay ' + (item.status !== 'AVAILABLE' ? 'striped-overlay' : '')}></div>
                            </button>
                        ))}
                    </div>
                    {selectedProtocol &&
                        <div className={'draft-select'}>
                            <div className={'selected-protocol'}>
                                <h4>{selectedProtocol.name}</h4>
                                <div className={'protocol-info'}>
                                    <span className={'flavor-text'}>{selectedProtocol.flavor}</span>
                                    <span className={'info-text'}>{selectedProtocol.info}</span>
                                </div>
                            </div>
                            <Button onClick={() => {
                                handleAction(selectedProtocol);
                            }}>Confirm {currentStep.action.toLowerCase()}</Button>
                        </div>
                    }

                </>
                :
                <Button onClick={startDraft}>Start Draft</Button>
            }
        </>
    );
}

export default Draft;
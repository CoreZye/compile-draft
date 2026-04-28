import '@/css/Codex.css'
import { useRef } from 'react';
import { type DraftItem, INITIAL_POOL, PACKS } from "@/utils/constants";
import ProtocolModal, { type ProtocolModalHandle } from '@/components/Protocol';

function Codex () {
    const protocolModalRef = useRef<ProtocolModalHandle>(null);
    const handleOpen = (item: DraftItem) => {
        protocolModalRef.current?.open(item);
    };

    return (
        <div id={'codex'} >
            <div className={'pool'}>
                {INITIAL_POOL.map((protocol) => {
                    const pack = PACKS.find((pack) =>  (
                        pack.contains.includes(protocol.id)
                    ))
                    return (
                        <button
                            key={protocol.id}
                            onClick={() => handleOpen(protocol)}
                            className={'protocol'}
                        >
                            {pack &&
                                <div className={'protocol-banner ' + ('cycle-' + pack.cycle)}>{pack.name}</div>
                            }
                            <div className={'protocol-sprite'}
                                 style={{
                                     backgroundImage: `url(${protocol.image})`,
                                     backgroundPosition: `${protocol.x}% ${protocol.y}%`
                                }}
                            ></div>
                        </button>
                    )
                })}
            </div>
            <ProtocolModal ref={protocolModalRef} />
        </div>
    );
}

export default Codex;
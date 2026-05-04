import '@/css/Codex.less'
import { useRef } from 'react';
import { Text } from 'rsuite';
import { type DraftItem, INITIAL_POOL, PACKS } from "@/utils/constants";
import ProtocolModal, { type ProtocolModalHandle } from '@/components/Protocol';
import tempProtocol from '@/assets/temp-protocol.webp';

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
                                    backgroundImage: `url(${tempProtocol})`
                                     /*backgroundImage: `url(${protocol.image})`,
                                     backgroundPosition: `${protocol.x}% ${protocol.y}%`*/
                                }}
                            >
                                <Text>{protocol.name}</Text>
                            </div>
                        </button>
                    )
                })}
            </div>
            <ProtocolModal ref={protocolModalRef} />
        </div>
    );
}

export default Codex;
import '@/css/Codex.less'
import { useRef, Fragment, useState } from 'react';
import {
    Text,
    CheckPicker,
    Divider,
    Center,
    Badge,
    Button,
    Heading
} from 'rsuite';
import { type Pack, type Protocol, VIEWS, TAG_OPTIONS, type Tag, iconMap } from "@/utils/constants";
import ProtocolModal, { type ProtocolModalHandle } from '@/components/Protocol';
import tempProtocol from '@/assets/temp-protocol.webp';
import { useGetData } from '@/context/DataContext';
import { type PageProps } from '@/utils/types';
import tempCard from "@/assets/temp-card.webp";

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

function Codex ({ activeSub }: PageProps) {
    const protocolModalRef = useRef<ProtocolModalHandle>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [selectedProtocols, setSelectedProtocols] = useState<string[]>();
    const [selectedValues, setSelectedValues] = useState<number[]>();
    const { protocols, packs } = useGetData()

    const handleOpen = (item: Protocol, pack: Pack | undefined) => {
        protocolModalRef.current?.open(item, pack);
    };
    const tagOptions = TAG_OPTIONS.map(item => ({label: item, value: item}))
    const protoclsOptions = protocols.map(protocol => ({label: protocol.name, value: protocol.codename}))
    const valueOptions = [...new Set(
        protocols.flatMap(protocol =>
            protocol.cards.map(card => card.value)
        )
    )].sort((a, b) => a - b).map(item => ({label: item.toString(), value: item}));

    const protocolValue = selectedProtocols ?? protocols.map(p => p.codename);
    const values = selectedValues ?? [...new Set(protocols.flatMap(protocol => protocol.cards.map(card => (card.value))))];

    const filteredCards = protocols
        .filter(protocol =>
            protocolValue?.includes(protocol.codename)
        ).flatMap(protocol => (
            protocol.cards.filter(card => (
                selectedTags.every(tag => card.tags.includes(tag))) &&
                values?.some(value => card.value === value))
        ).map(card => (
            {
                key: protocol.codename + '-' + card.value,
                name: protocol.name + ' ' + card.value,
            }
        ))
    )

    const resetFilters = () => {
        setSelectedProtocols(undefined);
        setSelectedValues(undefined);
        setSelectedTags([]);
    }

    return (
        <div id={'codex'} >
            {activeSub === VIEWS.CODEX_TAGS &&
                <>
                    <Divider spacing={10}>
                        <Heading level={4}>Filters</Heading>
                    </Divider>
                    <CheckPicker label={'Protocols:'} className={'tag-picker'} data={protoclsOptions} size={'lg'} value={protocolValue} onChange={setSelectedProtocols}/>
                    <CheckPicker label={'Values:'} className={'tag-picker'} data={valueOptions} value={values} onChange={setSelectedValues}
                         renderValue={(_value, items) => {
                             return (
                                 <div className={'custom-options'}>
                                     {items.map(item => {
                                         const Icon = iconMap[item.value!];
                                         return (
                                            <Icon key={item.value} size={26}/>
                                         )
                                     })}
                                 </div>
                             );
                         }}
                    />
                    <CheckPicker label={'Effects:'} className={'tag-picker'} data={tagOptions} size={'lg'} value={selectedTags} onChange={setSelectedTags}/>
                    <Button style={{width: '100%'}} className={'closeBtn'} onClick={()=> resetFilters()}>Reset Filter</Button>

                    <Divider spacing={20}>
                        <Heading level={4}>Cards</Heading>
                        <Badge content={filteredCards.length}/>
                    </Divider>
                    {filteredCards.length > 0 ?
                        <div className={''} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}} >
                            {filteredCards.map(card => (
                                <div key={card.key} className={'item'} >
                                    <img src={cardImages[card.key] ?? tempCard} alt={card.name}/>
                                    <div className={'cardImage'} style={{backgroundImage: `url(${cardImages[card.key] ?? tempCard})`,}}></div>
                                </div>
                            ))}
                        </div>
                        :
                        <Center>
                            No Cards found with given filter
                        </Center>
                    }
                </>
            }
            {activeSub === VIEWS.CODEX_OVERVIEW &&
                <>
                    <div className={'pool'}>
                        <>{packs.sort((a, b) => {
                            const cycleDiff = a.cycle - b.cycle;
                            if (cycleDiff !== 0) {
                                return cycleDiff;
                            }
                            // Main before Aux
                            return b.name.localeCompare(a.name);
                        }).map(pack => (
                            <Fragment key={pack.codename}>
                                {protocols.filter(item => pack.contains.includes(item.id)).map((protocol) => {
                                    return (
                                        <button key={protocol.id} onClick={() => handleOpen(protocol, pack)} className={'protocol'}>
                                            {pack &&
                                                <div className={'protocol-banner ' + ('cycle-' + pack.cycle)}>{pack.name}</div>
                                            }
                                            <div className={'protocol-sprite'} style={{backgroundImage: `url(${tempProtocol})`}}>
                                                <Text>{protocol.name}</Text>
                                            </div>
                                        </button>
                                    )
                                })}
                            </Fragment>
                        ))}</>
                    </div>
                    <ProtocolModal ref={protocolModalRef} />
                </>
            }
        </div>
    );
}

export default Codex;
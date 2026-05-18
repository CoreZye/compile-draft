import '@/css/Codex.less'
import { useRef, Fragment, useState } from 'react';
import {
    Text,
    CheckPicker,
    Divider,
    Center,
    Badge,
    Button,
    Heading,
    Accordion,
    Checkbox
} from 'rsuite';
import { type Pack, type Protocol, VIEWS, TAG_OPTIONS, type Tag, iconMap, type Card, cardImages, protocolImages } from "@/utils/constants";
import ProtocolModal, { type ProtocolModalHandle } from '@/components/Protocol';
import tempProtocol from '@/assets/temp-protocol.webp';
import { useGetData } from '@/context/DataContext';
import { type PageProps } from '@/utils/types';
import tempCard from "@/assets/temp-card.webp";

export interface ExtendedCard extends Card {
    imageKey: string;
    cardName: string;
    protocolId: number;
}

function Codex ({ activeSub }: PageProps) {
    const protocolModalRef = useRef<ProtocolModalHandle>(null);
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [selectedProtocols, setSelectedProtocols] = useState<string[]>();
    const [selectedValues, setSelectedValues] = useState<number[]>();
    const { protocols, packs } = useGetData()

    const handleToggleGroup = (groupName: string) => {
        const groupValues = protoclsOptions
            .filter(item => item.group === groupName)
            .map(item => item.value);

        const allSelected = groupValues.every(v => protocolValue.includes(v));
        if (allSelected) {
            setSelectedProtocols(protocolValue.filter(v => !groupValues.includes(v)));
        } else {
            setSelectedProtocols([...new Set([...protocolValue, ...groupValues])]);
        }
    };

    const getGroupState = (groupName: string) => {
        const groupItems = protoclsOptions.filter(item => item.group === groupName).map(item => item.value);
        const selectedInGroup = protocolValue.filter(v => groupItems.includes(v));

        return {
            all: selectedInGroup.length === groupItems.length && groupItems.length > 0,
            some: selectedInGroup.length > 0 && selectedInGroup.length < groupItems.length,
            none: selectedInGroup.length === 0
        };
    };

    const handleOpen = (item: Protocol, pack?: Pack | undefined, idx?: number) => {
        protocolModalRef.current?.open(item, pack, idx);
    };
    const tagOptions = TAG_OPTIONS.map(item => (
        {
            label: item.startsWith('__') && item.endsWith('__') 
            ? item.replace(/__(\w+)__/g, (_match, p1) => `Has ${p1}`) 
            : item,
            value: item,
            group: item.startsWith('__') && item.endsWith('__') 
            ? 'Options' : 'Effects'
        }
    ))
    const protoclsOptions = protocols.map(protocol => (
        {
            label: protocol.name, 
            value: protocol.codename,
            group: packs.find(p => {
                return p.contains.includes(protocol.id)
            })?.name ?? ''
        }
    )).sort((a,b) => {
        const numA = parseInt(a.group.match(/\d+/)?.[0] || "0", 10);
        const numB = parseInt(b.group.match(/\d+/)?.[0] || "0", 10);
        if (numA !== numB) {
            return numA - numB;
        }
        return b.group.localeCompare(a.group);
    })
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
        )
        .flatMap(protocol => 
            protocol.cards.filter(card => {
                const regularSelectedTags = selectedTags.filter(t => t !== '__errata__');
                const isErrataSelected = selectedTags.includes('__errata__');

                const matchesTags = regularSelectedTags.every(tag => card.tags.includes(tag));

                const matchesErrata = isErrataSelected ? (card.errata?.length ?? 0) > 0 : true;

                const matchesValue = values?.some(v => v === card.value);

                return matchesTags && matchesErrata && matchesValue;
            })
            .map((card): ExtendedCard => ({
                ...card,
                imageKey: `${protocol.codename}-${card.value}`,
                cardName: `${protocol.name} ${card.value}`,
                protocolId: protocol.id
            }))
    );

    const resetFilters = () => {
        setSelectedProtocols(undefined);
        setSelectedValues(undefined);
        setSelectedTags([]);
    }

    return (
        <div id={'codex'} >
            {activeSub === VIEWS.CODEX_CARDS &&
                <>
                    <div className='affix'>
                        <Accordion className={'filterAccord'}>
                            <Accordion.Panel header={
                                <Divider>
                                    <Heading level={4}>Filters</Heading>
                                </Divider>
                            } >
                                    <CheckPicker 
                                        label={'Protocols:'} 
                                        className={'tag-picker'} 
                                        data={protoclsOptions} 
                                        size={'lg'} 
                                        value={protocolValue} 
                                        onChange={setSelectedProtocols} 
                                        groupBy='group'
                                        renderOptionGroup={(title) => {
                                            const groupName = title as string;
                                            const { all, some } = getGroupState(groupName);
                                            return (
                                            <>
                                                <Checkbox
                                                    checked={all}
                                                    indeterminate={some}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleGroup(groupName);
                                                    }}
                                                />
                                                <span className="title" style={{ flex: 1 }}>
                                                    {title}
                                                </span>
                                            </>
                                        )}}
                                    />
                                    <CheckPicker label={'Values:'} className={'tag-picker'} data={valueOptions} size={'lg'} value={values} onChange={setSelectedValues}
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
                                    <CheckPicker label={'Effects:'} className={'tag-picker'} data={tagOptions} size={'lg'} value={selectedTags} onChange={setSelectedTags} groupBy='group'/>
                                    <Button style={{width: '100%', marginBottom: 5}} className={'closeBtn'} onClick={()=> resetFilters()}>Reset Filter</Button>
                            </Accordion.Panel>
                        </Accordion>
                    
                        <Divider spacing={10}>
                            <Heading level={4}>Cards</Heading>
                            <Badge content={filteredCards.length} maxCount={9999}/>
                        </Divider>
                    </div>
                    <div className={'filteredContent'}>
                        {filteredCards.length > 0 ?
                            <div className={'filteredGrid'} style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10}} >
                                {filteredCards.map((card) => {
                                    const image = cardImages[card.imageKey] ?? tempCard;
                                    const hasImage = image !== tempCard;
                                    return (
                                        <div key={card.imageKey} className={'item'} onClick={() => {
                                            const thisProtocol = protocols.find(proto => {
                                                return proto.id === card.protocolId
                                            })
                                            if (thisProtocol) {
                                                const cardIdx = thisProtocol.cards.findIndex(c => c.value === card.value);
                                                handleOpen(thisProtocol, undefined, cardIdx);
                                            }
                                        }} >
                                            <div className={'cardImage'} style={{backgroundImage: `url(${image})`}}>
                                                {!hasImage &&
                                                    <Text>{card.cardName}</Text>
                                                }
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <Center>
                                No Cards found with given filter
                            </Center>
                        }
                    </div>
                </>
            }
            {activeSub === VIEWS.CODEX_PROTOCOLS &&
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
                                    const image = protocolImages[protocol.codename] ?? tempProtocol;
                                    const hasImage = image !== tempProtocol;
                                    return (
                                        <button key={protocol.id} onClick={() => handleOpen(protocol, pack)} className={'protocol'}>
                                            {pack &&
                                                <div className={'protocol-banner ' + ('cycle-' + pack.cycle)}>{pack.name}</div>
                                            }
                                            <div className={'protocol-sprite'} style={{backgroundImage: `url(${image})`}}>
                                                {!hasImage && <Text>{protocol.name}</Text>}
                                            </div>
                                        </button>
                                    )
                                })}
                            </Fragment>
                        ))}</>
                    </div>
                </>
            }
            <ProtocolModal ref={protocolModalRef} />
        </div>
    );
}

export default Codex;
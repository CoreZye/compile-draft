import '@/css/Stats.less';
import { Card, Panel, Heading, Text, VStack, HStack, StatGroup, Stat, ProgressCircle, ButtonGroup, Button } from 'rsuite';
import { useStats } from '@/hooks/useStats';
import {useGetData} from "@/context/DataContext.tsx";
import { useState } from 'react';


function Stats () {
    const { protocols, packs } = useGetData();
    const { data, loading } = useStats();
    const [activeKey, setActiveKey] = useState('Win Rate');

    const validIds = packs.filter(pack => (
        pack.released
    )).flatMap(item => (
        item.contains
    ));

    const statsData = protocols.filter(item => (
        validIds.includes(item.id)
    )).map(protocol => {
        const protocolStats = data.find(item => {
            return item.codename === protocol.codename
        });
        return {
            name: protocol.name,
            codename: protocol.codename,
            ...protocolStats
        }
    })

    const StatItem = ({ value, label }: { value: number | undefined; label: string }) => {
        const getCircleColor = (val: number): string => {
            if (val < 25) return '#f7635c'; // Red
            if (val < 50) return '#ff9800'; // Orange
            if (val < 75) return '#ffeb3b'; // Yellow
            return '#28a745';                // Green (76-100)
        };
        const val = (Math.round((value?? 0.0) * 10) / 10);
        return (
            <Stat>
                <Stat.Label>{label}</Stat.Label>
                <HStack>
                    <ProgressCircle
                        percent={val}
                        w={'100%'}
                        strokeWidth={5}
                        trailWidth={5}
                        gapDegree={180}
                        strokeColor={getCircleColor(val)}
                    />
                </HStack>
            </Stat>
        );
    }

    const orderedData = [...statsData].sort((a, b) => {
        const aHasFewGames = (a.games ?? 0) < 5;
        const bHasFewGames = (b.games ?? 0) < 5;
        if (aHasFewGames && !bHasFewGames) return 1;
        if (!aHasFewGames && bHasFewGames) return -1;
        if (activeKey === 'Play Rate') {
            return (b.playRatio ?? 0) - (a.playRatio ?? 0);
        }
        if (activeKey === 'Pick Rate') {
            return (b.pickRatio ?? 0) - (a.pickRatio ?? 0);
        }
        if (activeKey === 'Ban Rate') {
            return (b.banRatio ?? 0) - (a.banRatio ?? 0);
        }
        return (b.winRatio ?? 0) - (a.winRatio ?? 0);
    });

    return (
        <div className='stats'>
            <Panel style={{position: 'sticky', top: -5, zIndex: 99, background: 'var(--bg)', marginTop: -10, paddingBottom: 10}}>
                <Heading level={4}>
                    Gernal Statistics
                </Heading>
                 <ButtonGroup justified style={{marginTop: 10}}>
                    {['Win Rate', 'Play Rate', 'Pick Rate', 'Ban Rate'].map(key => (
                        <Button key={key} active={key === activeKey} onClick={() => setActiveKey(key)}>
                        {key}
                        </Button>
                    ))}
                    </ButtonGroup>
            </Panel>
            <div className='data'>
                {loading ? 
                    <div>
                        Loading
                    </div>
                :
                    <>
                        {orderedData.map(protocol => (
                            <Card key={protocol.codename} shaded>
                                <VStack spacing={2}>
                                    <Card.Header>
                                        <Text size="lg">
                                            {protocol.name}
                                        </Text>
                                        <Text muted>
                                            Games Played: {protocol.games}
                                        </Text>
                                    </Card.Header>
                                    <Card.Body style={{width: '100%'}}>
                                        {(protocol.games ?? 0) >= 5 ?
                                            <StatGroup columns={4} spacing={0} >
                                                <StatItem value={protocol.bayesian} label={'Win Rate'} />
                                                <StatItem value={protocol.playRatio} label={'Play Rate'} />
                                                <StatItem value={protocol.pickRatio} label={'Pick Rate'} />
                                                <StatItem value={protocol.banRatio} label={'Ban Rate'} />
                                            </StatGroup>
                                            :
                                            <Text muted>
                                                not enough data
                                            </Text>
                                        }
                                    </Card.Body>
                                </VStack>
                            </Card>
                        ))}
                    </>
                } 
            </div>
        </div>
    );
}

export default Stats;
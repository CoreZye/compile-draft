import React from 'react';
import { StatGroup, Stat, Progress } from 'rsuite';
import bggPower from "@/assets/bgg_small.png";

import PeoplesIcon from '@rsuite/icons/Peoples';
import FunnelStepsIcon from '@rsuite/icons/FunnelSteps';

//interface BGGProps  {}
type BGGProps = object;

const BGGInfo: React.FC<BGGProps> = () => {

    return (
        <div className={`bgg-info`}>
            <div className="content">
                <StatGroup spacing={10} columns={2}>
                    <Stat bordered icon={<PeoplesIcon color="blue" style={{ fontSize: 30 }} />}>
                        <Stat.Value>21,000</Stat.Value>
                        <Stat.Label>Active Users</Stat.Label>
                    </Stat>

                    <Stat bordered icon={<FunnelStepsIcon color="blue" style={{ fontSize: 30 }} />}>
                        <Stat.Value>5.2%</Stat.Value>
                        <Stat.Label>Conversion Rate</Stat.Label>
                    </Stat>
                </StatGroup>
                <StatGroup spacing={10} columns={3} style={{marginTop: 10, marginBottom: 10}}>
                    <Stat bordered>
                        <Stat.Label>Processing</Stat.Label>
                        <Stat.Value>1,200</Stat.Value>
                        <Progress.Line percent={50} showInfo={false} />
                    </Stat>

                    <Stat bordered>
                        <Stat.Label>Pending</Stat.Label>
                        <Stat.Value>100</Stat.Value>
                        <Progress.Line percent={10} showInfo={false} strokeColor="#ffc107" />
                    </Stat>

                    <Stat bordered>
                        <Stat.Label>Completed</Stat.Label>
                        <Stat.Value>1,000</Stat.Value>
                        <Progress.Line percent={45} showInfo={false} strokeColor="#87d068" />
                    </Stat>
                </StatGroup>
                <StatGroup spacing={10} columns={2}>
                    <Stat bordered icon={<PeoplesIcon color="blue" style={{ fontSize: 30 }} />}>
                        <Stat.Value>21,000</Stat.Value>
                        <Stat.Label>Active Users</Stat.Label>
                    </Stat>

                    <Stat bordered icon={<FunnelStepsIcon color="blue" style={{ fontSize: 30 }} />}>
                        <Stat.Value>5.2%</Stat.Value>
                        <Stat.Label>Conversion Rate</Stat.Label>
                    </Stat>
                </StatGroup>
            </div>
            <div className="powered" style={{width: 160}}>
                <img alt={'Bgg'} src={bggPower} style={{
                    marginBottom: 20,
                    width: '100%'
                }}/>
            </div>
        </div>
    );
};

export default BGGInfo;
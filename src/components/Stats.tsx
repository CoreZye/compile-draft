import '@/css/Stats.less';
import React, { useEffect } from 'react';
import { Table, type SortType, Nav, Panel } from 'rsuite';
import { INITIAL_POOL } from '@/utils/constants';

const { Column, HeaderCell, Cell } = Table;

function getRandomIntInclusive(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomPercent(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

const data = INITIAL_POOL.map((item) => {
    return {
        protocol: item.name,
        games: getRandomIntInclusive(1000, 4000),
        pick: getRandomPercent(2.5, 22.5),
        win: getRandomPercent(2.5, 22.5),
        loss: getRandomPercent(2.5, 22.5),
    }
})
interface StatData {
    protocol: string;
    games: number;
    pick: number;
    win: number;
    loss: number;
}

function Stats () {
    const [sortColumn, setSortColumn] = React.useState<string>();
    const [sortType, setSortType] = React.useState<SortType>();
    const [loading, setLoading] = React.useState(false);
    const [activeKey, setActiveKey] = React.useState('general');
    const getData = () => {
        if (sortColumn && sortType) {
            return data.sort((a, b) => {
                let x = a[sortColumn as keyof StatData];
                let y = b[sortColumn as keyof StatData];
                if (typeof x === 'string') {
                    x = x.charCodeAt(0);
                }
                if (typeof y === 'string') {
                    y = y.charCodeAt(0);
                }
                if (sortType === 'asc') {
                    return x - y;
                } else {
                    return y - x;
                }
            });
        }
        return data;
    };

    const handleSortColumn = (sortColumn: string, sortType?: SortType) => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSortColumn(sortColumn);
            setSortType(sortType);
        }, 500);
    };

    useEffect(() =>{
        handleSortColumn('games', 'desc');
    },[])


    return (
        <>
            <main className="my-content-area">
                {activeKey === 'general' && (
                    <Panel header="General Statistics" bodyFill>
                        <Table
                            data={getData()}
                            sortColumn={sortColumn}
                            sortType={sortType}
                            onSortColumn={handleSortColumn}
                            loading={loading}
                            cellBordered
                            autoHeight
                            affixHeader
                            affixHorizontalScrollbar
                        >
                            <Column width={100} flexGrow={3} fixed resizable>
                                <HeaderCell> </HeaderCell>
                                <Cell dataKey="protocol" />
                            </Column>

                            <Column flexGrow={2} sortable>
                                <HeaderCell>Games</HeaderCell>
                                <Cell dataKey="games" />
                            </Column>

                            <Column flexGrow={2} sortable>
                                <HeaderCell>Pick %</HeaderCell>
                                <Cell dataKey="pick" >
                                    {rowData =><>{rowData.pick.toFixed(2)}%</>}
                                </Cell>
                            </Column>

                            <Column flexGrow={2} sortable>
                                <HeaderCell>Win %</HeaderCell>
                                <Cell dataKey="win" >
                                    {rowData =><>{rowData.win.toFixed(2)}%</>}
                                </Cell>
                            </Column>

                            <Column flexGrow={2} sortable>
                                <HeaderCell>Loss %</HeaderCell>
                                <Cell dataKey="loss" >
                                    {rowData =><>{rowData.loss.toFixed(2)}%</>}
                                </Cell>
                            </Column>
                        </Table>
                    </Panel>
                )}

                {activeKey === 'combo' && (
                    <Panel header="Combo Statistics">
                        {/* Your BGG XML API Component */}
                    </Panel>
                )}

                {activeKey === 'other' && (
                    <Panel header="Other Statistics">
                        <div style={{height: '70vh', whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                            {`
                                Personal vs Global Stats
                                - Basic: Games, Ban, Pick, Win, Loss ratios
                                - Combos: What protocols are often togather and their win ratios (best and worst?)
                                - First/Second/Third pick?
                                - ?? what more ??
                                `.trim().replace(/^\s+/gm, '')
                            }
                        </div>
                    </Panel>
                )}
            </main>
            <nav className="my-sidebar">
                <Nav
                    activeKey={activeKey}
                    onSelect={setActiveKey}
                    appearance="subtle"
                    justified
                >
                    <Nav.Item eventKey="general">General</Nav.Item>
                    <Nav.Item eventKey="combo">Combos</Nav.Item>
                    <Nav.Item eventKey="other">Other</Nav.Item>
                </Nav>
            </nav>
        </>
    );
}

export default Stats;
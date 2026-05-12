import '@/css/Stats.less';
import React from 'react';
import { Table, type SortType, Panel } from 'rsuite';
import {DraftCreator} from "@/components/minor/TempGenerateDraft.tsx";

const { Column, HeaderCell, Cell } = Table;


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
    const [activeKey] = React.useState('general');
    const [data] = React.useState([])
    const getData = () => {
        if (sortColumn && sortType) {
            return data.sort((a, b) => {
                const x = a[sortColumn as keyof StatData];
                const y = b[sortColumn as keyof StatData];
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

    return (
        <>
            <DraftCreator/>
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
        </>
    );
}

export default Stats;
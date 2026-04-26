import { INITIAL_POOL } from "@/utils/constants";
import { useState } from 'react';
import { Accordion, Steps, Card, Tag, TagGroup, Grid, Row, Col } from 'rsuite';
import { type IconType} from 'react-icons';
import { TbNumber0, TbNumber1, TbNumber2, TbNumber3, TbNumber4, TbNumber5, TbNumber6,  } from "react-icons/tb";

interface Card {
    value: number;
    top: string;
    middle: string;
    bottom: string
}
const cards: Card[] = [
    { value: 0, top: '', middle: '', bottom: '' },
    { value: 1, top: '', middle: '', bottom: '' },
    { value: 2, top: '', middle: '', bottom: '' },
    { value: 3, top: '', middle: '', bottom: '' },
    { value: 4, top: '', middle: '', bottom: '' },
    { value: 5, top: '', middle: 'Discard 1 card', bottom: '' },
]
const iconMap: Record<number, IconType> = {
    0: TbNumber0,
    1: TbNumber1,
    2: TbNumber2,
    3: TbNumber3,
    4: TbNumber4,
    5: TbNumber5,
    6: TbNumber6,
}

function Codex () {
    const [current, setCurrent] = useState(3);

    return (
        <div id={'codex'} >
            <Accordion defaultActiveKey={1} >
                {INITIAL_POOL.map((protocol) => {
                    return (
                        <Accordion.Panel key={protocol.id} header={protocol.name} eventKey={protocol.id}>
                            <div>
                                <Grid fluid>
                                    <Row>
                                        <Col span={3}>
                                            <Steps current={current} small vertical >
                                                {cards.map((card, idx) => {
                                                    const cardIdx = idx+1;
                                                    const Icon = iconMap[card.value];
                                                    return (
                                                        <>
                                                            <Steps.Item
                                                                icon={<Icon size={26} />}
                                                                status={current === cardIdx ? 'process' : 'wait'}
                                                                onClick={() => {
                                                                    setCurrent(cardIdx)
                                                                }}
                                                            />
                                                        </>
                                                    )
                                                })}
                                            </Steps>
                                        </Col>
                                        <Col span={21}>
                                            <Card shaded>
                                                <img
                                                    src="https://images.unsplash.com/photo-1576606539605-b2a44fa58467?q=80&w=1974"
                                                    alt="Shadow"
                                                />
                                                <Card.Body>
                                                    <TagGroup>
                                                        <Tag size="sm">Flip</Tag>
                                                        <Tag size="sm">Draw</Tag>
                                                    </TagGroup>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Grid>
                            </div>
                        </Accordion.Panel>
                    )
                })}
            </Accordion>
        </div>
    );
}

export default Codex;
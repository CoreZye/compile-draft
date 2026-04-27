import { Checkbox, CheckboxGroup, HStack, VStack, Stack, Input, Text, Button } from 'rsuite';
import { PACKS, INITIAL_POOL } from '@/utils/constants';
import { useSettings } from "@/context/SettingContext.ts";


interface Range {
    min?: number;
    max?: number;
}

interface GridConstraints {
    x?: Range;
    y?: Range;
}

interface GridResult {
    x: number;
    y: number;
    totalArea: number;
    emptySlots: number;
}

function getBestGrid(total: number, constraints: GridConstraints = {}): GridResult {
    const { x: xLimit, y: yLimit } = constraints;

    let bestX = -1;
    let bestY = -1;
    let minEmptySlots = Infinity;
    let minDiff = Infinity;

    // We check potential areas starting from 'total' upwards
    // To avoid infinite loops, we cap the search at a reasonable upper bound
    // (e.g., total * 2 or adding a fixed buffer)
    const maxSearchArea = total + (xLimit?.max || yLimit?.max || total);

    for (let area = total; area <= maxSearchArea; area++) {
        for (let x = 1; x <= area; x++) {
            if (area % x === 0) {
                const y = area / x;

                // Apply constraints
                if (xLimit?.min !== undefined && x < xLimit.min) continue;
                if (xLimit?.max !== undefined && x > xLimit.max) continue;
                if (yLimit?.min !== undefined && y < yLimit.min) continue;
                if (yLimit?.max !== undefined && y > yLimit.max) continue;

                const emptySlots = area - total;
                const diff = Math.abs(x - y);

                // Priority 1: Fewest empty slots
                // Priority 2: Closest to square (smallest x/y difference)
                if (emptySlots < minEmptySlots || (emptySlots === minEmptySlots && diff < minDiff)) {
                    minEmptySlots = emptySlots;
                    minDiff = diff;
                    bestX = x;
                    bestY = y;
                }
            }
        }

        // If we found a valid grid for this specific 'area' size,
        // and we are iterating areas upwards, the first area that works
        // is guaranteed to have the minimum empty slots.
        if (bestX !== -1) break;
    }

    if (bestX === -1) {
        throw new Error(`No valid grid found for ${total} within constraints.`);
    }

    return {
        x: bestX,
        y: bestY,
        totalArea: bestX * bestY,
        emptySlots: minEmptySlots
    };
}
function Setup() {
    const { ownedBoxIds, setOwnedBoxIds } = useSettings();

    const handleCheckAllChildren = (childIds: number[]) => {
        const allOwned = childIds.every(id => ownedBoxIds.includes(id));
        let nextIds: number[];

        if (allOwned) {
            nextIds = ownedBoxIds.filter(id => !childIds.includes(id));
        } else {
            nextIds = Array.from(new Set([...ownedBoxIds, ...childIds]));
        }
        setOwnedBoxIds(nextIds);
    };

    const handleChange = (id: number) => {
        const isOwned = ownedBoxIds.includes(id);

        const nextIds = isOwned
            ? ownedBoxIds.filter((item) => item !== id)
            : [...ownedBoxIds, id];
        setOwnedBoxIds(nextIds);
    };

    const handleClick = () => {
        const ret = getBestGrid(ownedBoxIds.length, {
            x: {
                min: 4, max: 4
            }
        });
        console.log(ownedBoxIds.length, ret);
    }

    return (
        <VStack>
            <VStack>
                <h3>Players</h3>
                <HStack>
                    <Text w={80}>Player 1: </Text>
                    <Input w={200} />
                </HStack>
                <HStack>
                    <Text w={80}>Player 2: </Text>
                    <Input w={200} />
                </HStack>
                <Button onClick={handleClick}>Click me</Button>

            </VStack>
            <Stack >
                {PACKS.map((pack) => {
                    const hasSome = pack.contains.some(id => (new Set(ownedBoxIds)).has(id))
                    const hasAll = pack.contains.every(id => (new Set(ownedBoxIds)).has(id));
                    return (
                        <VStack spacing={12} key={pack.id}>
                            <Checkbox
                                key={pack.id}
                                indeterminate={!hasAll && hasSome}
                                checked={hasAll}
                                onChange={() => handleCheckAllChildren(pack.contains)}
                            >
                                {pack.name}
                            </Checkbox>
                            <CheckboxGroup
                                name="checkboxList"
                                value={ownedBoxIds}
                                style={{ marginInlineStart: 20 }}
                            >
                                {pack.contains.map((protocolId) => {
                                    const protocol = INITIAL_POOL.find((item) => item.id === protocolId);
                                    if (!protocol) return;
                                    return (
                                        <Checkbox key={protocolId}
                                                  value={protocol.id}
                                                  onChange={() => handleChange(protocolId)}
                                        >
                                            {protocol.name}
                                        </Checkbox>
                                    )
                                })}
                            </CheckboxGroup>
                        </VStack>
                    )
                })}
            </Stack>
        </VStack>
    );
}

export default Setup;
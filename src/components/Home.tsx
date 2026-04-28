import { RadioTile, Text, Box } from 'rsuite';
import { FaFilePdf } from "react-icons/fa6";
function Home () {
    const openPdf = () => {
        window.open('/COMP-MN01_Rulesheet.pdf', '_blank', 'noreferrer');
    };

    return (
        <div id={'home'} >
            <Box >
                <RadioTile icon={<FaFilePdf size={44} color={'var(--accent)'} />} label="Compile rules" value="rules" checked={false} onClick={() => {
                    openPdf()
                }}>
                    <Text>PDF rules for the game.</Text>
                    <Text muted>last update: 01.01.2026</Text>
                </RadioTile>
            </Box>
        </div>
    );
}

export default Home;
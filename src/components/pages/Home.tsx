import { RadioTile, Text, Box } from 'rsuite';
import { FaFilePdf } from "react-icons/fa6";
import compile from "@/assets/compile-logo-long.webp";
import BGGInfo from "@/components/minor/BGGinfo.tsx";

function Home () {
    const openPdf = () => {
        window.open('/COMP-MN01_Rulesheet.pdf', '_blank', 'noreferrer');
    };

    return (
        <div id={'home'} style={{display: 'flex', flexWrap: 'wrap', height: '100%'}}>
            <Box>
                <img alt={'Compile'} src={compile} style={{
                    marginBottom: 20,
                    filter: 'opacity(20%)'

                }}/>
            </Box>
            <BGGInfo/>
            <Box style={{alignSelf: 'end', width: '100%'}}>
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
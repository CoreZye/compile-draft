import '@/css/Home.less';
import { RadioTile, Text, Box, Divider, Accordion } from 'rsuite';
import { FaFilePdf } from "react-icons/fa6";
import compile from "@/assets/compile-logo-long.webp";
import BGGInfo from "@/components/minor/BGGinfo.tsx";

const rulesFile = '/rules/COMP-MN01_Rulesheet.pdf';

function Home () {
    const openPdf = () => {
        window.open(rulesFile, '_blank', 'noreferrer');
    };

    return (
        <div id={'home'}>
            <Box className='compileImage'>
                <img alt={'Compile'} src={compile}/>
                <Box className='design'>
                    <Box className='tagline'>Programmed by </Box>
                    <Box className='author'>Michael Yang</Box>
                    
                </Box>
                <Divider style={{borderColor: 'var(--accent)'}}/>
            </Box>
            <Box className='frontContent'>
                <Accordion defaultActiveKey={1} className='full-height-accordion'>
                    <Accordion.Panel header="Basics" eventKey={1} >
                        <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque maximus magna enim, nec mattis metus ultricies vel. Donec finibus sem ut risus dignissim pellentesque. Donec finibus sapien nunc, tincidunt fermentum quam tincidunt vel. Nullam semper lectus ac metus elementum ornare. Nullam sit amet nunc at massa tincidunt euismod. Aliquam tristique nisi lobortis faucibus dignissim. Mauris egestas augue eget mauris scelerisque, nec egestas turpis feugiat. Morbi viverra posuere fermentum. Maecenas imperdiet tincidunt tincidunt.</Text>
                        <Text>Donec elit enim, suscipit eget velit vel, consectetur eleifend ante. Vestibulum eget dolor a nunc laoreet fringilla. Nunc euismod porttitor ipsum, non tempor tortor rutrum vitae. Nulla vitae ex ligula. Nulla semper dignissim leo pharetra imperdiet. Integer gravida lobortis faucibus. Integer blandit, diam vel ultrices rutrum, risus tellus lobortis nunc, sed ultrices massa mi nec lacus. Donec sed volutpat dui. Aenean pellentesque sollicitudin lectus, eget vulputate tellus gravida sed. Sed et fringilla leo.</Text>
                    </Accordion.Panel>
                    <Accordion.Panel header="Other stuff" eventKey={2}>
                        <Text>Donec elit enim, suscipit eget velit vel, consectetur eleifend ante. Vestibulum eget dolor a nunc laoreet fringilla. Nunc euismod porttitor ipsum, non tempor tortor rutrum vitae. Nulla vitae ex ligula. Nulla semper dignissim leo pharetra imperdiet. Integer gravida lobortis faucibus. Integer blandit, diam vel ultrices rutrum, risus tellus lobortis nunc, sed ultrices massa mi nec lacus. Donec sed volutpat dui. Aenean pellentesque sollicitudin lectus, eget vulputate tellus gravida sed. Sed et fringilla leo.</Text>
                        <Text>Vivamus ullamcorper venenatis risus, ac maximus augue lobortis at. Suspendisse ultricies efficitur iaculis. Sed sed turpis diam. Vivamus in risus porttitor nibh congue aliquet. Donec eget dictum turpis. Vivamus sollicitudin tincidunt enim non consectetur. Aenean non vestibulum nibh. Nunc eget erat tristique, blandit est imperdiet, molestie nisi. Cras lacinia magna ac erat vehicula gravida. Fusce ac faucibus lacus, sit amet hendrerit quam.</Text>
                    </Accordion.Panel>
                    <Accordion.Panel header="BGG Info" eventKey={3}>
                        <BGGInfo/>
                    </Accordion.Panel>
                </Accordion>
             </Box>
            
            <Box className='rules-info'>
                <RadioTile 
                    icon={<FaFilePdf size={44} color={'var(--accent)'} />} 
                    label="Compile rules" 
                    value="rules" 
                    checked={false} 
                    onClick={() => {openPdf()}}
                >
                    <Text>PDF rules for the game.</Text>
                    <Text muted>last update: 01.01.2026</Text>
                </RadioTile>
            </Box>

        </div>
    );
}

export default Home;
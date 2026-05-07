import '@/css/Profile.css';
import { GoogleLogin } from '@react-oauth/google';
import { Divider, Button, Text, Avatar, Card, HStack, VStack, Stack, RadioTile, Toggle } from 'rsuite';
import { useSettings } from "@/context/SettingContext.ts";
import { PACKS } from '@/utils/constants.ts';
import { LuCodesandbox, LuBandage  } from "react-icons/lu";
import { InstallButton } from '../InstallButton.tsx';

function Profile () {
    const { isLoggedIn, login, logout, name, image, email, setOwnedBoxIds, ownedBoxIds } = useSettings();
    const handleToggle = (value: number) => {
        if (ownedBoxIds.includes(value)) {
            setOwnedBoxIds(ownedBoxIds.filter((item) => (
                item !== value
            )))
        } else {
            setOwnedBoxIds([...ownedBoxIds, value])
        }
    };

    return (
        <div id={'profile'} >
            <div style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
                {!isLoggedIn ?
                    <Card key={'userLogin'} style={{width: '100%'}}>
                        <Card.Body>
                            <Stack.Item grow={1} style={{display: 'flex', justifyContent: 'center'}}>
                                <div className="google-login-container" >
                                    <GoogleLogin
                                        type={'standard'}
                                        text={'continue_with'}
                                        size={'large'}
                                        shape={'rectangular'}
                                        theme={'filled_black'}
                                        onSuccess={credentialResponse => {
                                            if (credentialResponse.credential) {
                                                login(credentialResponse.credential)
                                            }
                                        }}
                                        onError={() => {
                                            console.log('Login Failed');
                                        }}
                                    />
                                </div>
                        </Stack.Item>
                        </Card.Body>
                    </Card>
                    :
                    <Card key={'userLoggedin'} style={{width: '100%'}}>
                        <Card.Body>
                            <HStack>
                                <HStack grow={1}>
                                    <Avatar circle src={image} style={{marginRight: 5}}/>
                                    <VStack spacing={2}>
                                        <Text>{name}</Text>
                                        <Text muted size="xs">
                                            {email}
                                        </Text>
                                        
                                    </VStack>
                                </HStack>
                                <Stack.Item>
                                    <Button className='closeBtn' onClick={logout}>Logout</Button>
                                </Stack.Item>
                            </HStack>
                        </Card.Body>
                    </Card>
                }
            </div>
            <Divider/>
            <InstallButton/>
            <Divider>
                Owned packs
            </Divider>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap:5 }}>
                {PACKS.map((pack) => (
                    <div key={pack.id} style={{width: '100%', }}>
                        <RadioTile
                            disabled={!pack.released}
                            className={'cycle-' + pack.cycle}
                            checked={ownedBoxIds.includes(pack.id)}
                            icon={pack.name.includes('Main') ? <LuCodesandbox /> : <LuBandage style={{transform: 'rotate(90deg)'}}/>}
                            label={pack.name}
                            value={pack.id}
                            onClick={() => handleToggle(pack.id)}
                        >
                            {!pack.released ? 'Not released' : ''}
                        </RadioTile>
                    </div>
                ))}
            </div>
            <Divider style={{marginTop: 20}}>
                Player settings
            </Divider>
            <VStack spacing={20}>
                <Toggle size="xl">Option A</Toggle>
                <Toggle size="xl">Option B</Toggle>
            </VStack>
            <Divider style={{marginTop: 20}}>
                Draft settings
            </Divider>
            <VStack spacing={20}>
                <Toggle size="xl">Option C</Toggle>
                <Toggle size="xl">Option D</Toggle>
            </VStack>
        </div>
    );
}

export default Profile;
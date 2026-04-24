//import './Profile.css';
import { GoogleLogin } from '@react-oauth/google';

function Profile () {

    return (
        <div id={'profile'} className={'wip'}>
            <div style={{
                display: "flex",
                flexDirection: 'column',
                gap: '20px',
                textAlign: 'center'
            }}>
                <div>
                    Work in progress
                </div>

                <div className="google-login-container">
                    <GoogleLogin
                        type={'standard'}
                        text={'continue_with'}
                        size={'large'}
                        shape={'rectangular'}
                        theme={'filled_black'}
                        allowed_parent_origin={'http://localhost:5173'}
                        onSuccess={credentialResponse => {
                            console.log(credentialResponse); // This is your user data!
                        }}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Profile;
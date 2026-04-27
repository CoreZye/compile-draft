import '@/css/reset.css'
import '@/css/index.css'
import 'rsuite/dist/rsuite.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'


import App from './App.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <GoogleOAuthProvider clientId="119158066277-73hi8agepms8v0rab83h72oimiogbt9v.apps.googleusercontent.com">
            <App />
        </GoogleOAuthProvider>
    </StrictMode>,
)

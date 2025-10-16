import axios from 'axios';
import { GOOGLE_CONFIG } from '@/constants/google';

let gapiLoaded = false;
let gisLoaded = false;
let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let accessToken: string | null = null;

declare global {
    interface Window {
        gapi: {
            load: (name: string, callback: () => void) => void;
            client: {
                init: (args: { apiKey: string; discoveryDocs: string[] }) => Promise<void>;
            };
        };
        google: typeof google;
    }
}

export function initGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (gapiLoaded) return resolve();
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = () => {
            try {
                window.gapi.load('client', async () => {
                    try {
                        await window.gapi.client.init({
                            apiKey: GOOGLE_CONFIG.API_KEY,
                            discoveryDocs: [GOOGLE_CONFIG.DISCOVERY_DOC],
                        });
                        gapiLoaded = true;
                        console.log('✅ GAPI initialized');
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            } catch (err) {
                reject(err);
            }
        };
        script.onerror = () => reject(new Error('Failed to load GAPI script.'));
        document.body.appendChild(script);
    });
}

export function initGoogleIdentity(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (gisLoaded) return resolve();
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => {
            gisLoaded = true;
            console.log('✅ Google Identity initialized');
            resolve();
        };
        script.onerror = () => reject(new Error('Failed to load Google Identity script.'));
        document.body.appendChild(script);
    });
}

export async function signInWithGoogle(): Promise<{
    id: string;
    name: string;
    email: string;
    image: string;
    access_token: string;
}> {
    if (!gisLoaded) await initGoogleIdentity();
    return new Promise((resolve, reject) => {
        const oauth2 = window.google?.accounts?.oauth2;
        if (!oauth2) {
            reject(new Error('Google Identity Services not loaded.'));
            return;
        }
        tokenClient = oauth2.initTokenClient({
            client_id: GOOGLE_CONFIG.CLIENT_ID,
            scope: GOOGLE_CONFIG.SCOPES,
            callback: async (tokenResponse: google.accounts.oauth2.TokenResponse) => {
                if ('error' in tokenResponse && tokenResponse.error) {
                    reject(new Error(`Token error: ${tokenResponse.error}`));
                    return;
                }
                accessToken = tokenResponse.access_token;
                try {
                    const { data: profile } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });
                    resolve({
                        id: profile.sub,
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        access_token: accessToken,
                    });
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        reject(error.response?.data || error.message);
                    } else {
                        reject(error);
                    }
                }
            },
        });
        tokenClient.requestAccessToken({ prompt: 'consent' });
    });
}

export async function signOutGoogle(): Promise<void> {
    try {
        if (accessToken) {
            await axios.post(
                `https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`,
                {},
                { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
            );

            console.log('🔹 Token revoked');
            accessToken = null;
        }
        if (window.google?.accounts?.id) {
            window.google.accounts.id.disableAutoSelect();
        }
    } catch (e) {
        console.warn('⚠️ Sign-out warning:', e);
    }
}

export function getAccessToken(): string | null {
    return accessToken;
}

export function getCurrentUser() {
    return null;
}

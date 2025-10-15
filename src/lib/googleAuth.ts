const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
const SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/youtube.upload',
].join(' ');

let gapiLoaded = false;
let gisLoaded = false;
let tokenClient: google.accounts.oauth2.TokenClient | null = null;
let accessToken: string | null = null;

declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

export function initGapi(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (gapiLoaded) return resolve();
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/api.js';
        script.onload = async () => {
            try {
                await window.gapi.load('client', async () => {
                    await window.gapi.client.init({
                        apiKey: API_KEY,
                        discoveryDocs: [DISCOVERY_DOC],
                    });
                    gapiLoaded = true;
                    console.log('✅ GAPI initialized');
                    resolve();
                });
            } catch (err) {
                reject(err);
            }
        };
        script.onerror = reject;
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
        script.onerror = reject;
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
        if (!window.google?.accounts?.oauth2) {
            reject(new Error('Google Identity Services not loaded.'));
            return;
        }
        tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: async (tokenResponse: any) => {
                if (tokenResponse.error) {
                    reject(tokenResponse);
                    return;
                }
                accessToken = tokenResponse.access_token;
                console.log('🔑 Access Token:', accessToken);
                try {
                    const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    });

                    if (!res.ok) {
                        reject(await res.json());
                        return;
                    }
                    const profile = await res.json();
                    resolve({
                        id: profile.sub,
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                        access_token: accessToken,
                    });
                } catch (error) {
                    reject(error);
                }
            },
        });
        tokenClient.requestAccessToken({ prompt: 'consent' });
    });
}

export async function signOutGoogle(): Promise<void> {
    try {
        if (accessToken) {
            await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${accessToken}`, {
                method: 'POST',
                mode: 'no-cors',
            });
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

export function getCurrentUser() {
    return null;
}

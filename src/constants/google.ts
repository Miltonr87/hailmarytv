export const GOOGLE_CONFIG = {
    CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    API_KEY: import.meta.env.VITE_YOUTUBE_API_KEY,
    DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
    SCOPES: [
        'openid',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/youtube.upload',
    ].join(' '),
};

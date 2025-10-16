import axios from 'axios';
import {
    initGapi,
    initGoogleIdentity,
    signInWithGoogle,
    signOutGoogle,
    getAccessToken,
} from '../googleAuth';
import { GOOGLE_CONFIG } from '@/constants/google';

jest.mock('@/constants/google', () => ({
    GOOGLE_CONFIG: {
        API_KEY: 'mock_api_key',
        CLIENT_ID: 'mock_client_id',
        DISCOVERY_DOC: 'mock_discovery_doc',
        SCOPES: 'mock_scopes',
    },
}));

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('googleAuth library', () => {
    let createElementSpy: jest.SpyInstance;
    beforeEach(() => {
        jest.clearAllMocks();
        document.body.innerHTML = '';
        (global as any).gapiLoaded = false;
        (global as any).gisLoaded = false;
        (global as any).accessToken = null;
        createElementSpy = jest
            .spyOn(document, 'createElement')
            .mockImplementation((tagName: string) => {
                const el = document.createElementNS('http://www.w3.org/1999/xhtml', tagName);
                Object.defineProperty(el, 'onload', {
                    set(cb) {
                        if (typeof cb === 'function') setTimeout(cb, 0);
                    },
                });
                Object.defineProperty(el, 'onerror', {
                    set() { },
                });
                return el as any;
            });
        (window as any).gapi = {
            load: jest.fn((_name, cb) => cb()),
            client: { init: jest.fn().mockResolvedValue(undefined) },
        };
        (window as any).google = {
            accounts: {
                oauth2: {
                    initTokenClient: jest.fn(() => ({
                        requestAccessToken: jest.fn(),
                    })),
                },
                id: { disableAutoSelect: jest.fn() },
            },
        };
    });

    afterEach(() => {
        createElementSpy.mockRestore();
    });

    it('should load GAPI script and initialize client', async () => {
        await initGapi();
        expect(window.gapi.load).toHaveBeenCalled();
        expect(window.gapi.client.init).toHaveBeenCalledWith({
            apiKey: GOOGLE_CONFIG.API_KEY,
            discoveryDocs: [GOOGLE_CONFIG.DISCOVERY_DOC],
        });
    });

    it('should load Google Identity script successfully', async () => {
        await initGoogleIdentity();
        const script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        expect(script).toBeTruthy();
    });

    it('should resolve with user profile when successful', async () => {
        const mockProfile = {
            sub: '123',
            name: 'John Doe',
            email: 'john@example.com',
            picture: 'avatar.jpg',
        };
        mockedAxios.get.mockResolvedValueOnce({ data: mockProfile });
        const mockCallback = jest.fn();
        (window.google.accounts.oauth2.initTokenClient as jest.Mock).mockImplementation(({ callback }) => {
            mockCallback.mockImplementation(() => callback({ access_token: 'mock_token' }));
            return { requestAccessToken: mockCallback };
        });
        const result = await signInWithGoogle();
        expect(result).toEqual({
            id: '123',
            name: 'John Doe',
            email: 'john@example.com',
            image: 'avatar.jpg',
            access_token: 'mock_token',
        });
        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            expect.objectContaining({
                headers: { Authorization: 'Bearer mock_token' },
            }),
        );
    });

    it('should reject if Google Identity not loaded', async () => {
        delete (window as any).google;
        await expect(signInWithGoogle()).rejects.toThrow('Google Identity Services not loaded.');
    });

    it('should handle token error gracefully', async () => {
        (window.google.accounts.oauth2.initTokenClient as jest.Mock).mockImplementation(({ callback }) => ({
            requestAccessToken: () => callback({ error: 'invalid_grant' }),
        }));
        await expect(signInWithGoogle()).rejects.toThrow('Token error: invalid_grant');
    });

    it('should revoke token and disable auto-select', async () => {
        mockedAxios.post.mockResolvedValueOnce({});
        (global as any).accessToken = 'mock_token';
        await signOutGoogle();
        expect(mockedAxios.post).toHaveBeenCalledWith(
            'https://accounts.google.com/o/oauth2/revoke?token=mock_token',
            {},
            expect.any(Object),
        );
        expect(window.google.accounts.id.disableAutoSelect).toHaveBeenCalled();
    });

    it('should return null or token as expected', () => {
        expect(getAccessToken()).toBeNull();
        (global as any).accessToken = null;
        expect(getAccessToken()).toBeNull();
    });
});

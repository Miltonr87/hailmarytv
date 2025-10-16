import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@/hooks/useMobile';

describe('useIsMobile hook', () => {
    const originalInnerWidth = global.innerWidth;
    let mockMatchMedia: jest.Mock;

    beforeEach(() => {
        mockMatchMedia = jest.fn().mockImplementation((query) => ({
            matches: query.includes('max-width'),
            media: query,
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
        }));
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: mockMatchMedia,
        });
    });

    afterEach(() => {
        global.innerWidth = originalInnerWidth;
        jest.clearAllMocks();
    });

    it('should return true when window width is below breakpoint', () => {
        global.innerWidth = 500;
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);
    });

    it('should return false when window width is above breakpoint', () => {
        global.innerWidth = 1024;
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(false);
    });

    it('should update when resize event occurs', () => {
        global.innerWidth = 700;
        const { result } = renderHook(() => useIsMobile());
        expect(result.current).toBe(true);

        act(() => {
            global.innerWidth = 900;
            window.dispatchEvent(new Event('resize'));
        });

        // Hook only updates when matchMedia 'change' triggers, so simulate that
        act(() => {
            const changeHandler = mockMatchMedia.mock.results[0].value.addEventListener.mock.calls[0][1];
            changeHandler();
        });

        expect(result.current).toBe(false);
    });

    it('should clean up event listener on unmount', () => {
        const removeListener = jest.fn();
        mockMatchMedia.mockReturnValueOnce({
            matches: true,
            addEventListener: jest.fn(),
            removeEventListener: removeListener,
        });

        const { unmount } = renderHook(() => useIsMobile());
        unmount();

        expect(removeListener).toHaveBeenCalled();
    });
});

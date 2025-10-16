import { renderHook, act } from '@testing-library/react';
import { useToast, toast } from '@/hooks/useToast';

jest.useFakeTimers();

describe('useToast hook', () => {
    beforeEach(() => {
        jest.clearAllTimers();
    });

    it('should add a new toast', () => {
        const { result } = renderHook(() => useToast());
        act(() => {
            toast({ title: 'Test Toast', description: 'Hello world' });
        });
        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].title).toBe('Test Toast');
        expect(result.current.toasts[0].description).toBe('Hello world');
        expect(result.current.toasts[0].open).toBe(true);
    });

    it('should update an existing toast', () => {
        const { result } = renderHook(() => useToast());
        let toastInstance: ReturnType<typeof toast>;
        act(() => {
            toastInstance = toast({ title: 'Old Title' });
        });
        act(() => {
            toastInstance.update({ title: 'New Title' });
        });
        expect(result.current.toasts[0].title).toBe('New Title');
    });

    it('should dismiss a toast and remove it after delay', () => {
        const { result } = renderHook(() => useToast());
        let toastInstance: ReturnType<typeof toast>;
        act(() => {
            toastInstance = toast({ title: 'Dismiss Test' });
        });
        act(() => {
            result.current.dismiss(toastInstance.id);
        });
        expect(result.current.toasts[0].open).toBe(false);
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(result.current.toasts).toHaveLength(0);
    });

    it('should limit to only 1 toast at a time', () => {
        const { result } = renderHook(() => useToast());
        act(() => {
            toast({ title: 'Toast 1' });
            toast({ title: 'Toast 2' });
        });
        expect(result.current.toasts).toHaveLength(1);
        expect(result.current.toasts[0].title).toBe('Toast 2');
    });
});

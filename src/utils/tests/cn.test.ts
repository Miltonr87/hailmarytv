import { cn } from '../cn';

describe('cn utility', () => {
    it('merges multiple class names correctly', () => {
        expect(cn('p-4', 'text-lg', 'bg-blue-500')).toBe('p-4 text-lg bg-blue-500');
    });

    it('handles conditional classes and falsy values', () => {
        // eslint-disable-next-line no-constant-binary-expression
        expect(cn('p-4', false && 'hidden', null, undefined, 'text-lg')).toBe('p-4 text-lg');
    });

    it('resolves conflicting Tailwind classes correctly', () => {
        expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('merges conditional object-based classes from clsx syntax', () => {
        expect(cn('base', { active: true, hidden: false })).toBe('base active');
    });

    it('returns an empty string when no valid inputs are provided', () => {
        expect(cn()).toBe('');
        expect(cn('', false, null, undefined)).toBe('');
    });
});

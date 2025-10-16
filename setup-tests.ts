import '@testing-library/jest-dom';

// Silence React Router warnings in tests
const originalWarn = console.warn;
beforeAll(() => {
    console.warn = (...args) => {
        if (
            typeof args[0] === 'string' &&
            args[0].includes('React Router Future Flag Warning')
        ) {
            return; // skip
        }
        originalWarn(...args);
    };
});
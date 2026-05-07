import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia if it's not present (often needed for UI libraries)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock simple scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

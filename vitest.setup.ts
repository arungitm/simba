// vitest.setup.ts
import '@testing-library/jest-dom';

// You can add other global setup code here if needed
// For example, mocking global objects or functions

// Example: Mocking localStorage if your tests need it
// const localStorageMock = (function() {
//   let store: Record<string, string> = {};
//   return {
//     getItem: function(key: string) {
//       return store[key] || null;
//     },
//     setItem: function(key: string, value: string) {
//       store[key] = value.toString();
//     },
//     removeItem: function(key: string) {
//       delete store[key];
//     },
//     clear: function() {
//       store = {};
//     }
//   };
// })();
// Object.defineProperty(window, 'localStorage', { value: localStorageMock });

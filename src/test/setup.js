import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

function createStorageMock() {
  let store = new Map();

  return {
    get length() {
      return store.size;
    },
    clear() {
      store = new Map();
    },
    getItem(key) {
      return store.has(String(key)) ? store.get(String(key)) : null;
    },
    key(index) {
      return Array.from(store.keys())[index] ?? null;
    },
    removeItem(key) {
      store.delete(String(key));
    },
    setItem(key, value) {
      store.set(String(key), String(value));
    },
  };
}

if (!globalThis.localStorage || typeof globalThis.localStorage.clear !== "function") {
  Object.defineProperty(globalThis, "localStorage", {
    value: createStorageMock(),
    configurable: true,
  });
}

afterEach(() => {
  cleanup();
});

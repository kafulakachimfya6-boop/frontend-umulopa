const memoryStorage = new Map();

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const storage = getStorage();

  if (storage) {
    try {
      return storage.getItem('isAuthenticated') === 'true';
    } catch {
      return memoryStorage.get('isAuthenticated') === 'true';
    }
  }

  return memoryStorage.get('isAuthenticated') === 'true';
}

export function setAuthenticated(email) {
  const storage = getStorage();

  if (storage) {
    try {
      storage.setItem('isAuthenticated', 'true');
      storage.setItem('userEmail', email || '');
      return;
    } catch {
      // fall back to in-memory storage
    }
  }

  memoryStorage.set('isAuthenticated', 'true');
  memoryStorage.set('userEmail', email || '');
}

export function clearAuthentication() {
  const storage = getStorage();

  if (storage) {
    try {
      storage.removeItem('isAuthenticated');
      storage.removeItem('userEmail');
      return;
    } catch {
      // fall back to in-memory storage
    }
  }

  memoryStorage.delete('isAuthenticated');
  memoryStorage.delete('userEmail');
}

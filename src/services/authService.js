const SITE_URL = import.meta.env.VITE_SITE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function loginUser(username, password) {
  const res = await fetch(`${SITE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.message || `Erreur login (${res.status})`);
  }

  return res.json();
}

export async function fetchUserInfo(token) {
  if (!token) {
    throw new Error("Token manquant");
  }

  try {
    const res = await fetch(`${SITE_URL}/api/user-info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Backend error (${res.status})`);
    }

    const data = await res.json();
    return data; 
  } catch (error) {
    console.warn("Backend failed, fallback to mock:", error);

    if (import.meta.env.VITE_USE_MOCK === "true") {
      const { mockUser } = await import("../mocks/mockUser.js");
      return mockUser;
    }

    throw error;
  }
}
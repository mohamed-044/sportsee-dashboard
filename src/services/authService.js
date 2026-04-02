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
    throw new Error('Token manquant pour récupérer les données utilisateur');
  }

  if (import.meta.env.VITE_USE_MOCK === 'true') {
        const { mockUser } = await import('../mocks/mockUser.js');
        return mockUser;
      }

  try {
    const res = await fetch(`${SITE_URL}/api/user-info`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);

      if (res.status === 401 || res.status === 403) {
        throw new Error('Token invalide ou accès refusé. Veuillez vous reconnecter.');
      }

      throw new Error(err?.message || `Erreur user-info (${res.status})`);
    }

    return res.json();
  } catch (fetchError) {
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      const { mockUser } = await import('../mocks/mockUser.js');
      return mockUser;
    }
    throw fetchError;
  }
}

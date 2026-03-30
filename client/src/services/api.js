const API_BASE = '/api';

export async function shortenUrl(url, alias = null) {
  const response = await fetch(`${API_BASE}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url, alias: alias || undefined })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to shorten URL');
  }

  return data;
}

export async function getAllUrls() {
  const response = await fetch(`${API_BASE}/urls`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch URLs');
  }

  return data;
}

export async function getAnalytics(shortCode) {
  const response = await fetch(`${API_BASE}/urls/${shortCode}/analytics`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch analytics');
  }

  return data;
}

export async function deleteUrl(shortCode) {
  const response = await fetch(`${API_BASE}/urls/${shortCode}`, {
    method: 'DELETE'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete URL');
  }

  return data;
}

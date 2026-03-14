const API_BASE = "http://127.0.0.1:8000/api";

export async function getExpenses() {
  const res = await fetch(`${API_BASE}/expenses/`);

  if (!res.ok) {
    throw new Error("Failed to fetch expenses");
  }

  return res.json();
}

const API_BASE = "http://127.0.0.1:8000/api";

export async function apiRequest(endpoint, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Request Failed.");
  }

  return data;
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/token/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({username, password}),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error("Invalid credentials");
  }

  localStorage.setItem("access", data.access);
  localStorage.setItem("refresh", data.refresh);

  return data;
}

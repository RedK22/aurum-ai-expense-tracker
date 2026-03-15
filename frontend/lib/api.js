const API_BASE = "http://127.0.0.1:8000/api";

/*
Refresh access token using refresh token
*/
async function refreshAccessToken() {
  const refresh =
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null;

  if (!refresh) {
    throw new Error("No refresh token available.");
  }

  const res = await fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({refresh}),
  });

  if (!res.ok) {
    throw new Error("Failed to refresh token.");
  }

  const data = await res.json();

  if (typeof window !== "undefined") {
    localStorage.setItem("access", data.access);
    document.cookie = `access=${data.access}; path=/;`;
  }

  return data.access;
}

/*
Main API request function
*/
export async function apiRequest(endpoint, options = {}) {
  let token =
    typeof window !== "undefined" ? localStorage.getItem("access") : null;

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  // If access token expired → try refresh
  if (res.status === 401) {
    try {
      token = await refreshAccessToken();

      headers["Authorization"] = `Bearer ${token}`;

      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (err) {
      // Refresh failed → logout user
      if (typeof window !== "undefined") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        document.cookie = "access=; Max-Age=0; path=/;";
      }

      throw new Error("Session expired. Please login again.");
    }
  }

  let data = null;

  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  } else {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
  }

  if (!res.ok) {
    throw new Error(data?.error || "Request Failed.");
  }

  return data;
}

/*
Login function
*/
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

  if (typeof window !== "undefined") {
    localStorage.setItem("access", data.access);
    localStorage.setItem("refresh", data.refresh);

    // cookie for middleware
    document.cookie = `access=${data.access}; path=/;`;
  }

  return data;
}

/*
Logout helper 
*/
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    document.cookie = "access=; Max-Age=0; path=/;";
  }
}

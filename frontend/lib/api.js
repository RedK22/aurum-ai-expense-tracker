const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// 🔐 REFRESH CONTROL (IMPORTANT)
// ==============================
let isRefreshing = false;
let refreshPromise = null;

/*
Refresh access token using refresh token
*/
async function refreshAccessToken() {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const refresh =
    typeof window !== "undefined" ? localStorage.getItem("refresh") : null;

  if (!refresh) {
    throw new Error("No refresh token available.");
  }

  isRefreshing = true;

  refreshPromise = fetch(`${API_BASE}/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({refresh}),
  })
    .then(async (res) => {
      if (!res.ok) {
        throw new Error("Failed to refresh token.");
      }

      const data = await res.json();

      if (typeof window !== "undefined") {
        localStorage.setItem("access", data.access);
        document.cookie = `access=${data.access}; path=/; SameSite=Lax`;
      }

      return data.access;
    })
    .finally(() => {
      isRefreshing = false;
      refreshPromise = null;
    });

  return refreshPromise;
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

  // 🔥 If access token expired → try refresh
  if (res.status === 401) {
    try {
      token = await refreshAccessToken();

      headers["Authorization"] = `Bearer ${token}`;

      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (err) {
      // ❌ Refresh failed → logout user
      if (typeof window !== "undefined") {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        document.cookie = "access=; Max-Age=0; path=/;";

        // 🔥 redirect to login
        window.location.href = "/login";
      }

      throw new Error("Session expired.");
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
    document.cookie = `access=${data.access}; path=/; SameSite=Lax`;
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

// ==============================
// 📂 CATEGORY CACHE
// ==============================
let cachedCategories = null;

export async function getCategories() {
  if (cachedCategories) return cachedCategories;

  const data = await apiRequest("/categories/");
  const categoryList = Array.isArray(data) ? data : data.results || [];

  cachedCategories = categoryList;
  return categoryList;
}

export function invalidateCategories() {
  cachedCategories = null;
}

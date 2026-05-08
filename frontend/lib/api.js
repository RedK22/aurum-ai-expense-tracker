const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// ==============================
// 🔐 REFRESH CONTROL
// ==============================
let isRefreshing = false;
let refreshPromise = null;

/*
Refresh access token
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
      if (!res.ok) throw new Error("Refresh failed");

      const data = await res.json();

      if (typeof window !== "undefined") {
        localStorage.setItem("access", data.access);

        // 🔥 keep middleware working
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
🔥 AUTO LOGIN ON APP LOAD
Call this ONCE in layout / app init
*/
export async function tryAutoLogin() {
  if (typeof window === "undefined") return;

  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  // nothing stored → do nothing
  if (!refresh) return;

  // if access exists → assume ok
  if (access) {
    document.cookie = `access=${access}; path=/; SameSite=Lax`;
    return;
  }

  // 🔥 try refreshing silently
  try {
    const newAccess = await refreshAccessToken();

    document.cookie = `access=${newAccess}; path=/; SameSite=Lax`;
  } catch (err) {
    logout();
  }
}

/*
Main API request
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

  // 🔥 ACCESS EXPIRED → REFRESH
  if (res.status === 401) {
    try {
      token = await refreshAccessToken();

      headers["Authorization"] = `Bearer ${token}`;

      res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
      });
    } catch (err) {
      // ❌ refresh also failed → logout
      logout();

      if (typeof window !== "undefined") {
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
      data = null;
  }

  if (!res.ok) {
    throw new Error(data?.error || "Request Failed.");
  }

  return data;
}

/*
Login
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

    document.cookie = `access=${data.access}; path=/; SameSite=Lax`;
  }

  return data;
}

/*
Logout
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

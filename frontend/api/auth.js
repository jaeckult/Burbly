// api/auth.js

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Login – sets HTTP‑Only cookie for you
export async function loginUser(username, password) {
  const res = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Login failed')
  
  // Store the JWT token if provided
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  
  return data.user
}

// Google OAuth login
export async function loginWithGoogle(idToken) {
  const res = await fetch(`${API_BASE_URL}/api/auth/google`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Google login failed')
  
  // Store the JWT token in localStorage for future requests
  if (data.token) {
    localStorage.setItem('authToken', data.token);
  }
  
  return data
}

// Verify OTP
export async function verifyOTP(otp, username, email) {
  const res = await fetch(`${API_BASE_URL}/api/verify-otp`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ otp, username, email }),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'OTP verification failed')
  return data
}

// Signup – backend may also set a cookie
export async function signupUser(userData) {
  const res = await fetch(`${API_BASE_URL}/api/signup`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Signup failed')
  return data.user
}

// Logout – clears the HTTP‑Only cookie
export async function logoutUser() {
  const res = await fetch(`${API_BASE_URL}/api/logout`, {
    method: 'POST',
    credentials: 'include',
  })
  if (!res.ok) throw new Error('Logout failed')
  return true
}

// Fetch the current user using the cookie
export async function getCurrentUser() {
  const res = await fetch(`${API_BASE_URL}/api/me`, {
    credentials: 'include',
  })
  if (!res.ok) return null
  const { user } = await res.json()
  return user
}

// Quick check
export async function isAuthenticated() {
  return !!(await getCurrentUser())
}

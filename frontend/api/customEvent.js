const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

// Fetch the current user using the cookie
export async function getCustomEvent() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/customEvent`, {
      credentials: 'include',
    })
    
    if (!res.ok) {
      console.error('Response not ok:', res.status, res.statusText)
      return null
    }
    
    const data = await res.json()
    console.log('API Response:', data)
    
    return data.events || []
  } catch (error) {
    console.error('Error fetching events:', error)
    return null
  }
}

export async function addCustomEvent(eventData) {
  // Get the JWT token from localStorage
  const token = localStorage.getItem('authToken');
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}/api/customEvent`, {
    method: 'POST',
    credentials: 'include',
    headers,
    body: JSON.stringify(eventData),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Event post failed')
  return data
}
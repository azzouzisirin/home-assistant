const BASE_URL = 'http://localhost:3000/api'

export async function request(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(BASE_URL + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  })

  const data = await res.json()
  if (!res.ok) {
    const error = new Error(data.error || 'Request failed')
    error.code = data.code
    throw error
  }
  return data
}
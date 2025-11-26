const API_URL = "http://localhost:3001"

async function handleResponse(res) {
  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(errorBody || "Request failed")
  }
  return res.json()
}

export function apiGet(path) {
  return fetch(`${API_URL}${path}`).then(handleResponse)
}

export function apiPost(path, data) {
  return fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function apiPatch(path, data) {
  return fetch(`${API_URL}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  }).then(handleResponse)
}

export function apiDelete(path) {
  return fetch(`${API_URL}${path}`, {
    method: "DELETE",
  }).then((res) => {
    if (!res.ok) throw new Error("Delete failed")
    return true
  })
}

export const fetchRestful = <T extends {}>(url: string, method: string, body?: T, token?: string) => {
  const headers: Record<string, string> = token === undefined ? {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=UTF-8",
  } : {
    "Accept": "application/json",
    "Content-Type": "application/json; charset=UTF-8",
    "Authorization": `Token ${token}`,
  }

  if (body === undefined) {
    return fetch(url, {
      method: method,
      headers: headers,
    })
  } else {
    return fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(body),
    })
  }
}

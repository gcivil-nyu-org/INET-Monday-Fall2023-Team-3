export const fetchRestful = <T extends {}>(url: string, method: string, body: T) => {
  return fetch(url, {
    method: method,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(body),
  })
}

export const fetchRestfulWithToken = <T extends {}>(url: string, method: string, body: T, token: string) => {
  return fetch(url, {
    method: method,
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json; charset=UTF-8",
      "Authorization": `Token ${token}`,
    },
    body: JSON.stringify(body),
  })
}

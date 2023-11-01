import { Result } from "./models"

/**
 * Convert input camel cased string to snake case string
 *
 * @param str string you want to convert
 * @returns str converted to snake case
 */
const snakeCase = (str: string) => {
  return str
    .replace(/-/g, '_')
    .replace(/.[A-Z]+/g, str => str[0] + '_' + str.slice(1).toLowerCase())
}

/**
 * Make actual request to the endpoint with provided params
 *
 * @param url endpoint url
 * @param method request method, e.g. POST
 * @param body the request body, can be undefined
 * @param token the request authentication token, can be undefined
 * @returns the fetch promise
 */
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
    // no body, plain request
    return fetch(url, {
      method: method,
      headers: headers,
    })
  } else {
    // convert the camel cased keys in the give body
    // to snake case to make django happy
    const snakeCasedBody: Record<string, unknown> = {}
    Object.entries(body).forEach(([key, value]) => {
      snakeCasedBody[snakeCase(key)] = value
    })

    return fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(snakeCasedBody),
    })
  }
}


export const parseResponse = async <ResultType extends {} | undefined>(response: Response | undefined): Promise<Result<ResultType>> => {
  if (response === undefined) {
    return {
      status: false,
      error: "Unexpected error during request",
    }
  }

  const responseObject = await response.json().catch((err) => {
    console.error(err)
    return undefined
  })

  if (responseObject === undefined) {
    return {
      status: false,
      error: "Unexpected error during json parsing",
    }
  }

  if (response.ok) {
    return {
      status: true,
      value: responseObject as ResultType,
    }
  }

  return {
    status: false,
    error: `Server side error ${responseObject.detail}`,
  }
}

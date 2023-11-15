import { Result } from "./models";

/**
 * Convert input camel case string to snake case string
 *
 * @param str string you want to convert
 * @returns string converted to snake case
 */
const snakeCase = (str: string) => {
  return str
    .replace(/-/g, "_")
    .replace(/.[A-Z]+/g, (str) => str[0] + "_" + str.slice(1).toLowerCase());
};

/**
 * Convert input snake case string to camel case string
 *
 * @param str string you want to convert
 * @returns string converted to camel case
 */
const camelCase = (str: string) => {
  return str.replace(/[_-][a-z]/g, (str) => str.slice(1).toUpperCase());
};

/**
 * Make actual request to the endpoint with provided params
 *
 * @param url endpoint url
 * @param method request method, e.g. POST
 * @param body the request body, can be undefined
 * @param token the request authentication token, can be undefined
 * @returns the fetch promise
 */
export const fetchRestful = <T extends {}>(
  url: string,
  method: string,
  body?: T,
  token?: string
) => {
  const headers: Record<string, string> =
    token === undefined
      ? {
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8",
        }
      : {
          Accept: "application/json",
          "Content-Type": "application/json; charset=UTF-8",
          Authorization: `Token ${token}`,
        };

  if (body === undefined) {
    // no body, plain request
    return fetch(url, {
      method: method,
      headers: headers,
    });
  } else {
    // convert the camel cased keys in the give body
    // to snake case to make django happy
    const snakeCasedBody: Record<string, unknown> = {};
    Object.entries(body).forEach(([key, value]) => {
      snakeCasedBody[snakeCase(key)] = value;
    });

    return fetch(url, {
      method: method,
      headers: headers,
      body: JSON.stringify(snakeCasedBody),
    });
  }
};

export const parseResponse = async <ResultType extends {} | undefined>(
  response: Response | undefined
): Promise<Result<ResultType>> => {
  if (response === undefined) {
    return {
      status: false,
      error: "Unexpected error during request",
    };
  }

  // When calling graphUpdateAdd, the server will return 200 with empty body
  if (response.ok && response.headers.get("content-length") === "0") {
    return {
      status: true,
      value: {} as ResultType,
    };
  }

  const responseObject = await response.json().catch((err) => {
    console.error(err);
    return undefined;
  });

  if (responseObject === undefined) {
    return {
      status: false,
      error: "Unexpected error during json parsing",
    };
  }

  const camelCasedBody: Record<string, unknown> = {};
  Object.entries(responseObject).forEach(([key, value]) => {
    camelCasedBody[camelCase(key)] = value;
  });

  if (response.ok) {
    return {
      status: true,
      value: camelCasedBody as ResultType,
    };
  }

  return {
    status: false,
    error: `Server side error ${camelCasedBody.detail}`,
  };
};

import { IUser, IToken, Result, INode } from "./models"
import { fetchRestful } from "./helpers"

// add all backend endpoints to this list for auto code complete
const endpoints = [
  "/user/login/", "/user/create/", "/user/update/", "/user/get/",
  "/node/create/","/node/edit/", "/node/get/predefined/"
] as const

/**
 * Send a request to backend and process the result into proper forms
 *
 * @param endpoint backend endpoint
 * @param method request method
 * @param object request body
 * @param token authentication token
 * @returns parsed result from the request
 */
export const restfulRequest = async <BodyType extends {} | undefined, ResultType extends {}, Fixed extends boolean = true>(
  endpoint: Fixed extends true ? typeof endpoints[number] : string,
  method: string,
  object?: BodyType,
  token?: string
): Promise<Result<ResultType>> => {
  const response = await fetchRestful(endpoint, method, object, token).catch((err) => {
    console.error(err)
    return undefined
  })

  if (response === undefined) {
    return {
      status: false,
      error: "Unexpected error during request",
    }
  }

  if (!response.ok) {
    return {
      status: false,
      error: `Server side error ${response.status}`,
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

  if (responseObject.detail !== undefined) {
    return {
      status: false,
      error: responseObject.detail as string,
    }
  }

  return {
    status: true,
    value: responseObject as ResultType,
  }
}

export const userLogin = async (user: Omit<IUser, "username">) => {
  return restfulRequest<typeof user, IToken>("/user/login/", "POST", user)
}

export const userSignup = async (user: IUser) => {
  return restfulRequest<IUser, IToken>("/user/create/", "POST", user)
}

export const userUpdate = async (user: Partial<IUser> & Pick<IUser, "email">, token: string) => {
  return restfulRequest<typeof user, Partial<IUser> & Pick<IUser, "email">>("/user/update/", "POST", user, token)
}

export const userGet = async (token: string) => {
  return restfulRequest<undefined, Omit<IUser, "password">>("/user/get/", "GET", undefined, token)
}

export const nodeCreate = async (node: INode, token: string) => {
  return restfulRequest<INode, INode>("/node/create/", "POST", node, token)
}

export const nodeEdit = async (node: INode, token: string) => {
  return restfulRequest<INode, INode>("/node/create/", "POST", node, token)
}

export const nodeGetPredefined = async (token: string) => {
  return restfulRequest<undefined, INode[]>("/node/get/predefined/", "GET", undefined, token)
}

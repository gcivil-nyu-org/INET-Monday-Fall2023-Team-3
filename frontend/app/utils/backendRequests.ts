import { Ok, Err, IUser, IToken, Result, INode } from "./models"
import { fetchRestful } from "./helpers"

const endpoints = ["/backend/user/login", "/backend/user/signup", "/backend/user/update", "/backend/user/get", "/backend/node/create", "/node/create"] as const

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
  return restfulRequest<typeof user, IToken>("/backend/user/login", "POST", user)
}

export const userSignup = async (user: IUser) => {
  return restfulRequest<typeof user, IToken>("/backend/user/signup", "POST", user)
}

export const userUpdate = async (user: Partial<IUser> & Pick<IUser, "email">, token: string) => {
  return restfulRequest<typeof user, IUser>("/backend/user/update", "POST", user, token)
}

export const userGet = async (token: string) => {
  return restfulRequest<undefined, Omit<IUser, "password">>("/backend/user/get", "GET", undefined, token)
}


export const nodeCreate = async (node: INode) => {
  return restfulRequest<typeof node, INode>("/node/create", "POST", node)
}

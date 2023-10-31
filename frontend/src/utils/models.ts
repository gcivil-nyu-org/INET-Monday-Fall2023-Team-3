export type Err<T = string> = {
  status: false
  error: T
}

export type Ok<T> = {
  status: true
  value: T
}
/**
 * Represents result of a web request
 */
export type Result<T> = Ok<T> | Err

/**
 * Represents a token returned by backend
 */
export type IToken = {
  token: string
}

export type IMessage = {
  detail: string
}

/**
 * Represents a user in backend
 */
export type IUser = {
  email: string
  username: string
  password: string
}

/**
 * Represents a node in backend
 */
export type INode = {
  id: string
  name: string
  description: string
  predefined: boolean
  dependencies: string[]
}

/**
 * Represents a edge in backend
 */
export type IEdge = {
  id: string
  fromNode: string
  toNode: string
}

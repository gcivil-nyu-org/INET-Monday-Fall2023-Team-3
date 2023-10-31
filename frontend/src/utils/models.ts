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
export interface INode {
  id: string;
  name: string;
  description: string;
  isPredefined: boolean;
  dependencies: string[];
}

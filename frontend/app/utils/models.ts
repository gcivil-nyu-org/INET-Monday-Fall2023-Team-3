export type Err<T = string> = {
  status: false
  error: T
}

export type Ok<T> = {
  status: true
  value: T
}

export type Result<T> = Ok<T> | Err

export type IToken = {
  token: string
}

export type IUser = {
  email: string
  username: string
  password: string
}

export type INode = {
  name: string
  description: string
}

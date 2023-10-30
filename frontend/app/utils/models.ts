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

export interface INode {
  node_id: number;
  name: string;
  description: string;
  isPredefined: boolean;
  dependencies: INode[];
}
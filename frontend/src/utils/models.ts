export type Err<T = string> = {
  status: false;
  error: T;
};

export type Ok<T> = {
  status: true;
  value: T;
};
/**
 * Represents result of a web request
 */
export type Result<T> = Ok<T> | Err;

/**
 * Represents a token returned by backend
 */
export type IToken = {
  token: string;
};

export type IMessage = {
  detail: string;
};

/**
 * Represents a user in backend
 */
export type IUser = {
  email: string;
  username: string;
  password: string;
};

/**
 * Represents a node in backend
 */
export type INode = {
  id: string;
  name: string;
  description: string;
  predefined: boolean;
  dependencies: string[];
};

/**
 * Represents a edge in backend
 */
export type IEdge = {
  id: string;
  source: string;
  target: string;
};

/**
 * a type define missing dependencies
 */
export type IMissingDependency = {
  nodeName: string;
  missingDep: string;
} 

/**
 * a type define wrong dependencies
 */
export type IWrongDepedency = {
  sourceName: string;
  targetName: string;
}

/**
 * Represents a comment in backend
 */
export type IComment = {
  id: string; 
  body: string;
  user: string;
  parent: string;
  related_to: string;
  created_at: string;
}
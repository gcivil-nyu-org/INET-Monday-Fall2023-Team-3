import { IUser, INode, IEdge } from "./models";

// bodies
// user
export type IUserPingBody = undefined;

export type IUserCreateBody = IUser;

export type IUserLoginBody = Omit<IUser, "username">;

export type IUserGetBody = undefined;

export type IUserUpdateBody = Partial<IUser> & Pick<IUser, "email">;

// node
export type INodePingBody = undefined;

export type INodeCreateBody = Partial<INode> & Pick<INode, "name">;

export type INodeGetBody = undefined;

export type INodeUpdateBody = Partial<INode> & Pick<INode, "name" | "id">;

export type INodeDeleteBody = undefined;

// edge
export type IEdgePingBody = undefined;

export type IEdgeCreateBody = IEdge;

export type IEdgeGetBody = undefined;

export type IEdgeUpdateBody = IEdge;

export type IEdgeDeleteBody = undefined;

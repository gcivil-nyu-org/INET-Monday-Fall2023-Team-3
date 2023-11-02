import { IMessage, IToken, IUser, INode, IEdge } from "./models";

// Responses
// user
export type IUserPingResponse = IMessage;

export type IUserCreateResponse = IToken;

export type IUserLoginResponse = IToken;

export type IUserGetResponse = Omit<IUser, "password">;

export type IUserUpdateResponse = Omit<IUser, "password">;

// node
export type INodePingResponse = IMessage;

export type INodeCreateResponse = INode;

export type INodeGetResponse = INode;

export type INodesGetResponse = INode[];

export type INodeUpdateResponse = INode;

export type INodeDeleteResponse = undefined;

// edge
export type IEdgePingResponse = IMessage;

export type IEdgeCreateResponse = IEdge;

export type IEdgeGetResponse = IEdge;

export type IEdgeUpdateResponse = IEdge;

export type IEdgeDeleteResponse = undefined;

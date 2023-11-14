import { IUser, INode, IEdge, IGraph, INodePosition} from "./models";

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

export type INodesGetBody = undefined;

export type INodeUpdateBody = Partial<INode> & Pick<INode, "name" | "id">;

export type INodeDeleteBody = undefined;

// edge
export type IEdgePingBody = undefined;

export type IEdgeCreateBody = Omit<IEdge, "id">;

export type IEdgeGetBody = undefined;

export type IEdgeUpdateBody = IEdge;

export type IEdgeDeleteBody = undefined;

// graph

export type IGraphPingBody = undefined;

export type IGraphCreateBody = Partial<IGraph> & Pick<IGraph, "user">;

export type IGraphGetBody = undefined;

export type IGraphUpdateBody = Partial<IGraph> & Pick<IGraph, "id">;

export type IGraphDeleteBody = undefined;

export type INodePositionBody = INodePosition;

export type IGraphListBody = undefined;

export type IGraphTitleBody = Pick<IGraph, "title"> & Pick<IGraph, "id">;

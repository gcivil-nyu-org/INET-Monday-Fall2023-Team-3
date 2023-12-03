import { BackendModels } from "./models";
import { AwareOmit } from "./utils";

/**
 * Requests to backend
 */
export namespace Requests {
  /**
   * User related requests
   */
  export namespace User {
    export type Ping = undefined;
    export type SignUp = Pick<BackendModels.IUser, "email" | "username" | "password">;
    export type Login = Pick<BackendModels.IUser, "email" | "password">;
    export type Patch = Partial<BackendModels.IUser>; // need to update avatar too
    export type Get = undefined;
    export type GetSelf = undefined;
    export type GetAll = undefined;
  }

  /**
   * Node related requests
   */
  export namespace Node {
    export type Ping = undefined;
    export type Create = Pick<BackendModels.INode, "name"> &
      Partial<AwareOmit<BackendModels.INode, "id">>;
    export type Get = undefined;
    export type Patch = Partial<AwareOmit<BackendModels.INode, "id">>;
    export type Delete = undefined;
    export type Predefined = undefined;
  }

  /**
   * Edge related requests
   */
  export namespace Edge {
    export type Ping = undefined;
    export type Create = AwareOmit<BackendModels.IEdge, "id">;
    export type Get = undefined;
    export type Patch = Partial<AwareOmit<BackendModels.IEdge, "id">>;
    export type Delete = undefined;
  }

  /**
   * Graph related requests
   */
  export namespace Graph {
    export type Ping = undefined;
    export type Create = Pick<BackendModels.IGraph, "createdBy">;
    export type Get = undefined;
    export type Patch = Partial<
      Pick<BackendModels.IGraph, "sharedWith" | "title"> & { nodes: string[]; edges: string[] }
    >;
    export type Delete = undefined;
  }

  /**
   * Node position related requests
   */
  export namespace NodePosition {
    export type Create = BackendModels.INodePosition;
    export type Patch = Partial<AwareOmit<BackendModels.INodePosition, "graphId" | "nodeId">>;
    export type Delete = undefined;
  }

  /**
   * Comment related requests
   */
  export namespace Comment {
    export type Ping = undefined;
  }

  /**
   * Node comment related requests
   */
  export namespace NodeComment {
    export type Create = Pick<BackendModels.INodeComment, "body" | "createdBy" | "belongsTo"> &
      Partial<Pick<BackendModels.INodeComment, "parent">>;
    export type Get = undefined;
    export type Patch = Partial<Pick<BackendModels.INodeComment, "body" | "createdAt">>;
    export type Delete = undefined;
  }

  /**
   * Graph comment related requests
   */
  export namespace GraphComment {
    export type Create = Pick<BackendModels.IGraphComment, "body" | "createdBy" | "belongsTo"> &
      Partial<Pick<BackendModels.IGraphComment, "parent">>;
    export type Get = undefined;
    export type Patch = Partial<Pick<BackendModels.IGraphComment, "body" | "createdAt">>;
    export type Delete = undefined;
  }
}

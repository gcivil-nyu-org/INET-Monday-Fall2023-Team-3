import { BackendModels } from "./models";
import { AwareOmit } from "./utils";

/**
 * Responses from backend
 */
export namespace Responses {
  /**
   * User related responses
   */
  export namespace User {
    // user ping
    export type Ping = string;
    // user sign up
    export type SignUp = AwareOmit<BackendModels.IUser, "password"> & BackendModels.IUserToken;
    // user login
    export type Login = AwareOmit<BackendModels.IUser, "password"> & BackendModels.IUserToken;
    // user patch
    export type Patch = AwareOmit<BackendModels.IUser, "password">;
    // user get
    export type Get = AwareOmit<BackendModels.IUser, "password">;
    // user get self
    export type GetSelf = AwareOmit<BackendModels.IUser, "password">;
    // user get all
    export type GetAll = AwareOmit<BackendModels.IUser, "password">[];
  }

  /**
   * Node related responses
   */
  export namespace Node {
    // node ping
    export type Ping = string;
    // node create
    export type Create = BackendModels.INode;
    // node get
    export type Get = BackendModels.INode;
    // node patch
    export type Patch = BackendModels.INode;
    // node delete
    export type Delete = {};
    // node get predefined
    export type Predefined = BackendModels.INode;
  }

  /**
   * Edge related response
   */
  export namespace Edge {
    // edge ping
    export type Ping = string;
    // edge create
    export type Create = BackendModels.IEdge;
    // edge get
    export type Get = BackendModels.IEdge;
    // edge patch
    export type Patch = BackendModels.IEdge;
    // edge delete
    export type Delete = {};
  }

  /**
   * Graph related response
   */
  export namespace Graph {
    // graph ping
    export type Ping = string;
    // graph create
    export type Create = BackendModels.IGraph;
    // graph get
    export type Get = BackendModels.IGraph;
    // graph patch
    export type Patch = BackendModels.IGraph;
    // graph delete
    export type Delete = {};
  }

  /**
   * Node position related response
   */
  export namespace NodePosition {
    // node position create
    export type Create = BackendModels.INodePosition;
    // node position patch
    export type Patch = BackendModels.INodePosition;
  }

  /**
   * Comment related response
   */
  export namespace Comment {
    // comment ping
    export type Ping = string;
  }

  /**
   * Node comment related response
   */
  export namespace NodeComment {
    // node comment create
    export type Create = BackendModels.INodeComment;
    // node comment get
    export type Get = BackendModels.INodeComment;
    // node comment patch
    export type Patch = BackendModels.INodeComment;
    // node comment delete
    export type Delete = {};
  }

  /**
   * Graph comment related response
   */
  export namespace GraphComment {
    // graph comment create
    export type Create = BackendModels.IGraphComment;
    // graph comment get
    export type Get = BackendModels.IGraphComment;
    // graph comment patch
    export type Patch = BackendModels.IGraphComment;
    // graph comment delete
    export type Delete = {};
  }
}

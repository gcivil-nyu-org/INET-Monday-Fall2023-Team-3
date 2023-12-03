export namespace ResponseModels {
  /**
   * Standard success response data type from backend
   */
  export type Ok<ValueType> = {
    /**
     * status of the backend response
     */
    status: true;
    /**
     * detail of the backend response
     */
    detail: "ok";
    /**
     * value returned by backend
     */
    value: ValueType;
  };

  /**
   * Standard error response data type from backend
   */
  export type Error = {
    /**
     * status of the backend response
     */
    status: false;
    /**
     * error message returned by backend
     */
    detail: string;
  };

  /**
   * Representation of the result of a backend request
   */
  export type Result<ValueType> = Ok<ValueType> | Error;
}

export namespace BackendModels {
  /**
   * User of the application
   */
  export type IUser = {
    /**
     * email of the user, is unique and is primary key
     */
    email: string;
    /**
     * username of the user
     */
    username: string;
    /**
     * password of the user
     */
    password: string;
    /**
     * reference to graphs created by user
     */
    createdGraphs: string[];
    /**
     * reference to graphs shared with user
     */
    sharedGraphs: string[];
    /**
     * avatar of the user, can be blank (and will be set to balbasaur)
     */
    avatar: string;
  };

  /**
   * Token of the user
   */
  export type IUserToken = {
    /**
     * token of the user, will only exist
     * in login and signup responses
     */
    token: string;
  };

  /**
   * Node model in graph
   */
  export type INode = {
    /**
     * identifier of the node
     */
    id: string;
    /**
     * name of the node
     */
    name: string;
    /**
     * description of the node
     */
    description: string;
    /**
     * whether the node is a predefined node
     */
    predefined: boolean;
    /**
     * dependencies of the node
     */
    dependencies: string[];
  };

  /**
   * Edge model in graph
   */
  export type IEdge = {
    /**
     * identifier of the edge
     */
    id: string;
    /**
     * source of the edge, reference to a node
     */
    source: string;
    /**
     * target of the edge, reference to a node
     */
    target: string;
  };

  /**
   * Node postion in graph
   */
  export type INodePosition = {
    /**
     * reference to a graph
     */
    graphId: string;
    /**
     * reference to a node
     */
    nodeId: string;
    /**
     * x location on graph canvas
     */
    x: number;
    /**
     * y location on graph canvas
     */
    y: number;
  };

  /**
   * Graph model
   */
  export type IGraph = {
    /**
     * identifier of the graph
     */
    id: string;
    /**
     * title of the graph
     */
    title: string;
    /**
     * nodes in the graph
     */
    nodes: INode[];
    /**
     * positions of the nodes in the graph
     */
    nodePositions: INodePosition[];
    /**
     * edges in the graph
     */
    edges: IEdge[];
    /**
     * reference to the user who create this graph
     */
    createdBy: string;
    /**
     * reference to the users this graph is shared with
     */
    sharedWith: string[];
  };

  /**
   * Comment on a node
   */
  export type INodeComment = {
    /**
     * identifier of the comment
     */
    id: string;
    /**
     * content of the comment
     */
    body: string;
    /**
     * reference to the user who create this comment
     */
    createdBy: string;
    /**
     * when this comment is created
     */
    createdAt: string;
    /**
     * parent of the comment, if any
     */
    parent?: string;
    /**
     * which node this comment belongs to
     */
    belongsTo: string;
  };

  /**
   * Comment on a graph
   */
  export type IGraphComment = {
    /**
     * identifier of the comment
     */
    id: string;
    /**
     * content of the comment
     */
    body: string;
    /**
     * reference to the user who create this comment
     */
    createdBy: string;
    /**
     * when this comment is created
     */
    createdAt: string;
    /**
     * parent of the comment, if any
     */
    parent: string;
    /**
     * which graph this comment belongs to
     */
    belongsTo: string;
  };
}

import {
  IEdgeCreateBody,
  IEdgeDeleteBody,
  IEdgeGetBody,
  IEdgePingBody,
  IEdgeUpdateBody,
  INodeCreateBody,
  INodeDeleteBody,
  INodeGetBody,
  INodesGetBody,
  INodePingBody,
  INodeUpdateBody,
  IUserCreateBody,
  IUserGetBody,
  IUserLoginBody,
  IUserPingBody,
  IUserUpdateBody,
  ICommentsGetBody,
  ICommentCreateBody,
} from "./bodies";
import {
  IEdgeCreateResponse,
  IEdgeDeleteResponse,
  IEdgeGetResponse,
  IEdgePingResponse,
  IEdgeUpdateResponse,
  INodeCreateResponse,
  INodeDeleteResponse,
  INodeGetResponse,
  INodesGetResponse,
  INodePingResponse,
  INodeUpdateResponse,
  IUserCreateResponse,
  IUserGetResponse,
  IUserLoginResponse,
  IUserPingResponse,
  IUserUpdateResponse,
  ICommentsGetResponse,
  ICommentCreateResponse,
} from "./responses";

// add endpoints to this type to enable code autocomplete
// and type inference
// param indicates if the endpoint requires path params
export type Endpoints = {
  "/user/ping/": {
    param: false;
    authenticate: false;
    method: "GET";
    bodyType: IUserPingBody;
    resultType: IUserPingResponse;
  };
  "/user/create/": {
    param: false;
    authenticate: false;
    method: "POST";
    bodyType: IUserCreateBody;
    resultType: IUserCreateResponse;
  };
  "/user/login/": {
    param: false;
    authenticate: false;
    method: "POST";
    bodyType: IUserLoginBody;
    resultType: IUserLoginResponse;
  };
  "/user/get/": {
    param: false;
    authenticate: true;
    method: "GET";
    bodyType: IUserGetBody;
    resultType: IUserGetResponse;
  };
  "/user/update/": {
    param: false;
    authenticate: true;
    method: "POST";
    bodyType: IUserUpdateBody;
    resultType: IUserUpdateResponse;
  };

  "/node/ping/": {
    param: false;
    authenticate: false;
    method: "GET";
    bodyType: INodePingBody;
    resultType: INodePingResponse;
  };
  "/node/create/": {
    param: false;
    authenticate: true;
    method: "POST";
    bodyType: INodeCreateBody;
    resultType: INodeCreateResponse;
  };
  "/node/get/": {
    param: true;
    authenticate: true;
    method: "GET";
    bodyType: INodeGetBody;
    resultType: INodeGetResponse;
  };
  "/node/update/": {
    param: false;
    authenticate: true;
    method: "PUT";
    bodyType: INodeUpdateBody;
    resultType: INodeUpdateResponse;
  };
  "/node/delete/": {
    param: true;
    authenticate: true;
    method: "DELETE";
    bodyType: INodeDeleteBody;
    resultType: INodeDeleteResponse;
  };
  "/node/predefined-nodes/": {
    param: false;
    authenticate: true;
    method: "GET";
    bodyType: INodesGetBody;
    resultType: INodesGetResponse;
  };
  "/edge/ping/": {
    param: false;
    authenticate: false;
    method: "GET";
    bodyType: IEdgePingBody;
    resultType: IEdgePingResponse;
  };
  "/edge/create/": {
    param: false;
    authenticate: true;
    method: "POST";
    bodyType: IEdgeCreateBody;
    resultType: IEdgeCreateResponse;
  };
  "/edge/get/": {
    param: true;
    authenticate: true;
    method: "GET";
    bodyType: IEdgeGetBody;
    resultType: IEdgeGetResponse;
  };
  "/edge/update/": {
    param: false;
    authenticate: true;
    method: "PUT";
    bodyType: IEdgeUpdateBody;
    resultType: IEdgeUpdateResponse;
  };
  "/edge/delete/": {
    param: true;
    authenticate: true;
    method: "DELETE";
    bodyType: IEdgeDeleteBody;
    resultType: IEdgeDeleteResponse;
  };
  "/comment/get-by-node/": {
    param: true;
    authenticate: true;
    method: "GET";
    bodyType: ICommentsGetBody;
    resultType: ICommentsGetResponse;
  };
  "/comment/create/": {
    param: false;
    authenticate: true;
    method: "POST";
    bodyType: ICommentCreateBody;
    resultType: ICommentCreateResponse;
  };
};

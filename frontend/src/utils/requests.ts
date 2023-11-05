import {
  IEdgeCreateBody,
  IEdgeDeleteBody,
  IEdgeGetBody,
  IEdgePingBody,
  IEdgeUpdateBody,
  IGraphCreateBody,
  IGraphGetBody,
  IGraphPingBody,
  IGraphUpdateBody,
  IGraphDeleteBody,
  INodeCreateBody,
  INodeDeleteBody,
  INodeGetBody,
  INodePingBody,
  INodeUpdateBody,
  IUserCreateBody,
  IUserGetBody,
  IUserLoginBody,
  IUserPingBody,
  IUserUpdateBody,
} from "./bodies";
import {
  IEdgeCreateResponse,
  IEdgeDeleteResponse,
  IEdgeGetResponse,
  IEdgePingResponse,
  IEdgeUpdateResponse,
  IGraphCreateResponse,
  IGraphGetResponse,
  IGraphPingResponse,
  IGraphUpdateResponse,
  IGraphDeleteResponse,
  INodeCreateResponse,
  INodeDeleteResponse,
  INodeGetResponse,
  INodePingResponse,
  INodeUpdateResponse,
  IUserCreateResponse,
  IUserGetResponse,
  IUserLoginResponse,
  IUserPingResponse,
  IUserUpdateResponse,
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
  "/graph/ping/": {
    param: false;
    authenticate: false;
    method: "GET";
    bodyType: IGraphPingBody;
    resultType: IGraphPingResponse;
  };
  "/graph/create/": {
    param: false;
    authenticate: true;
    method: "POST";
    bodyType: IGraphCreateBody;
    resultType: IGraphCreateResponse;
  };
  "/graph/get/": {
    param: true;
    authenticate: true;
    method: "GET";
    bodyType: IGraphGetBody;
    resultType: IGraphGetResponse;
  };
  "/graph/update/": {
    param: false;
    authenticate: true;
    method: "PUT";
    bodyType: IGraphUpdateBody;
    resultType: IGraphUpdateResponse;
  };
  "/graph/delete/": {
    param: true;
    authenticate: true;
    method: "DELETE";
    bodyType: IGraphDeleteBody;
    resultType: IGraphDeleteResponse;
  };
};

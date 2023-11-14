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
  ICommentUpdateBody,
  ICommentDeleteBody,
  INodePositionBody,
  IGraphListBody,
  IGraphTitleBody,
} from "./bodies";
import { IGraphList } from "./models";
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
  ICommentUpdateResponse,
  ICommentDeleteResponse,
  INodePositionResponse,
  IGraphListResponse,
  IGraphTitleResponse,
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
  "/user/get-name/": {
    param: true;
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
  "/comment/update/": {
    param: false;
    authenticate: true;
    method: "PUT";
    bodyType: ICommentUpdateBody;
    resultType: ICommentUpdateResponse;
  };
  "/comment/delete/": {
    param: true;
    authenticate: true;
    method: "DELETE";
    bodyType: ICommentDeleteBody;
    resultType: ICommentDeleteResponse;
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
  "/graph/update-add/": {
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
  "/graph/node-position/": {
    param: false;
    authenticate: true;
    method: "PUT";
    bodyType: INodePositionBody;
    resultType: INodePositionResponse;
  };
  "/graph/list-get/": {
    param: true;
    authenticate: true;
    method: "GET";
    bodyType: IGraphListBody;
    resultType: IGraphListResponse;
  };
  "/graph/title-set/": {
    param: false;
    authenticate: true;
    method: "PUT";
    bodyType: IGraphTitleBody;
    resultType: IGraphTitleResponse;
  };
}

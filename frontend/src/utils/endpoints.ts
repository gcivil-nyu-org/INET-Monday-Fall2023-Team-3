import { Requests } from "./requests";
import { Responses } from "./responses";

export type Endpoints = {
  "/user/ping/": {
    paramType: undefined;
    authenticate: false;
    method: "GET";
    bodyType: Requests.User.Ping;
    resultType: Responses.User.Ping;
  };
  "/user/signup/": {
    paramType: undefined;
    authenticate: false;
    method: "POST";
    bodyType: Requests.User.SignUp;
    resultType: Responses.User.SignUp;
  };
  "/user/login/": {
    paramType: undefined;
    authenticate: false;
    method: "POST";
    bodyType: Requests.User.Login;
    resultType: Responses.User.Login;
  };
  "/user/patch/": {
    paramType: undefined;
    authenticate: true;
    method: "PATCH";
    bodyType: Requests.User.Patch;
    resultType: Responses.User.Patch;
  };
  "/user/get/": {
    paramType: string;
    authenticate: true;
    method: "GET";
    bodyType: Requests.User.Get;
    resultType: Responses.User.Get;
  };
  "/user/self/": {
    paramType: undefined;
    authenticate: true;
    method: "GET";
    bodyType: Requests.User.GetSelf;
    resultType: Responses.User.GetSelf;
  };
  "/user/all/": {
    paramType: undefined;
    authenticate: true;
    method: "GET";
    bodyType: Requests.User.GetAll;
    resultType: Responses.User.GetAll;
  };

  "/node/ping/": {
    paramType: undefined;
    authenticate: false;
    method: "GET";
    bodyType: Requests.Node.Ping;
    resultType: Responses.Node.Ping;
  };
  "/node/create/": {
    paramType: undefined;
    authenticate: true;
    method: "POST";
    bodyType: Requests.Node.Create;
    resultType: Responses.Node.Create;
  };
  "/node/get/": {
    paramType: string;
    authenticate: true;
    method: "GET";
    bodyType: Requests.Node.Get;
    resultType: Responses.Node.Get;
  };
  "/node/patch/": {
    paramType: string;
    authenticate: true;
    method: "PATCH";
    bodyType: Requests.Node.Patch;
    resultType: Responses.Node.Patch;
  };
  "/node/delete/": {
    paramType: string;
    authenticate: true;
    method: "DELETE";
    bodyType: Requests.Node.Delete;
    resultType: Responses.Node.Delete;
  };
  "/node/predefined/all/": {
    paramType: undefined;
    authenticate: true;
    method: "GET";
    bodyType: Requests.Node.Predefined;
    resultType: Responses.Node.Predefined;
  };

  "/edge/ping/": {
    paramType: undefined;
    authenticate: false;
    method: "GET";
    bodyType: Requests.Edge.Ping;
    resultType: Responses.Edge.Ping;
  };
  "/edge/create/": {
    paramType: undefined;
    authenticate: true;
    method: "POST";
    bodyType: Requests.Edge.Create;
    resultType: Responses.Edge.Create;
  };
  "/edge/get/": {
    paramType: string;
    authenticate: true;
    method: "GET";
    bodyType: Requests.Edge.Get;
    resultType: Responses.Edge.Get;
  };
  "/edge/patch/": {
    paramType: string;
    authenticate: true;
    method: "PATCH";
    bodyType: Requests.Edge.Patch;
    resultType: Responses.Edge.Patch;
  };
  "/edge/delete/": {
    paramType: string;
    authenticate: true;
    method: "DELETE";
    bodyType: Requests.Edge.Delete;
    resultType: Responses.Edge.Delete;
  };

  "/graph/ping/": {
    paramType: undefined;
    authenticate: false;
    method: "GET";
    bodyType: Requests.Graph.Ping;
    resultType: Responses.Graph.Ping;
  };
  "/graph/create/": {
    paramType: undefined;
    authenticate: true;
    method: "POST";
    bodyType: Requests.Graph.Create;
    resultType: Responses.Graph.Create;
  };
  "/graph/get/": {
    paramType: string;
    authenticate: true;
    method: "GET";
    bodyType: Requests.Graph.Get;
    resultType: Responses.Graph.Get;
  };
  "/graph/patch/": {
    paramType: string;
    authenticate: true;
    method: "PATCH";
    bodyType: Requests.Graph.Patch;
    resultType: Responses.Graph.Patch;
  };
  "/graph/delete/": {
    paramType: string;
    authenticate: true;
    method: "DELETE";
    bodyType: Requests.Graph.Delete;
    resultType: Responses.Graph.Delete;
  };

  "/graph/node-position/create/": {
    paramType: undefined;
    authenticate: true;
    method: "POST";
    bodyType: Requests.NodePosition.Create;
    resultType: Responses.NodePosition.Create;
  };
  "/graph/node-position/patch/": {
    paramType: [string, string];
    authenticate: true;
    method: "PATCH";
    bodyType: Requests.NodePosition.Patch;
    resultType: Responses.NodePosition.Patch;
  };
  "/graph/node-position/delete/": {
    paramType: [string, string];
    authenticate: true;
    method: "DELETE";
    bodyType: Requests.NodePosition.Delete;
    resultType: Responses.NodePosition.Delete;
  };

  "/comment/ping/": {
    paramType: undefined;
    authenticate: false;
    method: "GET";
    bodyType: Requests.Comment.Ping;
    resultType: Responses.Comment.Ping;
  };
  "/comment/node/create/": {
    paramType: undefined;
    authenticate: true;
    method: "POST";
    bodyType: Requests.NodeComment.Create;
    resultType: Responses.NodeComment.Create;
  };
  "/comment/node/get/": {
    paramType: string;
    authenticate: true;
    method: "GET";
    bodyType: Requests.NodeComment.Get;
    resultType: Responses.NodeComment.Get;
  };
  "/comment/node/patch/": {
    paramType: string;
    authenticate: true;
    method: "PATCH";
    bodyType: Requests.NodeComment.Patch;
    resultType: Responses.NodeComment.Patch;
  };
  "/comment/node/delete/": {
    paramType: string;
    authenticate: true;
    method: "DELETE";
    bodyType: Requests.NodeComment.Delete;
    resultType: Responses.NodeComment.Delete;
  };
  "/comment/graph/create/": {
    paramType: undefined;
    authenticate: true;
    method: "POST";
    bodyType: Requests.GraphComment.Create;
    resultType: Responses.GraphComment.Create;
  };
  "/comment/graph/get/": {
    paramType: string;
    authenticate: true;
    method: "GET";
    bodyType: Requests.GraphComment.Get;
    resultType: Responses.GraphComment.Get;
  };
  "/comment/graph/patch/": {
    paramType: string;
    authenticate: true;
    method: "PATCH";
    bodyType: Requests.GraphComment.Patch;
    resultType: Responses.GraphComment.Patch;
  };
  "/comment/graph/delete/": {
    paramType: string;
    authenticate: true;
    method: "DELETE";
    bodyType: Requests.GraphComment.Delete;
    resultType: Responses.GraphComment.Delete;
  };
};

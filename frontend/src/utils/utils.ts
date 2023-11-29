import { Endpoints } from "./endpoints";
import { fetchRestful, parseResponse } from "./helpers";
import { ResponseModels } from "./models";

export type AwareOmit<T extends {}, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

type EndpointUrls = keyof Endpoints;

export type RequestParams<Endpoint extends EndpointUrls> = {
  param: Endpoints[Endpoint]["paramType"];
  body: Endpoints[Endpoint]["bodyType"];
  token: Endpoints[Endpoint]["authenticate"] extends true ? string : undefined;
};

export type UndefinedFields<T extends {}> = {
  [K in keyof T]: T[K] extends undefined ? never : K;
}[keyof T];

export type PickSolidFields<T extends {}> = Pick<T, UndefinedFields<T>>;

export type RemoveUndefined<T extends {}> = PickSolidFields<T> &
  Partial<Pick<T, UndefinedFields<T>>>;

export type RequestFunc<Endpoint extends EndpointUrls> = (
  endpoint: Endpoint,
  method: Endpoints[Endpoint]["method"],
  params: RemoveUndefined<RequestParams<Endpoint>>
) => Promise<ResponseModels.Result<Endpoints[Endpoint]["resultType"]>>;

export type RequestBuilder<Endpoint extends EndpointUrls> = (
  params: RemoveUndefined<RequestParams<Endpoint>>
) => Promise<ResponseModels.Result<Endpoints[Endpoint]["resultType"]>>;

export namespace RequestMethods {
  const request = async <
    Endpoint extends keyof Endpoints,
    Method extends Endpoints[Endpoint]["method"] = Endpoints[Endpoint]["method"],
    Params extends RemoveUndefined<RequestParams<Endpoint>> = RemoveUndefined<
      RequestParams<Endpoint>
    >
  >(
    endpoint: Endpoint,
    method: Method,
    params: Params
  ): Promise<ResponseModels.Result<Endpoints[Endpoint]["resultType"]>> => {
    const { param, body, token } = params as any;
    let url = `${endpoint}`;

    if (param !== undefined) {
      if (typeof param === "string") {
        url = `${url}${param}/`;
      } else if (param instanceof Array) {
        url = `${url}${param.join("/")}/`;
      }
    }

    const response = await fetchRestful(url, method, body, token).catch((err) => {
      console.error(err);
      return undefined;
    });

    return parseResponse<Endpoints[Endpoint]["resultType"]>(response);
  };

  export const userPing: RequestBuilder<"/user/ping/"> = (params) => {
    return request("/user/ping/", "GET", params);
  };

  export const userSignUp: RequestBuilder<"/user/signup/"> = (params) => {
    return request("/user/signup/", "POST", params);
  };

  export const userLogin: RequestBuilder<"/user/login/"> = (params) => {
    return request("/user/login/", "POST", params);
  };

  export const userPatch: RequestBuilder<"/user/patch/"> = (params) => {
    return request("/user/patch/", "PATCH", params);
  };

  export const userGet: RequestBuilder<"/user/get/"> = (params) => {
    return request("/user/get/", "GET", params);
  };

  export const userGetSelf: RequestBuilder<"/user/self/"> = (params) => {
    return request("/user/self/", "GET", params);
  };

  export const userGetAll: RequestBuilder<"/user/all/"> = (params) => {
    return request("/user/all/", "GET", params);
  };

  export const nodePing: RequestBuilder<"/node/ping/"> = (params) => {
    return request("/node/ping/", "GET", params);
  };

  export const nodeCreate: RequestBuilder<"/node/create/"> = (params) => {
    return request("/node/create/", "POST", params);
  };

  export const nodeGet: RequestBuilder<"/node/get/"> = (params) => {
    return request("/node/get/", "GET", params);
  };

  export const nodePatch: RequestBuilder<"/node/patch/"> = (params) => {
    return request("/node/patch/", "PATCH", params);
  };

  export const nodeDelete: RequestBuilder<"/node/delete/"> = (params) => {
    return request("/node/delete/", "DELETE", params);
  };

  export const nodeGetPredefined: RequestBuilder<"/node/predefined/all/"> = (params) => {
    return request("/node/predefined/all/", "GET", params);
  };

  export const edgePing: RequestBuilder<"/edge/ping/"> = (params) => {
    return request("/edge/ping/", "GET", params);
  };

  export const edgeCreate: RequestBuilder<"/edge/create/"> = (params) => {
    return request("/edge/create/", "POST", params);
  };

  export const edgeGet: RequestBuilder<"/edge/get/"> = (params) => {
    return request("/edge/get/", "GET", params);
  };

  export const edgePatch: RequestBuilder<"/edge/patch/"> = (params) => {
    return request("/edge/patch/", "PATCH", params);
  };

  export const edgeDelete: RequestBuilder<"/edge/delete/"> = (params) => {
    return request("/edge/delete/", "DELETE", params);
  };

  export const graphCreate: RequestBuilder<"/graph/create/"> = (params) => {
    return request("/graph/create/", "POST", params);
  };

  export const graphGet: RequestBuilder<"/graph/get/"> = (params) => {
    return request("/graph/get/", "GET", params);
  };

  export const graphPatch: RequestBuilder<"/graph/patch/"> = (params) => {
    return request("/graph/patch/", "PATCH", params);
  };

  export const graphDelete: RequestBuilder<"/graph/delete/"> = (params) => {
    return request("/graph/delete/", "DELETE", params);
  };

  export const nodePositionCreate: RequestBuilder<"/graph/node-position/create/"> = (params) => {
    return request("/graph/node-position/create/", "POST", params);
  };

  export const nodePositionPatch: RequestBuilder<"/graph/node-position/patch/"> = (params) => {
    return request("/graph/node-position/patch/", "PATCH", params);
  };

  export const commentPing: RequestBuilder<"/comment/ping/"> = (params) => {
    return request("/comment/ping/", "GET", params);
  };

  export const nodeCommentCreate: RequestBuilder<"/comment/node/create/"> = (params) => {
    return request("/comment/node/create/", "POST", params);
  };

  export const nodeCommentGet: RequestBuilder<"/comment/node/get/"> = (params) => {
    return request("/comment/node/get/", "GET", params);
  };

  export const nodeCommentPatch: RequestBuilder<"/comment/node/patch/"> = (params) => {
    return request("/comment/node/patch/", "PATCH", params);
  };

  export const nodeCommentDelete: RequestBuilder<"/comment/node/delete/"> = (params) => {
    return request("/comment/node/delete/", "DELETE", params);
  };

  export const graphCommentCreate: RequestBuilder<"/comment/graph/create/"> = (params) => {
    return request("/comment/graph/create/", "POST", params);
  };

  export const graphCommentGet: RequestBuilder<"/comment/graph/get/"> = (params) => {
    return request("/comment/graph/get/", "GET", params);
  };

  export const graphCommentPatch: RequestBuilder<"/comment/graph/patch/"> = (params) => {
    return request("/comment/graph/patch/", "PATCH", params);
  };

  export const graphCommentDelete: RequestBuilder<"/comment/graph/delete/"> = (params) => {
    return request("/comment/graph/delete/", "DELETE", params);
  };
}

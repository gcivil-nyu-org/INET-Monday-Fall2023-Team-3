import { Result } from "./models";
import { fetchRestful, parseResponse } from "./helpers";
import { Endpoints } from "./requests";

// avoid conflict with frontend pages
const endpointPrefix = "/backend";

type RestfulRequestParams<
  Endpoint extends keyof Endpoints,
  BodyType extends Endpoints[Endpoint]["bodyType"] = Endpoints[Endpoint]["bodyType"]
> = {
  param: string;
  body: BodyType;
  token: string;
};

type UndefinedOmit<Object extends {}, OmitKeys extends keyof Object> = Omit<Object, OmitKeys> & {
  [Key in OmitKeys]?: undefined;
};

type RestfulRequestFunc<
  Endpoint extends keyof Endpoints,
  RequireParam extends Endpoints[Endpoint]["param"] = Endpoints[Endpoint]["param"],
  RequireAuthenticate extends Endpoints[Endpoint]["authenticate"] = Endpoints[Endpoint]["authenticate"],
  Method extends Endpoints[Endpoint]["method"] = Endpoints[Endpoint]["method"],
  BodyType extends Endpoints[Endpoint]["bodyType"] = Endpoints[Endpoint]["bodyType"],
  ResultType extends Endpoints[Endpoint]["resultType"] = Endpoints[Endpoint]["resultType"]
> = RequireParam extends true
  ? // param: true
    RequireAuthenticate extends true
    ? // authenticate: true
      BodyType extends undefined
      ? (
          endpoint: Endpoint,
          method: Method,
          params: UndefinedOmit<RestfulRequestParams<Endpoint>, "body">
        ) => Promise<Result<ResultType>>
      : (
          endpoint: Endpoint,
          method: Method,
          params: RestfulRequestParams<Endpoint>
        ) => Promise<Result<ResultType>>
    : // authenticate: false
    BodyType extends undefined
    ? (
        endpoint: Endpoint,
        method: Method,
        params: UndefinedOmit<RestfulRequestParams<Endpoint>, "body" | "token">
      ) => Promise<Result<ResultType>>
    : (
        endpoint: Endpoint,
        method: Method,
        params: UndefinedOmit<RestfulRequestParams<Endpoint>, "token">
      ) => Promise<Result<ResultType>>
  : // param: false
  RequireAuthenticate extends true
  ? // authenticate: true
    BodyType extends undefined
    ? (
        endpoint: Endpoint,
        method: Method,
        params: UndefinedOmit<RestfulRequestParams<Endpoint>, "param" | "body">
      ) => Promise<Result<ResultType>>
    : (
        endpoint: Endpoint,
        method: Method,
        params: UndefinedOmit<RestfulRequestParams<Endpoint>, "param">
      ) => Promise<Result<ResultType>>
  : // authenticate: false
  BodyType extends undefined
  ? (
      endpoint: Endpoint,
      method: Method,
      params: UndefinedOmit<RestfulRequestParams<Endpoint>, "param" | "body" | "token">
    ) => Promise<Result<ResultType>>
  : (
      endpoint: Endpoint,
      method: Method,
      params: UndefinedOmit<RestfulRequestParams<Endpoint>, "param" | "token">
    ) => Promise<Result<ResultType>>;

export const restfulRequest = async <
  Endpoint extends keyof Endpoints,
  Method extends Endpoints[Endpoint]["method"] = Endpoints[Endpoint]["method"],
  ResultType extends Endpoints[Endpoint]["resultType"] = Endpoints[Endpoint]["resultType"]
>(
  endpoint: Endpoint,
  method: Method,
  params: Parameters<RestfulRequestFunc<Endpoint>>[2]
): Promise<Result<ResultType>> => {
  const { param, body, token } = params;
  const url =
    param === undefined ? `${endpointPrefix}${endpoint}` : `${endpointPrefix}${endpoint}${param}/`;
  const response = await fetchRestful(url, method, body, token).catch((err) => {
    console.error(err);
    return undefined;
  });
  return parseResponse(response);
};

type RestfulRequestHelper<
  Endpoint extends keyof Endpoints,
  RequireParam extends Endpoints[Endpoint]["param"] = Endpoints[Endpoint]["param"],
  RequireAuthenticate extends Endpoints[Endpoint]["authenticate"] = Endpoints[Endpoint]["authenticate"],
  BodyType extends Endpoints[Endpoint]["bodyType"] = Endpoints[Endpoint]["bodyType"],
  ResultType extends Endpoints[Endpoint]["resultType"] = Endpoints[Endpoint]["resultType"]
> = RequireParam extends true
  ? // param: true
    RequireAuthenticate extends true
    ? // authenticate: true
      BodyType extends undefined
      ? (param: string, token: string) => Promise<Result<ResultType>>
      : (param: string, body: BodyType, token: string) => Promise<Result<ResultType>>
    : // authenticate: false
    BodyType extends undefined
    ? (param: string) => Promise<Result<ResultType>>
    : (param: string, body: BodyType) => Promise<Result<ResultType>>
  : // param: false
  RequireAuthenticate extends true
  ? // authenticate: true
    BodyType extends undefined
    ? (token: string) => Promise<Result<ResultType>>
    : (body: BodyType, token: string) => Promise<Result<ResultType>>
  : // authenticate: true
  BodyType extends undefined
  ? () => Promise<Result<ResultType>>
  : (body: BodyType) => Promise<Result<ResultType>>;

export const userPing: RestfulRequestHelper<"/user/ping/"> = () => {
  return restfulRequest("/user/ping/", "GET", {});
};

export const userCreate: RestfulRequestHelper<"/user/create/"> = (body) => {
  return restfulRequest("/user/create/", "POST", { body });
};

export const userLogin: RestfulRequestHelper<"/user/login/"> = (body) => {
  return restfulRequest("/user/login/", "POST", { body });
};

export const userGet: RestfulRequestHelper<"/user/get/"> = (token) => {
  return restfulRequest("/user/get/", "GET", { token });
};

export const userUpdate: RestfulRequestHelper<"/user/update/"> = (body, token) => {
  return restfulRequest("/user/update/", "POST", { body, token });
};

export const nodePing: RestfulRequestHelper<"/node/ping/"> = () => {
  return restfulRequest("/node/ping/", "GET", {});
};

export const nodeCreate: RestfulRequestHelper<"/node/create/"> = (body, token) => {
  return restfulRequest("/node/create/", "POST", { body, token });
};

export const nodeGet: RestfulRequestHelper<"/node/get/"> = (param, token) => {
  return restfulRequest("/node/get/", "GET", { param, token });
};

export const nodeGetPredefined: RestfulRequestHelper<"/node/predefined-nodes/"> = (token) => {
  return restfulRequest("/node/predefined-nodes/", "GET", {token});
}

export const nodeUpdate: RestfulRequestHelper<"/node/update/"> = (body, token) => {
  return restfulRequest("/node/update/", "PUT", { body, token });
};

export const nodeDelete: RestfulRequestHelper<"/node/delete/"> = (param, token) => {
  return restfulRequest("/node/delete/", "DELETE", { param, token });
};

export const edgePing: RestfulRequestHelper<"/edge/ping/"> = () => {
  return restfulRequest("/edge/ping/", "GET", {});
};

export const edgeCreate: RestfulRequestHelper<"/edge/create/"> = (body, token) => {
  return restfulRequest("/edge/create/", "POST", { body, token });
};

export const edgeGet: RestfulRequestHelper<"/edge/get/"> = (param, token) => {
  return restfulRequest("/edge/get/", "GET", { param, token });
};

export const edgeUpdate: RestfulRequestHelper<"/edge/update/"> = (body, token) => {
  return restfulRequest("/edge/update/", "PUT", { body, token });
};

export const edgeDelete: RestfulRequestHelper<"/edge/delete/"> = (param, token) => {
  return restfulRequest("/edge/delete/", "DELETE", { param, token });
};

export const graphPing: RestfulRequestHelper<"/graph/ping/"> = () => {
  return restfulRequest("/graph/ping/", "GET", {});
};

export const graphCreate: RestfulRequestHelper<"/graph/create/"> = (body, token) => {
  return restfulRequest("/graph/create/", "POST", { body, token });
}

export const graphGet: RestfulRequestHelper<"/graph/get/"> = (param, token) => {
  return restfulRequest("/graph/get/", "GET", { param, token });
};

export const graphUpdateAdd: RestfulRequestHelper<"/graph/update-add/"> = (body, token) => {
  return restfulRequest("/graph/update-add/", "PUT", { body, token });
};

export const graphDelete: RestfulRequestHelper<"/graph/delete/"> = (param, token) => {
  return restfulRequest("/graph/delete/", "DELETE", { param, token });
};

export const graphNodePosition: RestfulRequestHelper<"/graph/node-position/"> = (body, token) => {
  return restfulRequest("/graph/node-position/", "PUT", { body, token });
};

export const graphListGet: RestfulRequestHelper<"/graph/list-get/"> = (param, token) => {
  return restfulRequest("/graph/list-get/", "GET", { param, token });
};

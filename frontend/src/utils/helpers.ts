import { ResponseModels } from "./models";

const backendPrefix = "/backend";

const pokemonAvatarSrc = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/";

export const defaultAvatarSrc = `${pokemonAvatarSrc}001.png`;

export const refreshPokemonAvatar = () => {
  const avatarIndex = String(Math.floor(Math.random() * 99) + 1).padStart(3, "0");
  const avatarSrc = `${pokemonAvatarSrc}${avatarIndex}.png`;
  localStorage.setItem("smooth/avatar", avatarSrc);
  console.log(`avatar refreshed to ${avatarSrc}`);
  return avatarSrc;
};

export const fetchRestful = <T extends {}>(
  url: string,
  method: string,
  body?: T,
  token?: string
) => {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json; charset=UTF-8",
  };
  if (token !== undefined) {
    headers["Authorization"] = `Token ${token}`;
  }

  const requestParam: RequestInit = {
    method: method,
    headers: headers,
  };

  if (body !== undefined) {
    requestParam.body = JSON.stringify(body);
  }

  return fetch(`${backendPrefix}${url}`, requestParam);
};

export const parseResponse = async <ResultType extends {}>(
  response: Response | undefined
): Promise<ResponseModels.Result<ResultType>> => {
  if (response === undefined) {
    return {
      status: false,
      detail: "failed to fetch response",
    };
  }

  const body = await response.json().catch((err) => {
    console.error(err);
    return undefined;
  });

  if (body === undefined) {
    return {
      status: false,
      detail: "failed to parse response body",
    };
  }

  return body;
};

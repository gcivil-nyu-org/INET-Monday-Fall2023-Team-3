import { BackendModels } from "src/utils/models";
import { AwareOmit } from "src/utils/utils";

export interface UserSlice {
  user: AwareOmit<BackendModels.IUser, "password">;
  token: string;
  setUser: (user: Partial<AwareOmit<BackendModels.IUser, "password">>) => void;
  setToken: (token: string) => void;

  createdGraphs: BackendModels.IGraph[];
  fetchCreatedGraphs: () => Promise<void>;

  sharedGraphs: BackendModels.IGraph[];
  fetchSharedGraphs: () => Promise<void>;
}

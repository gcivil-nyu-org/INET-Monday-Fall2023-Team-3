import { StateCreator, create } from "zustand";
import { UserSlice } from "./userStore";
import { GraphSlice } from "./graphStore";
import { RequestMethods } from "src/utils/utils";
import { BackendModels, ResponseModels } from "src/utils/models";

// add later slices here
type CombinedStoreType = UserSlice & GraphSlice;

const createUserSlice: StateCreator<CombinedStoreType, [], [], UserSlice> = (set, get) => ({
  user: {
    email: "",
    username: "",
    createdGraphs: [],
    sharedGraphs: [],
    avatar: "",
  },

  setUser: (user) => set((state) => ({ user: { ...state.user, ...user } })),

  token: "",
  setToken: (token) => set({ token: token }),

  createdGraphs: [],
  fetchCreatedGraphs: async () => {
    const results = await Promise.all(
      get().user.createdGraphs.map((graphId) =>
        RequestMethods.graphGet({ param: graphId, token: get().token })
      )
    );
    const createdGraphs = results
      .filter((result): result is ResponseModels.Ok<BackendModels.IGraph> => result.status)
      .map((result) => result.value);

    set({ createdGraphs });
  },

  sharedGraphs: [],
  fetchSharedGraphs: async () => {
    const results = await Promise.all(
      get().user.sharedGraphs.map((graphId) =>
        RequestMethods.graphGet({ param: graphId, token: get().token })
      )
    );
    const sharedGraphs = results
      .filter((result): result is ResponseModels.Ok<BackendModels.IGraph> => result.status)
      .map((result) => result.value);
    set({ sharedGraphs });
  },
});

const createGraphSlice: StateCreator<CombinedStoreType, [], [], GraphSlice> = (set, get) => ({
  graph: {
    id: "",
    title: "",
    nodes: [],
    nodePositions: [],
    edges: [],
    createdBy: "",
    sharedWith: [],
  },
  setGraph: (graph) => {
    const newGraph = {
      ...get().graph,
      ...graph,
    };
    console.log(newGraph);
    set({
      graph: newGraph,
    });
  },
  predefinedNodeMap: {},
  fetchPredefinedNodes: async () => {
    const result = await RequestMethods.nodeGetPredefined({ token: get().token });
    if (result.status) {
      const tempRecord: Record<string, BackendModels.INode> = {};
      for (const node of result.value) {
        tempRecord[node.id] = node;
      }
      set({ predefinedNodeMap: tempRecord });
    }
  },
});

export const useCombinedStore = create<CombinedStoreType>()((...args) => ({
  ...createUserSlice(...args),
  ...createGraphSlice(...args),
}));

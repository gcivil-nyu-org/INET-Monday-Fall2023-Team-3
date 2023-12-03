import { StateCreator, create } from "zustand";
import { UserSlice } from "./userStore";
import { GraphSlice } from "./graphStore";
import { RequestMethods } from "src/utils/utils";
import { BackendModels, ResponseModels } from "src/utils/models";
import { ReactFlowSlice } from "./reactflowStore";
import {
  Connection,
  Edge,
  EdgeChange,
  MarkerType,
  Node,
  NodeChange,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  getIncomers,
  getOutgoers,
} from "reactflow";
import { subscribeWithSelector, devtools } from "zustand/middleware";

// add later slices here
type CombinedStoreType = UserSlice & GraphSlice & ReactFlowSlice;

const createUserSlice: StateCreator<CombinedStoreType, [], [], UserSlice> = (set, get) => ({
  user: {
    email: "",
    username: "",
    createdGraphs: [],
    sharedGraphs: [],
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
    edges: [],
    nodePositions: [],
    createdBy: "",
    sharedWith: [],
  },
  setGraph: (graph) => {
    set({
      graph: {
        ...get().graph,
        ...graph,
      },
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
  addNode: (node) => {
    const graph = get().graph;
    const defaultPosition = get().defaultPosition;
    const nextNodes = [...graph.nodes, node];
    const newNodePosition = {
      graphId: graph.id,
      nodeId: node.id,
      x: defaultPosition.x,
      y: defaultPosition.y,
    };
    const nextNodePositions = [...graph.nodePositions, newNodePosition];
    set({
      graph: {
        ...graph,
        nodes: nextNodes,
        nodePositions: nextNodePositions,
      },
      nodes: [
        ...get().nodes,
        {
          id: node.id,
          position: defaultPosition,
          type: "smoothNode",
          data: node,
        },
      ],
    });

    RequestMethods.graphPatch({
      param: graph.id,
      token: get().token,
      body: {
        nodes: nextNodes.map((node) => node.id),
      },
    });

    RequestMethods.nodePositionCreate({
      token: get().token,
      body: newNodePosition,
    });
  },
  editNode: (nodeId, node) => {
    const graph = get().graph;
    const nextNodes = graph.nodes.map((prevNode) => {
      if (prevNode.id === nodeId) {
        return { ...prevNode, ...node };
      }
      return prevNode;
    });

    set({
      graph: {
        ...graph,
        nodes: nextNodes,
      },
    });

    RequestMethods.nodePatch({
      param: nodeId,
      token: get().token,
      body: node,
    });
  },
  deleteNodes: (deletedNodes) => {
    const graph = get().graph;
    const nextNodes = graph.nodes.filter(
      (node) => !deletedNodes.some((deletedNode) => deletedNode.id === node.id)
    );

    set({
      graph: {
        ...graph,
        nodes: nextNodes,
        nodePositions: graph.nodePositions.filter(
          (nodePosition) =>
            !deletedNodes.some((deletedNode) => deletedNode.id === nodePosition.nodeId)
        ),
      },
    });

    RequestMethods.graphPatch({
      param: graph.id,
      token: get().token,
      body: {
        nodes: nextNodes.map((node) => node.id),
      },
    });

    for (const deletedNode of deletedNodes) {
      RequestMethods.nodePositionDelete({
        param: [graph.id, deletedNode.id],
        token: get().token,
      });
    }
  },
  addEdge: (edge) => {
    const graph = get().graph;
    const nextEdges = [...graph.edges, edge];

    set({
      graph: {
        ...graph,
        edges: nextEdges,
      },
      edges: [
        ...get().edges,
        {
          id: edge.id,
          source: edge.source,
          target: edge.target,
          style: {
            strokeWidth: 3,
          },
          markerEnd: {
            type: MarkerType.Arrow,
          },
        },
      ],
    });

    RequestMethods.graphPatch({
      param: graph.id,
      token: get().token,
      body: {
        edges: nextEdges.map((edge) => edge.id),
      },
    });
  },
  deleteEdges: (edges) => {
    const graph = get().graph;
    const nextEdges = graph.edges.filter(
      (prevEdge) => !edges.some((edge) => edge.id === prevEdge.id)
    );

    set({
      graph: {
        ...graph,
        edges: nextEdges,
      },
    });

    RequestMethods.graphPatch({
      param: graph.id,
      token: get().token,
      body: {
        edges: nextEdges.map((edge) => edge.id),
      },
    });
  },
  updateNodePosition: (node) => {
    const graph = get().graph;
    const nextNodePosition = {
      graphId: graph.id,
      nodeId: node.id,
      x: node.position.x,
      y: node.position.y,
    };

    set({
      graph: {
        ...graph,
        nodePositions: graph.nodePositions.map((prevNodePosition) => {
          if (prevNodePosition.nodeId === node.id) return nextNodePosition;
          return prevNodePosition;
        }),
      },
    });

    RequestMethods.nodePositionPatch({
      param: [graph.id, nextNodePosition.nodeId],
      token: get().token,
      body: {
        x: nextNodePosition.x,
        y: nextNodePosition.y,
      },
    });
  },
  updateTitle: (title) => {
    const graph = get().graph;

    set({
      graph: {
        ...graph,
        title,
      },
    });

    RequestMethods.graphPatch({
      param: graph.id,
      token: get().token,
      body: {
        title,
      },
    });
  },
});

const createReactFlowSlice: StateCreator<CombinedStoreType, [], [], ReactFlowSlice> = (
  set,
  get
) => ({
  defaultPosition: { x: 350, y: 350 },
  nodes: [],
  edges: [],
  setNodes: (nodes) => {
    set({
      nodes: nodes,
    });
  },
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  setEdges: (edges) => {
    set({
      edges: edges,
    });
  },
  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
});

export const useCombinedStore = create<CombinedStoreType>()(
  subscribeWithSelector((...args) => ({
    ...createUserSlice(...args),
    ...createGraphSlice(...args),
    ...createReactFlowSlice(...args),
  }))
);

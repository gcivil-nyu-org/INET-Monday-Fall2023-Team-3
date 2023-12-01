import { BackendModels } from "src/utils/models";

export interface GraphSlice {
  graph: BackendModels.IGraph;
  setGraph: (graph: Partial<BackendModels.IGraph>) => void;
  predefinedNodeMap: Record<string, BackendModels.INode>;
  fetchPredefinedNodes: () => Promise<void>;
}

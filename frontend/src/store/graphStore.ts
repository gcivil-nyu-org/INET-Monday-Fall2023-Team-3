import { Node } from "reactflow";
import { BackendModels } from "src/utils/models";
import { Requests } from "src/utils/requests";

export interface GraphSlice {
  graph: BackendModels.IGraph;
  setGraph: (graph: Partial<BackendModels.IGraph>) => void;
  predefinedNodeMap: Record<string, BackendModels.INode>;
  fetchPredefinedNodes: () => Promise<void>;
  addNode: (node: BackendModels.INode) => void;
  editNode: (nodeId: string, node: Requests.Node.Patch) => void;
  deleteNodes: (node: BackendModels.INode[]) => void;
  addEdge: (edge: BackendModels.IEdge) => void;
  deleteEdges: (edge: BackendModels.IEdge[]) => void;
  updateNodePosition: (node: Node<BackendModels.INode>) => void;
  updateTitle: (title: string) => void;
}

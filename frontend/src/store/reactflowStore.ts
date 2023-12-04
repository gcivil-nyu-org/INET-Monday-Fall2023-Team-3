import {
  Edge,
  IsValidConnection,
  Node,
  OnConnect,
  OnEdgesChange,
  OnEdgesDelete,
  OnNodesChange,
  OnNodesDelete,
  XYPosition,
} from "reactflow";
import { BackendModels } from "src/utils/models";

export type ReactFlowSlice = {
  defaultPosition: XYPosition;
  nodes: Node<BackendModels.INode>[];
  edges: Edge[];
  setNodes: (nodes: Node<BackendModels.INode>[]) => void;
  setEdges: (edge: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
};

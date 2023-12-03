import { Add, DoneAll, Elderly, KeyboardReturn, Share } from "@mui/icons-material";
import { Alert, Button, Dialog, Snackbar, TextField, Tooltip } from "@mui/material";
import { ChangeEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactFlow, {
  Background,
  Connection,
  Controls,
  Edge,
  MarkerType,
  Node,
  Panel,
  addEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useEdgesState,
  useNodesState,
} from "reactflow";
import AddNode from "src/components/node/AddNode";
import SmoothNode from "src/components/node/SmoothNode";
import GraphSharing from "src/components/sharing/GraphShare";
import { useCombinedStore } from "src/store/combinedStore";
import { BackendModels } from "src/utils/models";
import { RequestMethods } from "src/utils/utils";
import { useShallow } from "zustand/react/shallow";
import "reactflow/dist/style.css";
import { Requests } from "src/utils/requests";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import EditNode from "src/components/node/EditNode";
import FaultyDependency, { IFaultyDependency } from "src/components/node/FaultyDependency";

const nodeTypes = {
  smoothNode: SmoothNode,
};

export default function Graph() {
  const navigate = useNavigate();
  const {
    user,
    token,
    predefinedNodeMap,
    graph,
    nodes,
    setNodes,
    edges,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    editNode,
    addEdge,
    deleteNodes,
    deleteEdges,
    updateNodePosition,
    udpateTitle,
  } = useCombinedStore((state) => ({
    user: state.user,
    token: state.token,
    predefinedNodeMap: state.predefinedNodeMap,
    graph: state.graph,
    nodes: state.nodes,
    setNodes: state.setNodes,
    onNodesChange: state.onNodesChange,
    edges: state.edges,
    setEdges: state.setEdges,
    onEdgesChange: state.onEdgesChange,
    onConnect: state.onConnect,
    addNode: state.addNode,
    editNode: state.editNode,
    deleteNodes: state.deleteNodes,
    addEdge: state.addEdge,
    deleteEdges: state.deleteEdges,
    updateNodePosition: state.updateNodePosition,
    udpateTitle: state.updateTitle,
  }));
  const disabled = user.email == graph.createdBy ? false : true;


  const [currNode, setCurrNode] = useState<Node<BackendModels.INode> | undefined>(undefined);

  useEffect(() => {
    setNodes(
      graph.nodes.map((node) => ({
        id: node.id,
        position: graph.nodePositions.find((nodePosition) => nodePosition.nodeId === node.id)!,
        type: "smoothNode",
        data: node,
      }))
    );

    setEdges(
      graph.edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        style: {
          strokeWidth: 3,
        },
        markerEnd: {
          type: MarkerType.Arrow,
        },
      }))
    );
  }, []);

  const onNodeAdd = async (node: Requests.Node.Create) => {
    const addNodeResult = await RequestMethods.nodeCreate({
      token: token,
      body: node,
    });

    if (addNodeResult.status) {
      addNode(addNodeResult.value);
      setShowAddNode(false);
    } else {
      onError(addNodeResult.detail);
    }
  };

  const onNodeEdit = async (id: string, node: Requests.Node.Patch) => {
    const patchNodeResult = await RequestMethods.nodePatch({
      param: id,
      token: token,
      body: node,
    });

    if (patchNodeResult.status) {
      editNode(id, node);
      setShowEditNode(false);
    } else {
      onError(patchNodeResult.detail);
    }
  };

  const onNodesDelete = async (deleted: Node<BackendModels.INode>[]) => {
    deleteNodes(deleted.map((deletedNode) => deletedNode.data));
  };

  const onNodeDragStop = async (_event: React.MouseEvent, node: Node<BackendModels.INode>) => {
    updateNodePosition(node);
  };

  const onEdgeAdd = async (connection: Connection) => {
    const addEdgeResult = await RequestMethods.edgeCreate({
      token: token,
      body: {
        source: connection.source!,
        target: connection.target!,
      },
    });

    if (addEdgeResult.status) {
      addEdge(addEdgeResult.value);
      onConnect(connection);
    } else {
      onError(addEdgeResult.detail);
    }
  };

  const onEdgesDelete = async (deleted: Edge[]) => {
    deleteEdges(deleted);
  };

  const [title, setTitle] = useState(graph.title);

  const onTitleInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onTitleChangeSubmit = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      udpateTitle(title.trim());
    }
  };

  const [showAddNode, setShowAddNode] = useState(false);

  const onAddNodeButtonClicked = () => {
    console.log("add node button clicked");
    setShowAddNode(true);
  };

  const [showEditNode, setShowEditNode] = useState(false);

  const onNodeClick = (_event: React.MouseEvent, node: Node<BackendModels.INode>) => {
    console.log("node clicked");
    setCurrNode(node);
  };

  const onNodeDoubleClick = (_event: React.MouseEvent, node: Node<BackendModels.INode>) => {
    console.log("node double clicked");
    setCurrNode(node);
    onEditNode();
  };

  const onEditNode = () => {
    setShowEditNode(true);
  };

  const onShareButtonClicked = () => {
    console.log("share button clicked");
  };

  const [faultyDependencies, setFaultyDependencies] = useState<IFaultyDependency[]>([]);
  const [showFaultyDependency, setShowFaultyDependency] = useState(false);

  const verifyDependencies = () => {
    const nodes = graph.nodes.filter((node) => node.predefined);
    const tempFaultyDependencies: IFaultyDependency[] = [];

    for (const node of nodes) {
      for (const dependency of node.dependencies) {
        if (!nodes.some((node) => node.id === dependency)) {
          tempFaultyDependencies.push({
            reason: "missing",
            cause: "node",
            sourceName: predefinedNodeMap[dependency]?.name ?? "[UNKNOWN NODE]",
            targetName: node.name,
          });
          continue;
        }

        const reversedEdge = graph.edges.find(
          (edge) => edge.source === node.id && edge.target === dependency
        );

        if (reversedEdge !== undefined) {
          tempFaultyDependencies.push({
            reason: "wrong",
            cause: "edge",
            sourceName: predefinedNodeMap[dependency]?.name ?? "[UNKNOWN NODE]",
            targetName: node.name,
          });
          continue;
        }

        const correctEdge = graph.edges.find(
          (edge) => edge.target === node.id && edge.source === node.id
        );

        if (correctEdge === undefined) {
          tempFaultyDependencies.push({
            reason: "missing",
            cause: "edge",
            sourceName: predefinedNodeMap[dependency]?.name ?? "[UNKNOWN NODE]",
            targetName: node.name,
          });
          continue;
        }
      }
    }

    return tempFaultyDependencies;
  };

  const onVerifyButtonClicked = () => {
    console.log("verify button clicked");
    const tempFaultyDependencies = verifyDependencies();

    setFaultyDependencies(tempFaultyDependencies);

    if (tempFaultyDependencies.length > 0) {
      setShowFaultyDependency(true);
    } else {
      onSuccess("all dependencies good");
    }
  };

  const onReturnButtonClicked = () => {
    console.log("on return button clicked");
    navigate("/user");
  };

  const onCancelDialog = () => {
    setShowAddNode(false);
    setShowEditNode(false);
    setShowFaultyDependency(false);
  };

  const onSuccess = (message: string) => {
    enqueueSnackbar(message, { variant: "success" });
  };

  const onError = (message: string) => {
    enqueueSnackbar(message, { variant: "error" });
  };

  return (
    <div className="w-full flex flex-row min-h-screen min-w-full overflow-hidden">
      <SnackbarProvider />
      <Dialog open={showAddNode} onClose={onCancelDialog} maxWidth="md" fullWidth>
        <AddNode onSubmit={onNodeAdd} onError={onError} />
      </Dialog>
      <Dialog open={showEditNode} onClose={onCancelDialog} maxWidth="md" fullWidth>
        <EditNode onSubmit={onNodeEdit} onError={onError} node={currNode?.data} />
      </Dialog>
      <Dialog open={showFaultyDependency} onClose={onCancelDialog} maxWidth="md" fullWidth>
        <FaultyDependency faultyDependencies={faultyDependencies}></FaultyDependency>
      </Dialog>
      <div className="flex self-stretch basis-3/4 overflow-hidden">
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onEdgeAdd}
          onEdgesDelete={onEdgesDelete}
          onPaneClick={() => setCurrNode(undefined)}
          edgesUpdatable={!disabled}
          edgesFocusable={!disabled}
          nodesDraggable={!disabled}
          nodesConnectable={!disabled}
          nodesFocusable={!disabled}
          draggable={!disabled}
          panOnDrag={!disabled}
          elementsSelectable={!disabled}
        >
          <Panel className="bg-transparent" position="top-center">
            <TextField
              value={title}
              onChange={onTitleInputChanged}
              onKeyDown={onTitleChangeSubmit}
            ></TextField>
          </Panel>
          <Panel className="bg-transparent" position="top-left">
            <div className="flex flex-col space-y-2">
              {!disabled && (
                <Tooltip title="Add Node" placement="right" arrow>
                  <Button
                    variant="outlined"
                    sx={{ padding: "8px", minWidth: "32px" }}
                    onClick={onAddNodeButtonClicked}
                  >
                    <Add />
                  </Button>
                </Tooltip>
              )}
              {!disabled && (
                <Tooltip title="Share" placement="right" arrow>
                  <Button
                    variant="outlined"
                    sx={{ padding: "8px", minWidth: "32px" }}
                    onClick={onShareButtonClicked}
                  >
                    <Share />
                  </Button>
                </Tooltip>
              )}
              {!disabled && (
                <Tooltip title="Verify Dependencies" placement="right" arrow>
                  <Button
                    variant="outlined"
                    sx={{ padding: "8px", minWidth: "32px" }}
                    onClick={onVerifyButtonClicked}
                  >
                    <DoneAll />
                  </Button>
                </Tooltip>
              )}
              <Tooltip title="Return" placement="right" arrow>
                <Button
                  variant="outlined"
                  sx={{ padding: "8px", minWidth: "32px" }}
                  onClick={onReturnButtonClicked}
                >
                  <KeyboardReturn />
                </Button>
              </Tooltip>
            </div>
          </Panel>
          <Controls />
          <Background color="#aaa" gap={16} />
        </ReactFlow>
      </div>
    </div>
  );
}

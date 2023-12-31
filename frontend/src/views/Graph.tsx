import { Add, DoneAll, Elderly, KeyboardReturn, Share } from "@mui/icons-material";
import { Alert, Button, Dialog, Snackbar, TextField, Tooltip } from "@mui/material";
import {
  ChangeEvent,
  KeyboardEvent,
  FocusEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
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
import Comments from "components/comment/Comments";
import GraphComments from "components/comment/GraphComments";
import NodeComments from "src/components/comment/NodeComments";
import usePusher from "src/components/pusher/usePusher";

const nodeTypes = {
  smoothNode: SmoothNode,
};

export default function Graph() {
  const navigate = useNavigate();
  const {
    user,
    setUser,
    token,
    predefinedNodeMap,
    fetchPredefinedNodes,
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
    setUser: state.setUser,
    token: state.token,
    predefinedNodeMap: state.predefinedNodeMap,
    fetchPredefinedNodes: state.fetchPredefinedNodes,
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
  const [clickNode, setClickNode] = useState<Node<BackendModels.INode> | undefined>(undefined);
  const [showNodeDiscussion, setShowNodeDiscussion] = useState(false);
  const [showGraphShare, setShowGraphShare] = useState(false);

  useEffect(() => {
    setNodes(
      graph.nodes.map((node) => ({
        id: node.id,
        position: graph.nodePositions.find((nodePosition) => nodePosition.nodeId === node.id)!,
        type: "smoothNode",
        data: node,
        className: "nopan",
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

    fetchPredefinedNodes();
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

  const autoDependencyGeneration = async (node: BackendModels.INode) => {
    const onCanvasPredefinedNodes = graph.nodes.filter((node) => node.predefined);
    const onCanvasPredefinedNodeIds = onCanvasPredefinedNodes.map((node) => node.id);
    const dependencies = node.dependencies;
    for (let i = 0; i < dependencies.length; i++) {
      const dependency = dependencies[i];
      // first, we check if newly added node's prerequisite is already on the canvas
      // if so, we create an edge between the two nodes
      if (onCanvasPredefinedNodeIds.includes(dependencies[i])) {
        const addEdgeResult = await RequestMethods.edgeCreate({
          token: token,
          body: {
            source: dependency,
            target: node.id,
          },
        });

        if (addEdgeResult.status) {
          addEdge(addEdgeResult.value);
        } else {
          onError(addEdgeResult.detail);
        }
      }
    }
    // Then, we check whether the newly added node is a prerequisite for any other nodes
    // If so, we create an edge between the two nodes
    for (let i = 0; i < onCanvasPredefinedNodes.length; i++) {
      const curNode = onCanvasPredefinedNodes[i];
      if (curNode.dependencies.includes(node.id)) {
        const addEdgeResult = await RequestMethods.edgeCreate({
          token: token,
          body: {
            source: node.id,
            target: curNode.id,
          },
        });

        if (addEdgeResult.status) {
          addEdge(addEdgeResult.value);
        } else {
          onError(addEdgeResult.detail);
        }
      }
    }
  };

  const onNodeAddPredefined = async (id: string) => {
    addNode(predefinedNodeMap[id]);
    autoDependencyGeneration(predefinedNodeMap[id]);
    setShowAddNode(false);
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
    const isClickNodeDeleted = deleted.some((node) => node.id === clickNode?.id);
    if (isClickNodeDeleted) {
      setClickNode(undefined);
      setShowNodeDiscussion(false);
    }
    deleteNodes(deleted.map((deletedNode) => deletedNode.data));
  };

  const onNodeDragStop = async (_event: React.MouseEvent, node: Node<BackendModels.INode>) => {
    updateNodePosition(node);
  };

  const onEdgeAdd = async (connection: Connection) => {
    if (disabled) {
      return undefined;
    }

    // check cycle
    // check cycle : check incomers of source
    const srcNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);
    if (srcNode == null) {
      console.error("source node not found");
      return undefined;
    }
    if (targetNode == null) {
      console.error("target node not found");
      return undefined;
    }

    const hasCycle = async ({
      source,
      target,
    }: {
      source: Node;
      target: Node;
    }): Promise<boolean> => {
      const stack = [source];

      while (stack.length > 0) {
        const currentNode = stack.pop();
        // If the current node is the target, we have a cycle.
        if (!currentNode) {
          continue;
        }
        if (currentNode === target) {
          return true;
        }

        const incomers = await getIncomers(currentNode, nodes, edges);
        // Add all incomers to the stack for further processing
        for (let incomer of incomers) {
          stack.push(incomer);
        }
      }

      // If we exhaust all nodes without finding the target, there's no cycle
      return false;
    };

    const cycleDetected = await hasCycle({
      source: srcNode,
      target: targetNode,
    });

    if (cycleDetected) {
      // issue error
      onError("There is a cycle detected");
      return undefined;
    }

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

  const onTitleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      udpateTitle(title.trim());
    }
  };

  const onTitleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (event.type === "blur") {
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
    //if (node.data.predefined === false) {
    //  console.log("Comments are only available for NYU courses.");
    //  return;
    //}
    const clearNodeSec = async () => {
      setShowNodeDiscussion(false);
      setClickNode(undefined);
      setCurrNode(undefined);
    };

    clearNodeSec().then((result) => {
      setShowNodeDiscussion(true);
      setClickNode(node);
      setCurrNode(node);
    });

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
    setShowGraphShare(true);
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
            sourceName: node.name,
            targetName: predefinedNodeMap[dependency]?.name ?? "[UNKNOWN NODE]",
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
          (edge) => edge.target === node.id && edge.source === dependency
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
    setShowGraphShare(false);
  };

  const onSuccess = (message: string) => {
    enqueueSnackbar(message, { variant: "success" });
  };

  const onError = (message: string) => {
    enqueueSnackbar(message, { variant: "error" });
  };

  // Subscribe to Pusher channel and events
  usePusher("graph-channel", "new-graph-share", async () => {
    console.log("usePusher");
    const resp = await RequestMethods.userGetSelf({
      token,
    });
    if (resp.status) {
      setUser({ sharedGraphs: resp.value.sharedGraphs });
    }
  });

  // Subscribe to Pusher channel and events
  usePusher("graph-channel", "graph-delete", async () => {
    console.log("usePusher");
    const resp = await RequestMethods.userGetSelf({
      token,
    });
    if (resp.status) {
      setUser({ sharedGraphs: resp.value.sharedGraphs });
    }
  });

  return (
    <div className="w-full flex flex-row min-h-screen min-w-full overflow-hidden">
      <SnackbarProvider />
      <Dialog open={showAddNode} onClose={onCancelDialog} maxWidth="md" fullWidth>
        <AddNode
          onSubmit={onNodeAdd}
          onError={onError}
          onSubmitPredefinedNode={onNodeAddPredefined}
        />
      </Dialog>
      <Dialog open={showEditNode} onClose={onCancelDialog} maxWidth="md" fullWidth>
        <EditNode onSubmit={onNodeEdit} onError={onError} node={currNode?.data} />
      </Dialog>
      <Dialog open={showFaultyDependency} onClose={onCancelDialog} maxWidth="md" fullWidth>
        <FaultyDependency faultyDependencies={faultyDependencies}></FaultyDependency>
      </Dialog>
      <Dialog open={showGraphShare} onClose={onCancelDialog} maxWidth="sm" fullWidth={true}>
        <GraphSharing onClose={onCancelDialog} />
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
          onPaneClick={() => {
            setCurrNode(undefined);
            setClickNode(undefined);
            setShowNodeDiscussion(false);
          }}
          edgesUpdatable={!disabled}
          edgesFocusable={!disabled}
          nodesDraggable={!disabled}
          nodesConnectable={!disabled}
          nodesFocusable={!disabled}
          //draggable={!disabled}
          draggable={false}
          panOnDrag={!disabled}
          elementsSelectable={!disabled}
        >
          <Panel className="bg-transparent" position="top-center">
            {disabled ? (
              <div className="text-2xl text-center font-sans text-olive">{title}</div>
            ) : (
              <TextField
                value={title}
                onChange={onTitleInputChanged}
                onKeyDown={onTitleKeyDown}
                onBlur={onTitleBlur}
              />
            )}
            {/* user who does not own the graph should not be able to change the title */}
          </Panel>
          <Panel className="bg-transparent" position="top-left">
            <div className="flex flex-col space-y-2">
              {!disabled && (
                <Tooltip title="Add Node" placement="right" arrow>
                  <Button
                    className="bg-orange border-none"
                    variant="outlined"
                    sx={{ padding: "8px", minWidth: "32px" }}
                    onClick={onAddNodeButtonClicked}
                  >
                    <Add className="text-olive" />
                  </Button>
                </Tooltip>
              )}
              {!disabled && (
                <Tooltip title="Share" placement="right" arrow>
                  <Button
                    className="bg-pink border-none"
                    variant="outlined"
                    sx={{ padding: "8px", minWidth: "32px" }}
                    onClick={onShareButtonClicked}
                  >
                    <Share className="text-olive" />
                  </Button>
                </Tooltip>
              )}
              {!disabled && (
                <Tooltip title="Verify Dependencies" placement="right" arrow>
                  <Button
                    className="bg-yellow border-none"
                    variant="outlined"
                    sx={{ padding: "8px", minWidth: "32px" }}
                    onClick={onVerifyButtonClicked}
                  >
                    <DoneAll className="text-olive" />
                  </Button>
                </Tooltip>
              )}
              <Tooltip title="Return" placement="right" arrow>
                <Button
                  className="bg-blue border-none"
                  variant="outlined"
                  sx={{ padding: "8px", minWidth: "32px" }}
                  onClick={onReturnButtonClicked}
                >
                  <KeyboardReturn className="text-olive" />
                </Button>
              </Tooltip>
            </div>
          </Panel>
          <Controls showInteractive={!disabled} />
          <Background className="bg-beige" gap={16} />
        </ReactFlow>
      </div>
      <div className="flex max-h-screen h-full bg-beige basis-1/4 p-5">
        <div className="w-full bg-green bg-opacity-60 rounded-xl overflow-hidden">
          {currNode && currNode.data.predefined ? (
            <NodeComments node={currNode} />
          ) : (
            <GraphComments />
          )}
        </div>
      </div>
    </div>
  );
}

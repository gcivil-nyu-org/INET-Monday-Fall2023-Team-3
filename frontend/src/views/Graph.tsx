import React, { useState, useMemo, useCallback } from "react";
import ReactFlow, {
  useNodesState,
  Controls,
  Panel,
  Node,
  Connection,
  useEdgesState,
  addEdge,
  getConnectedEdges,
  getOutgoers,
} from "reactflow";
import { Alert, Button, Dialog, DialogTitle, Snackbar } from "@mui/material";
import { Add, Share, DoneAll } from "@mui/icons-material";

import { IEdge, INode } from "utils/models";
import "reactflow/dist/style.css";
import AddNode from "components/node/AddNode";
import EditNode from "components/node/EditNode";
import SmoothNode from "components/node/SmoothNode";
import { edgeCreate, edgeDelete, nodeDelete, nodeUpdate } from "utils/backendRequests";

export default function Graph() {
  const nodeTypes = useMemo(() => ({ smoothNode: SmoothNode }), []);
  const [showAddNode, setShowAddNode] = useState(false);
  const [showEditNode, setShowEditNode] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [currNode, setCurrNode] = useState<INode>();
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<IEdge>([]);

  const onAddButtonClicked = () => {
    console.log("add button clicked");

    setShowAddNode(true);
    setShowEditNode(false);
  };

  const onShareButtonClicked = () => {
    console.log("share button clicked");
  };

  const onDoneButtonClicked = () => {
    console.log("done button clicked");
  };

  const onEditNodeClicked = () => {
    console.log("edit node clicked");

    setShowAddNode(false);
    setShowEditNode(true);
  };

  const onNodeDoubleClick = (event: React.MouseEvent, node: Node<INode>) => {
    setCurrNode(node.data);
    onEditNodeClicked();
  };

  const closeAllNodePanels = () => {
    setShowAddNode(false);
    setShowEditNode(false);
  };

  const onCancel = () => {
    closeAllNodePanels();
  };

  const onNodeSubmit = useCallback(
    (submittedNode: INode) => {
      closeAllNodePanels();

      // update nodes accordingly
      setNodes((nodes) => {
        const node = nodes.find((node) => node.id === submittedNode.id);

        // new node
        if (node === undefined) {
          return nodes.concat({
            id: submittedNode.id,
            type: "smoothNode",
            position: { x: 0, y: 0 },
            data: submittedNode,
          });
        }

        // existing ndoe
        node.data = submittedNode;
        return nodes;
      });
    },
    [setNodes]
  );

  const onEdgeConnect = useCallback(
    async ({ source, target }: Connection) => {
      if (source == null) {
        console.error("source of edge is null");
        return;
      }
      if (target == null) {
        console.error("target of edge is null");
        return;
      }

      console.log(`create new edge between ${source} and ${target}`);

      const result = await edgeCreate({ source, target }, sessionStorage.getItem("token")!);
      if (result.status) {
        console.log(`created edge with id ${result.value.id}`);

        setEdges((edges) =>
          addEdge(
            {
              id: result.value.id,
              source: result.value.source,
              target: result.value.target,
            },
            edges
          )
        );
      } else {
        onError(result.error);
      }
    },
    [setEdges]
  );

  const onNodesDelete = useCallback(
    async (deleted: Node[]) => {
      // no need to update edges because we use foreign keys
      // in backend, therefore deleting node will delete
      // corresponding edges as well

      // get all attached edges
      const invalidEdges = deleted.flatMap((node) => getConnectedEdges([node], edges));
      // update edges
      setEdges((edges) => {
        return edges.filter((edge) => !invalidEdges.includes(edge));
      });

      const nodeUpdatePromises = deleted.map(async (node) => {
        // get all nodes that depend on current node
        const outgoers = getOutgoers(node, nodes, edges);
        // update dependencies of these nodes
        const dependencyUpdatePromises = outgoers.map((targetNode) =>
          nodeUpdate(
            {
              ...targetNode.data,
              // remove dependency of current node
              dependencies: targetNode.data.dependencies.filter(
                (parentNodeId) => parentNodeId !== node.id
              ),
            },
            sessionStorage.getItem("token")!
          )
        );
        await Promise.all(dependencyUpdatePromises).then(() =>
          // remove current node after success
          nodeDelete(node.id, sessionStorage.getItem("token")!)
        );
      });
      await Promise.all(nodeUpdatePromises).catch(onError);
    },
    [nodes, edges, setEdges]
  );

  const onError = (err: string) => {
    setErrorMessage(err);
    setShowError(true);
  };

  const onSnackBarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== "clickaway") {
      setShowError(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-row min-h-screen">
      <div className="flex self-stretch basis-3/4">
        <Snackbar open={showError} autoHideDuration={6000} onClose={onSnackBarClose}>
          <Alert severity="error">{errorMessage}</Alert>
        </Snackbar>
        <Dialog open={showAddNode} onClose={onCancel} maxWidth="md" fullWidth={true}>
          <DialogTitle>Add Node</DialogTitle>
          <AddNode onSubmit={onNodeSubmit} onError={onError} />
        </Dialog>
        <Dialog open={showEditNode} onClose={onCancel} maxWidth="md" fullWidth={true}>
          <DialogTitle>Edit Node</DialogTitle>
          <EditNode node={currNode!} onSubmit={onNodeSubmit} onError={onError} />
        </Dialog>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}
          onNodeDoubleClick={onNodeDoubleClick}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onEdgeConnect}
        >
          <Panel className="bg-transparent" position="top-left">
            <div className="flex flex-col space-y-2">
              <Button
                variant="outlined"
                sx={{ padding: "8px", minWidth: "32px" }}
                onClick={onAddButtonClicked}
              >
                <Add />
              </Button>
              <Button
                variant="outlined"
                sx={{ padding: "8px", minWidth: "32px" }}
                onClick={onShareButtonClicked}
              >
                <Share />
              </Button>
              <Button
                variant="outlined"
                sx={{ padding: "8px", minWidth: "32px" }}
                onClick={onDoneButtonClicked}
              >
                <DoneAll />
              </Button>
            </div>
          </Panel>
          <Controls />
        </ReactFlow>
      </div>
      <div className="flex self-stretch flex-1 basis-1/4 bg-slate-500"></div>
    </div>
  );
}

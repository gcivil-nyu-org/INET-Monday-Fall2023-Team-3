import React, { useState, useMemo, useCallback, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  Controls,
  Panel,
  Node,
  Connection,
  useEdgesState,
  addEdge,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
} from "reactflow";
import { Alert, Button, Dialog, DialogTitle, Snackbar } from "@mui/material";
import { Add, Share, DoneAll, Storage } from "@mui/icons-material";

import { IEdge, INode } from "utils/models";
import "reactflow/dist/style.css";
import AddNode from "components/node/AddNode";
import AddPredefinedNode from "components/node/AddPredefinedNode";
import EditNode from "components/node/EditNode";
import SmoothNode from "components/node/SmoothNode";
import {
  edgeCreate,
  edgeDelete,
  nodeDelete,
  nodeUpdate,
  nodeGetPredefined,
  graphUpdateAdd,
  graphUpdateDelete,
} from "utils/backendRequests";

export default function Graph() {
  const nodeTypes = useMemo(() => ({ smoothNode: SmoothNode }), []);
  const [showAddNode, setShowAddNode] = useState(false);
  const [showEditNode, setShowEditNode] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [predefinedNodes, setPredefinedNodes] = useState<INode[]>([]);
  const [onCanvasNodeIds, setOnCanvasNodeIds] = useState<string[]>([]); // only record ids for predefined nodes
  const [currNode, setCurrNode] = useState<INode>();
  const [nodes, setNodes, onNodesChange] = useNodesState<INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<IEdge>([]);

  useEffect(() => {
    async function fetchPredefinedNodes() {
      const response = await nodeGetPredefined(sessionStorage.getItem("token")!);
      if (response.status) {
        const nodesArray = Object.values(response.value);
        // Sort the array based on the 'name' property
        const sortedNodes = nodesArray.sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        });
        setPredefinedNodes(sortedNodes);
      } else {
        console.error("Error fetching predefined nodes:", response.error);
      }
    }
    fetchPredefinedNodes();
  }, []);

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
          if (submittedNode.predefined) {
            setOnCanvasNodeIds((prevIds) => [...prevIds, submittedNode.id]);
          }
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
      // check cycle : check incomers of source
      const srcNode = nodes.find((n) => n.id === source);
      const targetNode = nodes.find((n) => n.id === target);
      if (srcNode == null) {
        console.error("source node not found");
        return;
      }
      if (targetNode == null) {
        console.error("target node not found");
        return;
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
        return;
      }

      console.log(`create new edge between ${source} and ${target}`);

      const result = await edgeCreate({ source, target }, sessionStorage.getItem("token")!);
      if (result.status) {
        console.log(`created edge with id ${result.value.id}`);

        // add edge to graph
        graphUpdateAdd(
          { id: sessionStorage.getItem("graphId")!, edges: [result.value] },
          sessionStorage.getItem("token")!
        ).then((graphResult) => {
          if (graphResult.status) {
            console.log("edge added to graph");
          } else {
            console.log("Cannot add edge to graph");
          }
        });

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
        // set dependencies if not predefined
        setNodes((currentNodes) => {
          return currentNodes.map((node) => {
            if (node.id === target && node.data.predefined === false) {
              return {
                ...node,
                data: {
                  ...node.data,
                  dependencies: [...node.data.dependencies, source],
                },
              };
            }
            return node;
          });
        });
        // After the state is set, find the target node again and update the database.
        const updatedTargetNode = nodes.find((node) => node.id === target);
        if (updatedTargetNode && updatedTargetNode.data.predefined === false) {
          nodeUpdate(
            {
              ...updatedTargetNode.data,
              dependencies: [...updatedTargetNode.data.dependencies, source],
            },
            sessionStorage.getItem("token")!
          );
        }
      } else {
        onError(result.error);
      }
    },
    [nodes, edges, setEdges, setNodes]
  );

  const onNodesDelete = useCallback(
    async (deleted: Node[]) => {
      // no need to update edges because we use foreign keys
      // in backend, therefore deleting node will delete
      // corresponding edges as well

      // delete from onCanvasNodeIds
      setOnCanvasNodeIds((currentIds) =>
        currentIds.filter((id) => !deleted.some((node) => node.id === id))
      );

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
        const dependencyUpdatePromises = outgoers.map(async (targetNode) => {
          const newDependencies = targetNode.data.dependencies.filter(
            (parentNodeId) => parentNodeId !== node.id
          );
          nodeUpdate(
            {
              ...targetNode.data,
              // remove dependency of current node
              dependencies: newDependencies,
            },
            sessionStorage.getItem("token")!
          );
          setNodes((currentNodes) =>
            currentNodes.map((node) => {
              return node.id === targetNode.id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      dependencies: newDependencies,
                    },
                  }
                : node;
            })
          );
        });
        await Promise.all(dependencyUpdatePromises).then(() => {
          // remove current node after success
          if (node.data.predefined === false) {
            // do not delete predefined data
            nodeDelete(node.id, sessionStorage.getItem("token")!);
            const INodeSendToBackend = {  // Define a new INode to send to backend, only id matters
              id: node.id, name: "whatever", predefined: false, description: "whatever", dependencies: []};
            graphUpdateDelete(
              { id: sessionStorage.getItem("graphId")!, nodes: [INodeSendToBackend] },
              sessionStorage.getItem("token")!
            ).then((result) => {
              if (result.status) {
                console.log("Node deleted from graph");
              } else {
                console.log("Cannot delete node from graph");
              }
            });
          }
        });
      });
      await Promise.all(nodeUpdatePromises).catch(onError);
    },
    [nodes, edges, setEdges, setNodes]
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
          <AddNode
            predefinedNodes={predefinedNodes}
            onCanvasNodeIds={onCanvasNodeIds}
            onSubmit={onNodeSubmit}
            onError={onError}
          />
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
      <div className="flex self-stretch flex-1 basis-1/4 bg-slate-500">
        {/* add comment page */}
      </div>
    </div>
  );
}

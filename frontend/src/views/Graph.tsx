import { Add, DoneAll, Elderly, KeyboardReturn, Share } from "@mui/icons-material";
import { Alert, Button, Dialog, Snackbar, TextField, Tooltip } from "@mui/material";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
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

type FaultyDependency = {
  reason: "missing" | "wrong";
  cause: "node" | "edge";
  sourceName: string;
  targetName: string;
};

const nodeTypes = {
  smoothNode: SmoothNode,
};

export default function Graph() {
  const navigate = useNavigate();
  const { token, graph, setGraph, predefinedNodeMap, fetchPredefinedNodes } = useCombinedStore(
    useShallow((state) => ({
      token: state.token,
      graph: state.graph,
      setGraph: state.setGraph,
      predefinedNodeMap: state.predefinedNodeMap,
      fetchPredefinedNodes: state.fetchPredefinedNodes,
    }))
  );

  const [showState, setShowState] = useState({
    addNode: false,
    editNode: false,
    faultyDependency: false,
    graphShare: false,
  });

  const [infoState, setInfoState] = useState({
    show: false,
    message: "",
  });
  const [successState, setSuccessState] = useState({
    show: false,
    message: "",
  });
  const [errorState, setErrorState] = useState({
    show: false,
    message: "",
  });

  const [title, setTitle] = useState("");

  const [faultyDependencies, setFaultyDependencies] = useState<FaultyDependency[]>([]);

  const [currNode, setCurrNode] = useState<BackendModels.INode | undefined>(undefined);

  const [nodes, setNodes, onNodesChange] = useNodesState<BackendModels.INode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<BackendModels.IEdge>([]);

  useEffect(() => {
    fetchPredefinedNodes().then(() => {
      console.log(graph);
      setTitle(graph.title);

      const mappedNodes = graph.nodes.map((node) => {
        const currNodePosition = graph.nodePositions.find(
          (nodePostion) => nodePostion.nodeId === node.id
        )!;
        return {
          id: node.id,
          type: "smoothNode",
          position: { x: currNodePosition.x, y: currNodePosition.y },
          data: node,
        };
      });

      setNodes((nodes) => nodes.concat(...mappedNodes));

      for (const edge of graph.edges) {
        setEdges((edges) =>
          addEdge(
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
            edges
          )
        );
      }
    });
  }, [setNodes, setEdges]);

  const closeAllPanels = () => {
    setShowState({
      addNode: false,
      editNode: false,
      faultyDependency: false,
      graphShare: false,
    });
  };

  const onSnackBarClose = (_event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason !== "clickaway") {
      setErrorState({ show: false, message: "" });
      setInfoState({ show: false, message: "" });
      setSuccessState({ show: false, message: "" });
    }
  };

  const onAddNodeButtonClicked = () => {
    console.log("add node button clicked");
    setShowState({
      addNode: true,
      editNode: false,
      faultyDependency: false,
      graphShare: false,
    });
  };

  const onDoneButtonClicked = () => {
    const usedPredefinedNodes = graph.nodes.filter(
      (node) => predefinedNodeMap[node.id] !== undefined
    );
    const tempFaultyDependencies: FaultyDependency[] = [];

    for (const usedPredefinedNode of usedPredefinedNodes) {
      const nodeDependencies = usedPredefinedNode.dependencies;
      for (const dependencyId of nodeDependencies) {
        if (!nodes.some((node) => node.id === dependencyId)) {
          // missing node
          tempFaultyDependencies.push({
            reason: "missing",
            cause: "node",
            sourceName: predefinedNodeMap[dependencyId]?.name,
            targetName: usedPredefinedNode.name,
          });
        } else if (
          !edges.some(
            (edge) => edge.source === dependencyId && edge.target === usedPredefinedNode.id
          )
        ) {
          // missing edge
          tempFaultyDependencies.push({
            reason: "missing",
            cause: "edge",
            sourceName: predefinedNodeMap[dependencyId]?.name,
            targetName: usedPredefinedNode.name,
          });
        } else if (
          edges.some(
            (edge) => edge.source === usedPredefinedNode.id && edge.target === dependencyId
          )
        ) {
          // wrong edge direction
          tempFaultyDependencies.push({
            reason: "wrong",
            cause: "edge",
            sourceName: predefinedNodeMap[dependencyId]?.name,
            targetName: usedPredefinedNode.name,
          });
        }
      }
    }

    if (tempFaultyDependencies.length == 0) {
      setSuccessState({
        show: true,
        message: "all dependencies correct",
      });
      return;
    }

    setFaultyDependencies(tempFaultyDependencies);
    setShowState({
      addNode: false,
      editNode: false,
      faultyDependency: true,
      graphShare: false,
    });
  };

  const onReturnButtonClicked = () => navigate("/user");

  const onNodeClick = (_event: React.MouseEvent, node: Node<BackendModels.INode>) => {
    console.log(`node ${node.data.name} clicked`);
    setCurrNode(node.data);
  };

  const onNodeDoubleClick = (_event: React.MouseEvent, node: Node<BackendModels.INode>) => {
    console.log(`node ${node.data.name} double clicked`);
    setCurrNode(node.data);
    setShowState({
      addNode: false,
      editNode: true,
      faultyDependency: false,
      graphShare: false,
    });
  };

  const onNodeAdd = useCallback(
    async (newNode: BackendModels.INode) => {
      // node should be created by caller
      closeAllPanels();

      if (newNode.predefined && graph.nodes.some((node) => node.id === newNode.id)) {
        // do nothing for existing predefined node
        return;
      }

      const newNodePosition = { graphId: graph.id, nodeId: newNode.id, x: 350, y: 100 };

      const createNodePositionResult = await RequestMethods.nodePositionCreate({
        token: token,
        body: newNodePosition,
      });

      if (!createNodePositionResult.status) {
        setErrorState({
          show: true,
          message: `error when creating node position: ${createNodePositionResult.detail}`,
        });
        // stop if error happened during request
        return;
      }

      const patchGraphResult = await RequestMethods.graphPatch({
        param: graph.id,
        token: token,
        body: {
          nodes: [...graph.nodes.map((node) => node.id), newNode.id],
        },
      });

      if (!patchGraphResult.status) {
        setErrorState({
          show: true,
          message: `error when updating graph: ${patchGraphResult.detail}`,
        });
        // stop if error happened during request
        return;
      }

      const patchedGraph = patchGraphResult.value;

      setGraph({
        nodes: patchedGraph.nodes,
        nodePositions: patchedGraph.nodePositions,
      });

      setNodes((nodes) =>
        nodes.concat({
          id: newNode.id,
          type: "smoothNode",
          position: { x: newNodePosition.x, y: newNodePosition.y },
          data: newNode,
        })
      );
    },
    [graph, setNodes, setGraph]
  );

  const detectCycle = (source: Node, target: Node) => {
    const stack = [source];

    while (stack.length > 0) {
      const currNode = stack.pop()!;
      // current is target, cycle detected
      if (currNode === target) {
        return true;
      }
      // add all incomers to the stack
      const incomers = getIncomers(currNode, nodes, edges);
      stack.push(...incomers);
    }
    // no cycle detected
    return false;
  };

  const onEdgeConnect = useCallback(
    async ({ source, target }: Connection) => {
      if (source === null || target === null) {
        return;
      }
      console.log(`source is ${source}, target is ${target}`);
      // nodes must exist for this callback to be called on them
      const sourceNode = nodes.find((node) => node.data.id === source)!;
      const targetNode = nodes.find((node) => node.data.id === target)!;

      console.log(`connecting node ${sourceNode.data.name} to ${targetNode.data.name}`);

      if (detectCycle(sourceNode, targetNode)) {
        setErrorState({
          show: true,
          message: "cycle detected",
        });
        return;
      }

      if (edges.some((edge) => edge.source === sourceNode.id && edge.target === targetNode.id)) {
        setErrorState({
          show: true,
          message: "duplicate edge detected",
        });
        return;
      }

      console.log(`created edge between ${sourceNode.data.name} and ${targetNode.data.name}`);

      const createEdgeResult = await RequestMethods.edgeCreate({
        token: token,
        body: {
          source: sourceNode.data.id,
          target: targetNode.data.id,
        },
      });

      if (!createEdgeResult.status) {
        setErrorState({
          show: true,
          message: "cannot create edge",
        });
        return;
      }

      const newEdge = createEdgeResult.value;

      const patchGraphResult = await RequestMethods.graphPatch({
        token: token,
        param: graph.id,
        body: {
          edges: [...graph.edges.map((edge) => edge.id), newEdge.id],
        },
      });

      if (!patchGraphResult.status) {
        setErrorState({
          show: true,
          message: "cannot update graph",
        });
        return;
      }

      setGraph({
        edges: [...graph.edges, newEdge],
      });

      // add edge
      setEdges((edges) =>
        addEdge(
          {
            id: newEdge.id,
            source: sourceNode.id,
            target: targetNode.id,
            style: {
              strokeWidth: 3,
            },
            markerEnd: {
              type: MarkerType.Arrow,
            },
          },
          edges
        )
      );

      // update dependencies
      if (targetNode.data.predefined) {
        // target is predefined, do not update
        return;
      }

      const newDependecies = [...targetNode.data.dependencies, sourceNode.id];

      const updateNodeDependencyResult = await RequestMethods.nodePatch({
        param: targetNode.data.id,
        token: token,
        body: {
          dependencies: newDependecies,
        },
      });

      if (!updateNodeDependencyResult.status) {
        setErrorState({
          show: true,
          message: "cannot update node dependency",
        });
        return;
      }

      setNodes((nodes) =>
        nodes.map((node) => {
          if (node.id === targetNode.id) {
            return {
              ...node,
              data: {
                ...node.data,
                dependencies: newDependecies,
              },
            };
          }
          return node;
        })
      );
    },
    [nodes, edges, graph, setNodes, setEdges, setGraph]
  );

  const onNodesDelete = useCallback(
    async (deleted: Node<BackendModels.INode>[]) => {
      console.log("on nodes delete");
      console.log(deleted);
      // reset currNode if it is deleted
      if (deleted.some((deletedNode) => deletedNode.data.id === currNode?.id)) {
        setCurrNode(undefined);
      }
      // update nodes first to inform edge delete
      const updatedNodes = graph.nodes.filter(
        (node) => !deleted.some((deletedNode) => deletedNode.data.id === node.id)
      );
      const updatedNodePositions = graph.nodePositions.filter(
        (nodePosition) =>
          !deleted.some((deletedNode) => deletedNode.data.id === nodePosition.nodeId)
      );
      const deletedNodePositions = graph.nodePositions.filter((nodePosition) =>
        deleted.some((deletedNode) => deletedNode.data.id === nodePosition.nodeId)
      );

      setGraph({
        nodes: updatedNodes,
        nodePositions: updatedNodePositions,
      });

      // delete node ids from graph
      await RequestMethods.graphPatch({
        param: graph.id,
        token: token,
        body: {
          nodes: updatedNodes.map((node) => node.id),
        },
      });

      // delete node positions from graph
      for (const deletedNodePosition of deletedNodePositions) {
        await RequestMethods.nodePositionDelete({
          param: [graph.id, deletedNodePosition.nodeId],
          token: token,
        });
      }
      // await Promise.all(
      //   deletedNodePositions.map((deletedNodePosition) =>
      //     RequestMethods.nodePositionDelete({
      //       param: [graph.id, deletedNodePosition.nodeId],
      //       token: token,
      //     })
      //   )
      // );

      // update dependencies
      // skip predefined nodes
      const outgoers = deleted
        .flatMap((deletedNode) => getOutgoers(deletedNode, nodes, edges))
        .filter((outgoer) => !outgoer.data.predefined);

      const updatedDependenciesNodes = graph.nodes.map((node) => ({
        ...node,
        dependencies: node.dependencies.filter(
          (dependencyId) => !deleted.some((deletedNode) => deletedNode.data.id === dependencyId)
        ),
      }));

      setGraph({
        nodes: updatedDependenciesNodes,
      });

      for (const outgoer of outgoers) {
        await RequestMethods.nodePatch({
          param: outgoer.id,
          token: token,
          body: {
            dependencies: outgoer.data.dependencies.filter(
              (dependencyId) => !deleted.some((deletedNode) => deletedNode.data.id === dependencyId)
            ),
          },
        });
      }

      // await Promise.all(
      //   outgoers.map((outgoer) =>
      //     RequestMethods.nodePatch({
      //       param: outgoer.id,
      //       token: token,
      //       body: {
      //         dependencies: outgoer.data.dependencies.filter(
      //           (dependencyId) =>
      //             !deleted.some((deletedNode) => deletedNode.data.id === dependencyId)
      //         ),
      //       },
      //     })
      //   )
      // );
    },
    [nodes, edges, setNodes, setEdges, setGraph]
  );

  const onEdgesDelete = useCallback(
    async (deleted: Edge[]) => {
      // udpate graph first to inform other callbacked
      console.log("on edge delete");
      console.log(deleted);

      // do not delete edge because of sync issue

      const updatedEdges = graph.edges.filter(
        (edge) => !deleted.some((deletedEdge) => deletedEdge.id === edge.id)
      );

      console.log("updated edges");
      console.log(updatedEdges);

      setGraph({
        edges: updatedEdges,
      });

      await RequestMethods.graphPatch({
        param: graph.id,
        token: token,
        body: {
          edges: updatedEdges.map((edge) => edge.id),
        },
      });

      for (const node of graph.nodes) {
        const edge = deleted.find((edge) => edge.target === node.id);
        if (node === undefined || node.predefined || edge === undefined) return () => {};

        await RequestMethods.nodePatch({
          param: node.id,
          token: token,
          body: {
            dependencies: node.dependencies.filter((dependencyId) => dependencyId !== edge.source),
          },
        });
      }

      // update dependencies
      // await Promise.all(
      //   graph.nodes.map((node) => {
      //     const edge = deleted.find((edge) => edge.target === node.id);
      //     if (node === undefined || node.predefined || edge === undefined) return () => {};

      //     return RequestMethods.nodePatch({
      //       param: node.id,
      //       token: token,
      //       body: {
      //         dependencies: node.dependencies.filter(
      //           (dependencyId) => dependencyId !== edge.source
      //         ),
      //       },
      //     });
      //   })
      // );
    },
    [nodes, edges, setNodes, setEdges, setGraph]
  );
  const onNodeDragStop = async (
    _event: React.MouseEvent,
    draggedNode: Node<BackendModels.INode>
  ) => {
    console.log(`dragged node to position [${draggedNode.position.x}, ${draggedNode.position.y}]`);
    const nodePositionPatchResult = await RequestMethods.nodePositionPatch({
      param: [graph.id, draggedNode.data.id],
      token: token,
      body: {
        x: Math.floor(draggedNode.position.x),
        y: Math.floor(draggedNode.position.y),
      },
    });
    if (!nodePositionPatchResult.status) {
      setErrorState({
        show: true,
        message: "cannot patch node position",
      });
      return;
    }
    const nodePosition = graph.nodePositions.find(
      (existingPosition) => existingPosition.nodeId === draggedNode.data.id
    )!;
    const newNodePosition = {
      ...nodePosition,
      x: Math.floor(draggedNode.position.x),
      y: Math.floor(draggedNode.position.y),
    };
    setGraph({
      nodePositions: [
        ...graph.nodePositions.filter(
          (existingPosition) => existingPosition.nodeId !== draggedNode.data.id
        ),
        newNodePosition,
      ],
    });
  };

  const onTitleInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onTitleSubmit = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      RequestMethods.graphPatch({
        param: graph.id,
        token: token,
        body: {
          title: title,
        },
      });
    }
  };

  const onShareButtonClicked = () => {
    setShowState({
      addNode: false,
      editNode: false,
      faultyDependency: false,
      graphShare: true,
    });
  };

  const onError = (error: string) => {
    setErrorState({
      show: true,
      message: error,
    });
  };

  return (
    <div className="w-full flex flex-row min-h-screen min-w-full overflow-hidden">
      <div className="flex self-stretch basis-3/4 overflow-hidden">
        <Snackbar open={successState.show} autoHideDuration={2000} onClose={onSnackBarClose}>
          <Alert severity="success">{successState.message}</Alert>
        </Snackbar>
        <Snackbar open={infoState.show} autoHideDuration={2000} onClose={onSnackBarClose}>
          <Alert severity="info">{infoState.message}</Alert>
        </Snackbar>
        <Snackbar open={errorState.show} autoHideDuration={2000} onClose={onSnackBarClose}>
          <Alert severity="error">{errorState.message}</Alert>
        </Snackbar>
        <Dialog open={showState.addNode} onClose={closeAllPanels} maxWidth="md" fullWidth={true}>
          <AddNode onSubmit={onNodeAdd} onError={onError} />
        </Dialog>
        <Dialog open={showState.graphShare} onClose={closeAllPanels} maxWidth="sm" fullWidth={true}>
          <GraphSharing onClose={closeAllPanels} />
        </Dialog>
        <ReactFlow
          nodeTypes={nodeTypes}
          nodes={nodes}
          onNodesChange={onNodesChange}
          onNodesDelete={onNodesDelete}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onEdgeConnect}
          onEdgesDelete={onEdgesDelete}
          onPaneClick={() => setCurrNode(undefined)}
          onNodeDragStop={onNodeDragStop}
        >
          <Panel className="bg-transparent" position="top-center">
            <TextField onChange={onTitleInputChanged} value={title} />
          </Panel>
          <Panel className="bg-transparent" position="top-left">
            <div className="flex flex-col space-y-2">
              <Tooltip title="Add Node" placement="right" arrow>
                <Button
                  variant="outlined"
                  sx={{ padding: "8px", minWidth: "32px" }}
                  onClick={onAddNodeButtonClicked}
                >
                  <Add />
                </Button>
              </Tooltip>
              <Tooltip title="Share" placement="right" arrow>
                <Button
                  variant="outlined"
                  sx={{ padding: "8px", minWidth: "32px" }}
                  onClick={onShareButtonClicked}
                >
                  <Share />
                </Button>
              </Tooltip>
              <Tooltip title="Verify Dependencies" placement="right" arrow>
                <Button
                  variant="outlined"
                  sx={{ padding: "8px", minWidth: "32px" }}
                  onClick={onDoneButtonClicked}
                >
                  <DoneAll />
                </Button>
              </Tooltip>
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

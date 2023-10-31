'use client'
import React, { useState, useEffect } from 'react';
import ReactFlow, {useNodesState, Controls, Background, BackgroundVariant} from 'react-flow-renderer';
import { MarkerType } from 'reactflow';
import { Button, Dialog, DialogTitle, ClickAwayListener, DialogActions, DialogContent, DialogContentText } from "@mui/material"
import NodeDialog from './components/NodeDialog'
import NodeInfoDialog from './components/NodeInfoDialog'
import EditNodeDialog from './components/EditNodeDialog'
import PredefinedNodeDialog from './components/PredefinedNodeDialog'
import { predefinedNodeGet, nodeCreate, edgeCreate, edgeDelete, nodeEdit, nodeDelete } from "@/app/utils/backendRequests"
import 'reactflow/dist/style.css'
import './index.css'

export interface INode {
    node_id: number;
    name: string;
    description: string;
    isPredefined: boolean;
    dependencies: INode[];
    onCanvas?: boolean;
}

function FlowComponent() {
  //const router = useRouter()
  const [token, setToken] = useState("")
  const [showDialog, setShowDialog] = useState(false);
  const [showPredefinedDialog, setShowPredefinedDialog] = useState(false);
  const [showNodeInfoDialog, setShowNodeInfoDialog] = useState(false);
  const [selectedNode, setSelectedNode] = useState<INode | null>(null);
  const [showEditDialog, setEditDialog] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [predefinedNodes, setPredefinedNodes] = useState<INode[]>([]);
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState<"error" | "success">("error")

  const [edges, setEdges] = useState<any[]>([]);


  useEffect(() => {
    // Fetch predefined nodes and add them to the nodes state when the component mounts
    // redirect to welcome page if not logged in
    /*
    const currToken = sessionStorage.getItem("token") ?? ""

    if (currToken === undefined || currToken === "") {
      console.log(`token is ${currToken}, skipping back`)
      router.push("/")
      return;
    }

    setToken(currToken)
    */

    async function fetchPredefinedNodes() {
      const response = await predefinedNodeGet(); // You may need to pass any required parameters
      if (response.status) {
        console.log(response);
        const predefinedNodesWithAttribute = response.value.map((node) => ({
          ...node,
          onCanvas: false,  // Manually set the isPredefined attribute
        }));
        setPredefinedNodes(predefinedNodesWithAttribute);
        // setPredefinedNodes(response.value); // Assuming response.value contains the predefined nodes
      } else {
        // Handle the error case
        console.error('Error fetching predefined nodes:', response.error);
      }
    }

    fetchPredefinedNodes();
  }, []); // Run this effect only once when the component mounts


  const handleCreateButtonClick = () => {
      if (!showDialog) setShowDialog(true);
      if (showPredefinedDialog) setShowPredefinedDialog(false);
  };

  const handleAddButtonClick = () => {
    if (showDialog) setShowDialog(false);
    if (!showPredefinedDialog) setShowPredefinedDialog(true);
  };

  const onCreateOrAddNodeCancelled = () => {
    if (showDialog) setShowDialog(false)
    if (showPredefinedDialog) setShowPredefinedDialog(false)
  }
  const createNodeOnCanvas = (data: any) => {
    const newNode = {
      id: data.node_id.toString(),
      type: 'default',
      data: {
            label: `${data.name}`,
            attribute: {id: data.node_id, name: data.name, description: data.description, isPredefined: data.isPredefined, dependencies: data.dependencies}
        },
      position: {x: Math.random()*400, y:Math.random()*400},
      draggable: true
    };
    setNodes( (existingNodes) => [...existingNodes, newNode])
    console.log(data)
  }
  const handleButtonSubmit = (data: any) => {
    // upon submit, create a new node based on input data
    if (!data.isPredefined) {
        nodeCreate({
          name: data.name,
          description: data.description,
      }, sessionStorage.getItem("token")!).then((result) => {
        if (result.status) {
          setSeverity("success")
          setMessage("User create node successful")
          createNodeOnCanvas(result.value)
        } else {
          setSeverity("error")
          setMessage(result.error) // 
        }
      })
    }
    else {
      const updatedPredefinedNodes = predefinedNodes.map((node) => 
        node.name === data.name ? { ...node, onCanvas: true } : node
      );
      setPredefinedNodes(updatedPredefinedNodes);
      createNodeOnCanvas(data)
    }
    setShowDialog(false);
  }

  const [selectedEdgeId, setSelectedEdgeId] = useState(null); // 存储被选中的边的ID
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // 控制删除对话框的显示

  const handleNodeClick = (event: any, node: any) => {
    console.log(node.data.attribute);
    setSelectedNode({
      node_id: Number(node.data.attribute.id),
      name: node.data.attribute.name,
      description: node.data.attribute.description,
      isPredefined: node.data.attribute.isPredefined,
      dependencies: node.data.attribute.dependencies,
      onCanvas: true,
    });
    setShowNodeInfoDialog(true);
  }

  const deleteNodeOnCanvas =  () => {
    setShowNodeInfoDialog(false);
    if (selectedNode) {
      
      if (selectedNode.isPredefined) {
        const updatedPredefinedNodes = predefinedNodes.map((node) => 
          node.name === selectedNode.name ? { ...node, onCanvas: false } : node
        );
        setPredefinedNodes(updatedPredefinedNodes);
        setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.node_id.toString()))
        setSelectedNode(null);
      }
      else {
        
        // if it's not predefined node, we need to delete it on database as well 
        
        nodeEdit({
          node_id: selectedNode.node_id,
          name: selectedNode.name,
          description: selectedNode.description,
      }, sessionStorage.getItem("token")!).then((result) => {
        if (result.status) {
          setSeverity("success")
          setMessage("User create node successful")
          if (selectedNode) setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.node_id.toString()))
          setSelectedNode(null);
        } else {
          setSeverity("error")
          setMessage(result.error) // 
        }
      })
      }
    }
    
  }

  const handleNodeDelete = (node: any) => {
    console.log(node)
    deleteNodeOnCanvas();
  }

  const deleteNodeByButton = () => {
    deleteNodeOnCanvas();
  };

  const handleButtonEdit = () => {
    if (showDialog) setShowDialog(false);
    if (showPredefinedDialog) setShowPredefinedDialog(false);
    if (!showEditDialog) {
      setEditDialog(true)
      if (selectedNode) setCurrentNodeId(selectedNode.node_id)
    }
    console.log("edit");
    setShowNodeInfoDialog(false);
  }


  const handleCloseInfoButtonClick = () => {
    setShowNodeInfoDialog(false);
    setSelectedNode(null);
  }

  const handleEdgeClick = (event:any, edge:any) => {
    setSelectedEdgeId(edge.id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
        setSeverity("error");
        setMessage("Authentication token missing");
        return;
    }
    try {
        // sending delete request to backend
        const response = await fetch(`http://localhost:8000/edge/delete/${selectedEdgeId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Token ${token}`,  // update the token format
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to delete edge with ID: ${selectedEdgeId}`);
        }
        // handle the response if needed, e.g., by checking for a 204 status code
        if (response.status !== 204) {
            console.warn('Unexpected status code:', response.status);
        } else {
            setEdges((prevEdges) => prevEdges.filter(edge => edge.id !== selectedEdgeId));
            setShowDeleteDialog(false);
            setSelectedEdgeId(null);
        }
    } catch (error) {
        console.error('Failed to delete edge:', error);
    }
};


   const handleEditSubmit = (data: any) => {
    nodeEdit({
      node_id: data.currentNodeId,
      name: data.name,
      description: data.description,
  }, sessionStorage.getItem("token")!).then((result) => {
    if (result.status) {
      setSeverity("success")
      setMessage("User create node successful")
      setNodes((existingNodes) => {
        const nodeToUpdate = existingNodes.find(node => node.id == data.currentNodeId)
        if (!nodeToUpdate) return existingNodes;
        nodeToUpdate.data.attribute.name = data.name;
        nodeToUpdate.data.attribute.description = data.description;
        nodeToUpdate.data.label = data.name;
        return [...existingNodes.filter(node => node.id != nodeToUpdate.id), nodeToUpdate]
      })
  
      setEditDialog(false);
    } else {
      setSeverity("error")
      setMessage(result.error) // 
    }
  })
  }

   const handleEditClose = (data: any) => {
    if (showDialog) setShowDialog(false)
    if (showPredefinedDialog) setShowPredefinedDialog(false)
    if (showEditDialog) setEditDialog(false)
  }

  const handleDeleteCancel = () => {
    setShowDeleteDialog(false);
    setSelectedEdgeId(null);
  };

  const createNewEdge = (data: any) => {
    console.log(data)
    const newEdge = {
      id: data.edgeID.toString(),
      source: data.fromNodeID.toString(),
      target: data.toNodeID.toString(),
      style: {
        strokeWidth: 3,
      },
      markerEnd: {
        type: MarkerType.Arrow,
      }
    };
    setEdges((edges) => [...edges, newEdge]);
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
    <div className="w-full h-full flex flex-col min-h-screen items-center justify-between">
      <div className='w-full flex h-24 flex-row bg-slate-100'>
        <div className='flex h-24 flex-row'>
          <div className='h-16 w-16 bg-slate-400 m-4'></div>
          <div className='h-16 m-4'>
            <span className='h-16 flex items-center justify-center text-center m-auto text-lg'>SMOOTH</span>
          </div>
        </div>

        <div className='flex h-24 flex-row ml-auto'>
          <div className='flex h-16 m-4'>
            <Button className='w-60 mr-4 bg-gray-500' size="large" variant='contained' onClick={handleCreateButtonClick}>Create Node</Button>
            <Button className='w-60 mr-4 bg-gray-500' size="large" variant='contained' onClick={handleAddButtonClick}>Add Node</Button>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-row self-stretch items-stretch justify-between flex-1'>
        <div className='flex flex-1 bg-gray-500'></div>
        <Dialog open={showDialog || showPredefinedDialog} onSubmit={handleButtonSubmit} onClose={onCreateOrAddNodeCancelled} maxWidth="sm" fullWidth={true}>
          {showDialog && (
            <>
              <DialogTitle>Create Node</DialogTitle>
              <NodeDialog showDialog={showDialog} onSubmit={handleButtonSubmit} onClose={() => setShowDialog(false)}/>
            </>
          )}
            {showPredefinedDialog && (
            <>
              <DialogTitle>Add Node</DialogTitle>
              <PredefinedNodeDialog showPredefinedDialog={showPredefinedDialog} onSubmit={handleButtonSubmit} onClose={() => setShowPredefinedDialog(false)} predefinedNodes={predefinedNodes}/>
            </>
          )}
        </Dialog>
        <Dialog open={showNodeInfoDialog} onSubmit={handleButtonEdit} onClose={() => setShowNodeInfoDialog(false)} maxWidth="sm" fullWidth={true}>
        {showNodeInfoDialog && (
            <>
              <DialogTitle>Node Info</DialogTitle>
              <NodeInfoDialog showNodeInfoDialog={showNodeInfoDialog} onEdit={handleButtonEdit} onDelete={deleteNodeByButton} onClose={handleCloseInfoButtonClick} node={selectedNode}/>
            </>
          )}
        </Dialog>

      </div>


      <ReactFlow nodes={nodes} onNodesChange={onNodesChange} onNodesDelete={handleNodeDelete} onNodeClick={handleNodeClick}

        edges={edges}
        onEdgeClick={handleEdgeClick}
        onConnect={(params) => {
          console.log(params)
          // todo: send edge data to backend
          const token = sessionStorage.getItem("token");
          if (!token) {
              setSeverity("error");
              setMessage("Authentication token missing");
              return;
          }
          
          edgeCreate({
            belong_to : 123,
            source: params.source!,
            target: params.target!
          }, token).then((result) => {
            if (result.status) {
              setSeverity("success")
              setMessage("Edge creation successful")
              console.log("success")
              console.log(result)
              createNewEdge(result.value)
            } else {
              setSeverity("error")
              setMessage(result.error)
            }
          });

        }}style={{ width: '100vw', height: '100vh' }}>
      <Controls />
      <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
    </ReactFlow>
    <Dialog open={showDeleteDialog} onClose={handleDeleteCancel}>
        <DialogTitle>Delete edge</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this edge?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="primary">
            confirm
          </Button>
        </DialogActions>
      </Dialog>
       <Dialog open={showEditDialog} onSubmit={handleEditSubmit} onClose={handleEditClose} maxWidth="sm" fullWidth={true}>
          {showEditDialog && (
            <>
              <DialogTitle>Edit Node</DialogTitle>
              <EditNodeDialog showEditDialog={showEditDialog} currentNodeId={currentNodeId} onSubmit={handleEditSubmit} onClose={() => setEditDialog(false)} />
            </>
          )}
        </Dialog>
    </div>
  </div>
  )
}

export default FlowComponent;

'use client'
import React, { useState, useEffect } from 'react';
import ReactFlow, { useNodesState, Controls, Background, BackgroundVariant } from 'react-flow-renderer';
import { Button, Dialog, DialogTitle, ClickAwayListener } from "@mui/material"
import NodeDialog from './components/NodeDialog'
import PredefinedNodeDialog from './components/PredefinedNodeDialog'
import EditNodeDialog from './components/EditNodeDialog';
import { predefinedNodeGet, nodeCreate } from "@/app/utils/backendRequests"
import { useRouter } from "next/navigation"
import 'reactflow/dist/style.css'
import './index.css'
import { INode } from "@/app/utils/models";

function FlowComponent() {
  //const router = useRouter()
  const [token, setToken] = useState("")
  const [showDialog, setShowDialog] = useState(false);
  const [showPredefinedDialog, setShowPredefinedDialog] = useState(false);
  const [showEditDialog, setEditDialog] = useState(false);
  const [currentNodeId, setCurrentNodeId] = useState(0);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [predefinedNodes, setPredefinedNodes] = useState<INode[]>([]);
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState<"error" | "success">("error")

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
        setPredefinedNodes(response.value); // Assuming response.value contains the predefined nodes
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

  const handleEditSubmit = (data: any) => {
    setNodes((existingNodes) => {
      const nodeToUpdate = existingNodes.find(node => node.id == data.currentNodeId)
      if (!nodeToUpdate) return existingNodes;
      nodeToUpdate.data.attribute.name = data.name
      nodeToUpdate.data.attribute.description = data.description
      nodeToUpdate.data.label = `${data.name} (${data.description})`
      return [...existingNodes.filter(node => node.id != nodeToUpdate.id), nodeToUpdate]
    })
    setEditDialog(false);
  }

  const createNodeOnCanvas = (data: any) => {
    const newNode = {
      id: data.node_id.toString(),
      type: 'default',
      data: {
        label: `${data.name} (${data.description})`,
        attribute: { id: data.node_id, name: data.name, description: data.description, isPredefined: data.isPredefined, dependencies: data.dependencies }
      },
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      draggable: true
    };
    setNodes((existingNodes) => [...existingNodes, newNode])
  }

  const handleButtonSubmit = (data: any) => {
    console.log(data)
    // upon submit, create a new node based on input data
    if (!data.isPredefined) {
      nodeCreate({
        name: data.name,
        description: data.description,
        node_id: data.node_id,
        isPredefined: false,
        dependencies: [],
      }, sessionStorage.getItem("token")!).then((result) => {
        if (result.status) {
          setSeverity("success")
          setMessage("User create node successful")
          createNodeOnCanvas(result.value)
        } else {
          setSeverity("error")
          setMessage(result.error)
        }
      })
    }
    else {
      createNodeOnCanvas(data)
    }
    setShowDialog(false);
  }

  const onNodeDoubleClickListener = (event: any, node: any) => {
    if (node.data.attribute.isPredefined)
      return
    if (showDialog) setShowDialog(false);
    if (showPredefinedDialog) setShowPredefinedDialog(false);
    if (!showEditDialog) {
      setEditDialog(true)
      setCurrentNodeId(node.id)
    }
  }

  const handleEditClose = (data: any) => {
    if (showDialog) setShowDialog(false)
    if (showPredefinedDialog) setShowPredefinedDialog(false)
    if (showEditDialog) setEditDialog(false)
  }

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
                <NodeDialog showDialog={showDialog} onSubmit={handleButtonSubmit} onClose={() => setShowDialog(false)} />
              </>
            )}
            {showPredefinedDialog && (
              <>
                <DialogTitle>Add Node</DialogTitle>
                <PredefinedNodeDialog showPredefinedDialog={showPredefinedDialog} onSubmit={handleButtonSubmit} onClose={() => setShowPredefinedDialog(false)} predefinedNodes={predefinedNodes} />
              </>
            )}
          </Dialog>
        </div>
        <Dialog open={showEditDialog} onSubmit={handleEditSubmit} onClose={handleEditClose} maxWidth="sm" fullWidth={true}>
          {showEditDialog && (
            <>
              <DialogTitle>Edit Node</DialogTitle>
              <EditNodeDialog showEditDialog={showEditDialog} currentNodeId={currentNodeId} onSubmit={handleEditSubmit} onClose={() => setEditDialog(false)} />
            </>
          )}
        </Dialog>
        <ReactFlow nodes={nodes} onNodesChange={onNodesChange} onNodeDoubleClick={onNodeDoubleClickListener} style={{ width: '100vw', height: '100vh' }}>
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
    </div>
  )
}

export default FlowComponent;
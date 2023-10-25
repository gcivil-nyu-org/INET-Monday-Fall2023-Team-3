'use client'
import React, { useState } from 'react';
import uuid from 'react-uuid'
import ReactFlow, {useNodesState, Controls, Background} from 'react-flow-renderer';
import { Button, Dialog, DialogTitle, ClickAwayListener } from "@mui/material"
import NodeDialog from './components/NodeDialog'
import PredefinedNodeDialog from './components/PredefinedNodeDialog'
import 'reactflow/dist/style.css'
import './index.css'

export interface INode {
    courseName: string;
    description: string;
}
const predefinedNodes: INode[] = [
    { courseName: 'ECE244', description: 'Programming Fundamentals' },
    { courseName: 'ECE297', description: 'Design and Communications' },
    { courseName: 'ECE361', description: 'Computer Networks' },
    { courseName: 'ECE345', description: 'Data Structures & Algorithms' },
    // Add more nodes as needed
];

function FlowComponent() {
  const [showDialog, setShowDialog] = useState(false);
  const [showPredefinedDialog, setShowPredefinedDialog] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);


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

  const handleButtonSubmit = (data) => {
    // upon submit, create a new node based on input data
    console.log(data)
    const newNode = {
      id: uuid(),
      type: 'default',
      data: { 
            label: `${data.courseName} (${data.description})`, 
            attribute: {name: data.courseName, description: data.description, isPredefined: data.isPredefined} 
        },
      position: {x: Math.random()*400, y:Math.random()*400},
      draggable: true
    };
    console.log(newNode.data.attribute)
    setNodes( (existingNodes) => [...existingNodes, newNode])
    setShowDialog(false);
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
      </div>
      <ReactFlow nodes={nodes} onNodesChange={onNodesChange} style={{ width: '100vw', height: '100vh' }}>
      <Controls />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
    </div>
  </div>
  )
}

export default FlowComponent;
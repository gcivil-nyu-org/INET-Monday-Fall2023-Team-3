'use client'
import React, { useState } from 'react';
import uuid from 'react-uuid'
import ReactFlow, {useNodesState, Controls, Background} from 'react-flow-renderer';
import { Button, Dialog, DialogTitle, ClickAwayListener } from "@mui/material"
import NodeDialog from './components/NodeDialog'
import 'reactflow/dist/style.css'
import './index.css'

function FlowComponent() {
  const [showDialog, setShowDialog] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);

  const handleButtonClick = () => {
      setShowDialog(true);
  };

  const handleButtonSubmit = (data) => {
    // upon submit, create a new node based on input data
    console.log(data)
    const newNode = {
      id: uuid(),
      type: 'default',
      data: { label: data.courseName},
      position: {x: Math.random()*400, y:Math.random()*400},
      draggable: true
    };

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
            <Button className='w-60 mr-4 bg-gray-500' size="large" variant='contained' onClick={handleButtonClick}>Create Node</Button>
          </div>
        </div>
      </div>
      <div className='w-full flex flex-row self-stretch items-stretch justify-between flex-1'>
        <div className='flex flex-1 bg-gray-500'></div>
        <Dialog open={showDialog} onSubmit={handleButtonSubmit} onClose={() => setShowDialog(false)} maxWidth="sm" fullWidth={true}>
          {showDialog && (
            <>
              <DialogTitle>Add Node</DialogTitle>
              <NodeDialog showDialog={showDialog} onSubmit={handleButtonSubmit} onClose={() => setShowDialog(false)}/>
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
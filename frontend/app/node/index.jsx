'use client'
import React, { useState } from 'react';
import uuid from 'react-uuid'
import ReactFlow, {useNodesState, Controls, Background} from 'react-flow-renderer';
import MyButton from './components/MyButton'
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
      data: { label: "course_name"},
      position: {x: Math.random()*400, y:Math.random()*400},
      draggable: true
    };

    setNodes( (existingNodes) => [...existingNodes, newNode])
    setShowDialog(false);
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <div style={{position:'absolute', zIndex:10}}>
      <MyButton  onClick={handleButtonClick} label="Add Node" />
      <NodeDialog showDialog={showDialog} onSubmit={handleButtonSubmit} onClose={() => setShowDialog(false)} />
    </div>

    <ReactFlow nodes={nodes} onNodesChange={onNodesChange} style={{ width: '100vw', height: '100vh' }}>
      <Controls />
      <Background variant="dots" gap={12} size={1} />
    </ReactFlow>
  </div>
  )
}

export default FlowComponent;

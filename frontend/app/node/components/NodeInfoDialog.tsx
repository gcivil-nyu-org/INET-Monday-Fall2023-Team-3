'use client'
import { ChangeEvent, useState } from "react"
import { Button, Alert, TextField, List, ListItem } from "@mui/material"

interface Props {
  showNodeInfoDialog: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
  node: any;
}

export default function NodeInfoDialog({ showNodeInfoDialog, onEdit, onDelete, onClose, node}: Props) {

    const onEditButtonClicked = (node: any) => {
        console.log("dialog");
        console.log(node)
        // Handle submission here
        onEdit()
    };


    return (
        showNodeInfoDialog && (
        <div className="w-full flex flex-col items-center bg-white">
          {/* Card for Node Information */}
        <div className="w-full max-w-lg bg-white rounded-md shadow-md p-4 mb-4">
          <h2 className="text-xl font-semibold mb-2">{node.name}</h2>
          <p className="text-gray-600">{node.description}</p>
        </div>
        
        <div className="h-24 w-full flex">
          <Button className="w-40 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onEditButtonClicked} disabled={node.isPredefined}>Edit</Button>
          <Button className="w-40 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onDelete}>Delete</Button>
          <Button className="w-40 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    )
    );
}
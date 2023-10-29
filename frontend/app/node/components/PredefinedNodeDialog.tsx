'use client'
import { ChangeEvent, useState } from "react"
import { Button, Alert, TextField, List, ListItem } from "@mui/material"

interface Props {
  showPredefinedDialog: boolean;
  onSubmit: (node: any) => void;
  onClose: () => void;
  predefinedNodes: any[];
}

export default function PredefinedNodeDialog({ showPredefinedDialog, onSubmit, onClose, predefinedNodes}: Props) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNodes: any[] = predefinedNodes.filter(node =>
        node.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const onAddButtonClicked = (node: any) => {
        if (!node.name.trim() && !node.description.trim()) {
            alert('Course name and description are required');
            return;
        }
        if (!node.name.trim()) {
            alert('Course name is required');
            return;
        }
        if (!node.description.trim()) {
          alert('Description is required');
          return;
        }
        // Handle submission here
        onSubmit(node)
    };
    const onSearchChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value)
    }


    return (
        showPredefinedDialog && (
        <div className="w-full flex flex-col items-center bg-white">
        <div className="h-24 w-full flex">
          <TextField className="h-16 m-4 flex-1" label="Search" variant="outlined" fullWidth onChange={onSearchChanged}/>
        </div>
        <div className="w-full flex flex-col items-center bg-white overflow-y-auto max-h-screen p-4">
          <div className="grid grid-cols-3 gap-4 w-full">
            {filteredNodes.map((node) => (
                    < button className="flex items-center justify-center h-24 bg-gray-200 rounded-md" key={node.name} onClick={() => onAddButtonClicked(node)} >
                        {node.name}
                    </button>
            ))}
          </div>
        </div>
        <div className="h-24 w-full flex">
          <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    )
    );
}
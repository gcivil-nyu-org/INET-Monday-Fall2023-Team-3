'use client'
import { ChangeEvent, useState } from "react"
import { Button, Alert, TextField, List, ListItem } from "@mui/material"
import { fetchRestful } from "@/app/utils/helpers"
import { useRouter } from "next/navigation"
import { userSignup } from "@/app/utils/backendRequests"
import './list_style.css'
export default function PredefinedNodeDialog({ showPredefinedDialog, onSubmit, onClose, predefinedNodes  }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNodes = predefinedNodes.filter(node =>
        node.courseName.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const onAddButtonClicked = (node) => {
        console.log(`courseName: ${node.courseName}`)
        console.log(`description: ${node.description}`)
        if (!node.courseName.trim() && !node.description.trim()) {
            alert('Course name and description are required');
            return;
        }
        if (!node.courseName.trim()) {
            alert('Course name is required');
            return;
        }
        if (!node.description.trim()) {
          alert('Description is required');
          return;
        }
        // Handle submission here
        let courseName = node.courseName;
        let description = node.description
        let isPredefined = true
        onSubmit({courseName, description, isPredefined})
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
        <div className="h-24 w-full flex horizontal-list-container">
          <List className="horizontal-list">
            {filteredNodes.map((node) => (
                    <ListItem button className="horizontal-list-item" key={node.courseName} onClick={() => onAddButtonClicked(node)} >
                        {node.courseName}
                    </ListItem>
            ))}
          </List>
        </div>
        <div className="h-24 w-full flex">
          <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    )
                    

    );
}
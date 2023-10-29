'use client'
import { ChangeEvent, useState } from "react"
import { Button, Alert, TextField } from "@mui/material"
import { fetchRestful } from "@/app/utils/helpers"
import { useRouter } from "next/navigation"
import { nodeCreate } from "@/app/utils/backendRequests"

export default function NodeDialog({ showDialog, onSubmit, onClose }) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")

    const onAddButtonClicked = () => {
        console.log(`courseName: ${name}`)
        console.log(`description: ${description}`)
        if (!name.trim() && !description.trim()) {
            alert('Course name and description are required');
            return;
        }
        if (!name.trim()) {
            alert('Course name is required');
            return;
        }
        if (!description.trim()) {
          alert('Description is required');
          return;
        }
        // Handle submission here for now, should be submitted after POST success
        let isPredefined = false
        onSubmit({name, description, isPredefined})
    };

    const onCourseNameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
      setName(event.target.value)
    }
    
    const onDescriptionInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    }

    return (
        showDialog && (
        <div className="w-full flex flex-col items-center bg-white">
        <div className="h-24 w-full flex">
          <TextField className="h-16 m-4 flex-1" label="Course Name" variant="outlined" onChange={onCourseNameInputChanged} required/>
        </div>
        <div className="h-24 w-full flex">
          <TextField className="h-16 m-4 flex-1" label="Description" variant="outlined" onChange={onDescriptionInputChanged} required/>
        </div>
        <div className="h-24 w-full flex">
          <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onAddButtonClicked}>Add</Button>
          <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onClose}>Cancel</Button>

        </div>
      </div>
    )
                    

    );
}


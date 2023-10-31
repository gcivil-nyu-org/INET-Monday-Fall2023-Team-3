import { ChangeEvent, useState } from "react"
import { Button, Alert, TextField } from "@mui/material"
import { fetchRestful } from "@/app/utils/helpers"
import { useRouter } from "next/navigation"
import { nodeCreate } from "@/app/utils/backendRequests"

interface Props {
    showEditDialog: boolean;
    currentNodeId: number;
    onSubmit: (node: any) => void;
    onClose: () => void;
}

export default function EditNodeDialog({ showEditDialog, currentNodeId, onSubmit, onClose }: Props) {
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const onEditButtonClicked = () => {
        console.log(`courseName: ${name}`)
        console.log(`description: ${description}`)
        console.log(currentNodeId)
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
        onSubmit({ name, description, currentNodeId })

        // nodeCreate({
        //   name: name,
        //   description: description,
        //   isPredefined: isPredefined,
        // }).then((result) => {
        //   console.log(result)
        // })
    };

    const onCourseNameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    const onDescriptionInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    }

    return (
        showEditDialog && (
            <div className="w-full flex flex-col items-center bg-white">
                <div className="h-24 w-full flex">
                    <TextField className="h-16 m-4 flex-1" label="Course Name" variant="outlined" onChange={onCourseNameInputChanged} required />
                </div>
                <div className="h-24 w-full flex">
                    <TextField className="h-16 m-4 flex-1" label="Description" variant="outlined" onChange={onDescriptionInputChanged} required />
                </div>
                <div className="h-24 w-full flex">
                    <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onEditButtonClicked}>Edit</Button>
                    <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onClose}>Cancel</Button>

                </div>
            </div>
        )


    );
}
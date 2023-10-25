import React, { ChangeEvent, useState } from 'react';
import { Button, Alert, TextField } from "@mui/material"

function NodeDialog({ showDialog, onClose }) {

    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
  
    const onAddButtonClicked = () => {
      console.log(`name: ${name}`)
      console.log(`description: ${description}`)
      nodeCreate({
        name: name,
        description: description,
      }).then((result) => {
        if (result.status) {
          setErrorMessage("")
          console.log(result.value)
        } else {
          setErrorMessage(result.error)
          console.error(result.error)
        }
      })
    }

    const onNameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }
  
    const onDescriptionInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value)
    }

    return (
        showDialog && (
            <div className="w-full flex flex-col items-center bg-white">
            <div className="h-24 w-full flex">
              <TextField className="h-16 m-4 flex-1" label="name" variant="outlined" onChange={onNameInputChanged} />
            </div>
            <div className="h-24 w-full flex">
              <TextField className="h-16 m-4 flex-1" label="description" variant="outlined" onChange={onDescriptionInputChanged} />
            </div>
            <div className="h-24 w-full flex">
              <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onAddButtonClicked}>Add</Button>
              <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onClose}>Close</Button>
            </div>
          </div>
        )
    );
}

export default NodeDialog;
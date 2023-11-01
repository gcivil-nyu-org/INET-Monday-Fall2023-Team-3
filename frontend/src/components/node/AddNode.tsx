import { useState, ChangeEvent } from "react"
import { Button, TextField, Alert } from "@mui/material"

import { INode } from "utils/models"
import { nodeCreate } from "utils/backendRequests"


export type AddNodeProp = {
  onSubmit: (node: INode) => void
  onError: (err: string) => void
}

export default function AddNode({ onSubmit, onError }: AddNodeProp) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const onNameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const onDescriptionInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value)
  }

  const onSave = () => {
    const cleanName = name.trim()
    const cleanDescription = description.trim()

    if (cleanName === "") {
      setErrorMessage("name cannot be empty")
      return
    }

    nodeCreate({ name: cleanName, description: cleanDescription }, sessionStorage.getItem("token")!)
      .then((result) => {
        if (result.status) {
          onSubmit(result.value)
        } else {
          onError(result.error)
        }
      })
  }

  return (
    <div className="w-full flex flex-col items-center bg-white">
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Course Name" variant="outlined" onChange={onNameInputChanged} required />
      </div>
      <div className="h-24 w-full flex">
        <TextField className="h-16 m-4 flex-1" label="Description" variant="outlined" onChange={onDescriptionInputChanged} required />
      </div>
      {errorMessage !== "" && (
        <div className="h-24 w-full flex">
          <Alert className="h-16 w-full m-4" severity="error">{errorMessage}</Alert>
        </div>
      )}
      <div className="h-24 w-full flex">
        <Button className="w-64 h-16 m-auto bg-blue-400" size="large" variant="contained" onClick={onSave}>Save</Button>
      </div>
    </div>
  )
}

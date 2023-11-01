import { useState, ChangeEvent } from "react";
import { Button, TextField, Alert } from "@mui/material";

import { INode } from "utils/models";
import { nodeUpdate } from "utils/backendRequests";

export type EditNodeProp = {
  node: INode;
  onSubmit: (node: INode) => void;
  onError: (err: string) => void;
};

export default function EditNode({ node, onSubmit, onError }: EditNodeProp) {
  const [name, setName] = useState(node.name);
  const [description, setDescription] = useState(node.description);
  const [errorMessage, setErrorMessage] = useState("");

  const onNameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onDescriptionInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onSave = () => {
    // nothing changed
    if (name === node.name && description === node.description) {
      return;
    }

    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (cleanName === "") {
      setErrorMessage("name cannot be empty");
      return;
    }

    nodeUpdate(
      { id: node.id, name: cleanName, description: cleanDescription },
      sessionStorage.getItem("token")!
    ).then((result) => {
      const nextNode = { ...node, name: cleanName, description: cleanDescription };
      if (result.status) {
        onSubmit(nextNode);
      } else {
        onError(result.error);
      }
    });
  };

  return (
    <div className="w-full flex flex-col items-center bg-white">
      <div className="h-24 w-full flex">
        <TextField
          className="h-16 m-4 flex-1"
          label="Course Name"
          variant="outlined"
          onChange={onNameInputChanged}
          required
        />
      </div>
      <div className="h-24 w-full flex">
        <TextField
          className="h-16 m-4 flex-1"
          label="Description"
          variant="outlined"
          onChange={onDescriptionInputChanged}
          required
        />
      </div>
      {errorMessage !== "" && (
        <div className="h-24 w-full flex">
          <Alert className="h-16 w-full m-4" severity="error">
            {errorMessage}
          </Alert>
        </div>
      )}
      <div className="h-24 w-full flex">
        <Button
          className="w-64 h-16 m-auto bg-blue-400"
          size="large"
          variant="contained"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

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
      <div className="w-full flex">
        <TextField
          value={name}
          className="m-4 flex-1"
          label="Course Name"
          variant="outlined"
          onChange={onNameInputChanged}
          required
          disabled={node.predefined}
        />
      </div>
      <div className="w-full flex my-4">
        <TextField
          value={description}
          className="flex-1 mx-4 min-h-[6rem]"
          label="Description"
          variant="outlined"
          onChange={onDescriptionInputChanged}
          required
          disabled={node.predefined}
          multiline
          rows={4}
        />
      </div>
      {errorMessage !== "" && (
        <div className="w-full my-4">
          <Alert className="h-16 w-full m-4" severity="error">
            {errorMessage}
          </Alert>
        </div>
      )}
      <div className="w-full flex">
        <Button
          className="w-64 h-16 m-auto my-4 bg-blue-400"
          size="large"
          variant="contained"
          onClick={onSave}
          disabled={node.predefined}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

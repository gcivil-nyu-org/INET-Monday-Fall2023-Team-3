import { Button, TextField } from "@mui/material";
import { ChangeEvent, useState } from "react";
import { BackendModels } from "src/utils/models";
import { Requests } from "src/utils/requests";

export type EditNodeProp = {
  node: BackendModels.INode | undefined;
  onSubmit: (id: string, node: Requests.Node.Patch) => void;
  onError: (message: string) => void;
};

export default function EditNode({ node, onSubmit, onError }: EditNodeProp) {
  const [name, setName] = useState(node?.name ?? "");
  const [description, setDescription] = useState(node?.description ?? "");

  const onNameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value.trim());
  };

  const onDescriptionInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onSaveButtonClicked = () => {
    if (name === "" || description === "") {
      onError("name or description cannot be empty!");
      return;
    }

    onSubmit(node?.id ?? "", {
      name,
      description,
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
          disabled={node?.predefined ?? true}
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
          disabled={node?.predefined ?? true}
          multiline
          rows={4}
        />
      </div>
      <div className="w-full flex">
        <Button
          className="w-64 h-16 m-auto my-4 bg-blue-400"
          size="large"
          variant="contained"
          onClick={onSaveButtonClicked}
          disabled={node?.predefined ?? true}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

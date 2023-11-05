import { useState, ChangeEvent } from "react";
import { Button, TextField, Alert, Typography } from "@mui/material";
import { INode } from "utils/models";
import { nodeCreate } from "utils/backendRequests";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Theme from "./Theme"; // Import your theme configuration

export type AddNodeProp = {
  predefinedNodes: INode[];
  onCanvasNodeIds: string[];
  onSubmit: (node: INode) => void;
  onError: (err: string) => void;
};

export default function AddNode({
  predefinedNodes,
  onCanvasNodeIds,
  onSubmit,
  onError,
}: AddNodeProp) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredNodes: INode[] = predefinedNodes
    ? predefinedNodes.filter((node) => node.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const onAddButtonClicked = (node: INode) => {
    onSubmit(node);
  };

  const onSearchChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const onNameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onDescriptionInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value);
  };

  const onSave = () => {
    const cleanName = name.trim();
    const cleanDescription = description.trim();

    if (cleanName === "") {
      setErrorMessage("name cannot be empty");
      return;
    }

    nodeCreate(
      { name: cleanName, description: cleanDescription },
      sessionStorage.getItem("token")!
    ).then((result) => {
      if (result.status) {
        onSubmit(result.value);
      } else {
        onError(result.error);
      }
    });
  };

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <div className="w-full flex">
        <div className="w-1/3 flex flex-col items-center bg-gray-200" style={{ flexGrow: 1 }}>
          <div className="h-24 w-full flex">
            <TextField
              className="h-16 m-4 flex-1"
              label="Search"
              variant="outlined"
              fullWidth
              onChange={onSearchChanged}
            />
          </div>
          <div
            className="w-full flex flex-col items-center bg-gray-200 overflow-y-auto max-h-[20rem]"
            style={{ flexGrow: 1 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 w-full">
              {filteredNodes.map((node) => {
                if (onCanvasNodeIds.includes(node.id)) {
                  return null; // Skip rendering if node's ID is in nodeIds
                }
                return (
                  <Button
                    className="flex items-center justify-center min-h-[6rem] min-w-[6rem] bg-white rounded-md p-4 text-center overflow-hidden mx-2"
                    key={node.name}
                    onClick={() => onAddButtonClicked(node)}
                  >
                    <span className="whitespace-normal text-sm">{node.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* AddNode Component */}
        <div className="w-2/3 flex flex-col items-center bg-white" style={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h3" className="w-full text-center my-4">
            Add Node
          </Typography>
          <div className="my-4 w-full flex">
            <TextField
              className="m-4 flex-1"
              label="Course Name"
              variant="outlined"
              onChange={onNameInputChanged}
              required
            />
          </div>
          <div className="w-full flex my-4">
            <TextField
              className="flex-1 mx-4 min-h-[6rem]"
              label="Description"
              variant="outlined"
              onChange={onDescriptionInputChanged}
              required
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
          <div className="w-full flex my-4">
            <Button
              className="w-64 h-16 m-auto bg-blue-400 my-4"
              size="large"
              variant="contained"
              onClick={onSave}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

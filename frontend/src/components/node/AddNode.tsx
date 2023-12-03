import { useState, ChangeEvent } from "react";
import { Button, TextField } from "@mui/material";
import { useCombinedStore } from "src/store/combinedStore";
import { useShallow } from "zustand/react/shallow";
import { Requests } from "src/utils/requests";

export type AddNodeProp = {
  onSubmit: (node: Requests.Node.Create) => void;
  onError: (message: string) => void;
};

export default function AddNode({ onSubmit, onError }: AddNodeProp) {
  const [graph, predefinedNodeMap] = useCombinedStore(
    useShallow((state) => [state.graph, state.predefinedNodeMap])
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [addNodeData, setAddNodeData] = useState({
    name: "",
    description: "",
  });

  const onSaveButtonClicked = () => {
    if (addNodeData.name === "") {
      onError("name cannot be empty");
      return;
    }

    onSubmit(addNodeData);
  };

  const onNameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setAddNodeData({
      ...addNodeData,
      name: event.target.value.trim(),
    });
  };

  const onDescriptionInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setAddNodeData({
      ...addNodeData,
      description: event.target.value.trim(),
    });
  };

  const onSearchTermInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const getSearchingNodes = () => {
    return Object.values(predefinedNodeMap).filter(
      (node) =>
        node.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !graph.nodes.some((existingNode) => existingNode.id === node.id)
    );
  };

  return (
    <div className="w-full flex flex-row max-h-[48rem]">
      <div className="w-1/3 flex flex-col items-center">
        <div className="h-14 w-full flex">
          <TextField
            label="Search"
            variant="filled"
            fullWidth
            onChange={onSearchTermInputChanged}
          />
        </div>
        <div className="w-full flex flex-col bg-gray-200 flex-1 overflow-y-scroll">
          {getSearchingNodes().map((node) => (
            <div className="w-full h-80 p-4">
              <div className="w-full h-64 leading-[16rem] text-center bg-white">{node.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-2/3 flex flex-col items-center">
        <div className="w-full flex p-8 pb-0">
          <TextField
            className="flex-1"
            label="Name"
            variant="outlined"
            onChange={onNameInputChanged}
          />
        </div>
        <div className="w-full flex p-8 pb-0">
          <TextField
            className="flex-1"
            label="Description"
            variant="outlined"
            multiline
            rows={12}
            onChange={onDescriptionInputChanged}
          />
        </div>
        <div className="flex flex-1"></div>
        <div className="w-full flex p-8 pb-0">
          <Button
            className="w-64 h-16 m-auto bg-blue-400 my-4"
            size="large"
            variant="contained"
            onClick={onSaveButtonClicked}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

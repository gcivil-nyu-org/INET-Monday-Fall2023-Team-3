import { useState, ChangeEvent } from "react";
import { Button, TextField } from "@mui/material";
import { useCombinedStore } from "src/store/combinedStore";
import { useShallow } from "zustand/react/shallow";
import { Requests } from "src/utils/requests";

export type AddNodeProp = {
  onSubmitPredefinedNode: (id: string) => void;
  onSubmit: (node: Requests.Node.Create) => void;
  onError: (message: string) => void;
};

export default function AddNode({ onSubmit, onError, onSubmitPredefinedNode }: AddNodeProp) {
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
    <div className="w-full flex flex-row max-h-screen bg-beige overflow-hidden">
      <div className="w-1/3 flex flex-col items-center overflow-y-scroll">
        <div className="h-14 w-full flex sticky top-0 z-10">
          <TextField
            label="Search"
            variant="filled"
            fullWidth
            onChange={onSearchTermInputChanged}
          />
        </div>
        <div className="w-full flex flex-col bg-gray-200 flex-1">
          {getSearchingNodes().map((node) => (
            <div key={node.id} className="w-full h-28 p-6 cursor-pointer">
              <div className="w-full h-20 text-center bg-white" onClick={() => onSubmitPredefinedNode(node.id)}>
                {node.name}
              </div>
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
            rows={10}
            onChange={onDescriptionInputChanged}
          />
        </div>
        <div className="w-full flex m-8 pb-0">
          <Button
            className="w-64 h-16 m-auto bg-beige text-olive border-2 border-solid rounded-full"
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

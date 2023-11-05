import { useState, ChangeEvent } from "react";
import { Button, Alert, TextField, List, ListItem } from "@mui/material";

import { INode } from "utils/models";

export type AddPredefinedNodeProp = {
  predefinedNodes: INode[];
  onCanvasNodeIds: string[];
  onSubmit: (node: INode) => void;
  onClose: () => void;
};

export default function AddPredefinedNode({
  predefinedNodes,
  onCanvasNodeIds,
  onSubmit,
  onClose,
}: AddPredefinedNodeProp) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredNodes: INode[] = predefinedNodes
    ? predefinedNodes.filter((node) => node.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const onAddButtonClicked = (node: INode) => {
    onSubmit(node);
  };
  const onSearchChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="w-full flex flex-col items-center bg-white">
      <div className="h-24 w-full flex">
        <TextField
          className="h-16 m-4 flex-1"
          label="Search"
          variant="outlined"
          fullWidth
          onChange={onSearchChanged}
        />
      </div>
      <div className="w-full flex flex-col items-center bg-white overflow-y-auto max-h-[19rem] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {filteredNodes.map((node) => {
            if (onCanvasNodeIds.includes(node.id)) {
              return null; // Skip rendering if node's ID is in nodeIds
            }
            return (
              <Button
                className="flex items-center justify-center min-h-[6rem] min-w-[8rem] bg-gray-200 rounded-md p-4 text-center overflow-hidden"
                key={node.name}
                onClick={() => onAddButtonClicked(node)}
              >
                <span className="whitespace-normal text-sm">{node.name}</span>
              </Button>
            );
          })}
        </div>
      </div>
      <div className="h-24 w-full flex">
        <Button
          className="w-64 h-16 m-auto bg-blue-400"
          size="large"
          variant="contained"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

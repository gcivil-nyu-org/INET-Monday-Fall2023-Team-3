import { Handle, Position } from "reactflow";
import React, { useState, useEffect } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { BackendModels } from "src/utils/models";
import { useCombinedStore } from "src/store/combinedStore";
import { useShallow } from "zustand/react/shallow";

export type SmoothNodeProp = {
  data: BackendModels.INode;
};

export default function SmoothNode({ data }: SmoothNodeProp) {
  const {
    user,
    graph,
  } = useCombinedStore(
    useShallow((state) => ({
      user: state.user,
      graph: state.graph,
    }))
  );
  const disabled = user.email !== graph.createdBy;
  const nodeId = data.id;
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [nodeColor, setNodeColor] = useState<string>(() => {
    // Retrieve the color from local storage, default to blue if not present
    return localStorage.getItem(nodeId) || "#87CEEB";
    // this allows you to save the color of each node
  });

  useEffect(() => {
    // Update local storage when nodeColor changes
    localStorage.setItem(nodeId, nodeColor);
  }, [nodeId, nodeColor]);

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) {
      return undefined;
    }
    event.preventDefault();

    // Check if the right mouse button was clicked. 2 refers to right click
    if (event.button === 2) {
      setMenuAnchor(event.currentTarget);
    }
  };

  // note: the same predefined node in all your graphs will change color together
  const handleColorSelect = (color: string) => {
    // Update the node color
    setNodeColor(color);
    console.log("new color is: " + nodeColor);
    // Close the menu
    setMenuAnchor(null);
  };

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Paper
        elevation={3}
        style={{ backgroundColor: nodeColor }}
        className="p-4 rounded-md"
        onContextMenu={handleContextMenu}
      >
        <Typography variant="h6" component="h3">
          {data.name}
        </Typography>
      </Paper>
      <Handle type="source" position={Position.Bottom} />

      {/* Color Picker Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => setMenuAnchor(null)}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <MenuItem onClick={() => handleColorSelect("#87CEEB")}>
          Regular
          <span
            style={{
              width: "10px",
              height: "10px",
              marginRight: "8px",
              backgroundColor: "#87CEEB",
              borderRadius: "50%",
              display: "inline-block",
              margin: "5px",
            }}
          ></span>
        </MenuItem>
        <MenuItem onClick={() => handleColorSelect("#FFA500")}>
          Urgent
          <span
            style={{
              width: "10px",
              height: "10px",
              marginRight: "8px",
              backgroundColor: "#FFA500",
              borderRadius: "50%",
              display: "inline-block",
              margin: "5px",
            }}
          ></span>
        </MenuItem>
        <MenuItem onClick={() => handleColorSelect("#808080")}>
          Done
          <span
            style={{
              width: "10px",
              height: "10px",
              marginRight: "8px",
              backgroundColor: "#808080",
              borderRadius: "50%",
              display: "inline-block",
              margin: "5px",
            }}
          ></span>
        </MenuItem>
      </Menu>
    </>
  );
}

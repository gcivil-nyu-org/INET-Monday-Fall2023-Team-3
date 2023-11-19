import { Handle, Position } from "reactflow";
import React, {useState} from "react";
import { INode } from "utils/models";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export type SmoothNodeProp = {
  data: INode;
};

export default function SmoothNode({ data }: SmoothNodeProp) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [nodeColor, setNodeColor] = useState<string>('#87CEEB'); // Initial color is blue

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();

    // Check if the right mouse button was clicked. 2 refers to right click
    if (event.button === 2) {
      setMenuAnchor(event.currentTarget);
    }
  };

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
        style = {{backgroundColor: nodeColor}}
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
      >
        <MenuItem onClick={() => handleColorSelect('#87CEEB')}>Blue</MenuItem>
        <MenuItem onClick={() => handleColorSelect('#FFA500')}>Orange</MenuItem>
        <MenuItem onClick={() => handleColorSelect('#808080')}>Gray</MenuItem>
      </Menu>
    </>
  );
}

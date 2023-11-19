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

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();

    // Check if the right mouse button was clicked
    if (event.button === 2) {
      setMenuAnchor(event.currentTarget);
    }
  };

  const handleColorSelect = (color: string) => {
    // Implement logic to update the node color based on the selected color
    // ...

    // Close the menu
    setMenuAnchor(null);
  };


  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Paper
        elevation={3}
        style = {{backgroundColor: '#87CEEB'}}
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
        <MenuItem onClick={() => handleColorSelect('#87CEEB')}>Sky Blue</MenuItem>
        {/* Add more color options as needed */}
      </Menu>
    </>
  );
}

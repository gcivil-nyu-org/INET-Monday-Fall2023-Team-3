import { Handle, Position } from "reactflow";

import { INode } from "utils/models";

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

export type SmoothNodeProp = {
  data: INode;
};

export default function SmoothNode({ data }: SmoothNodeProp) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Paper elevation={3} className="p-4 rounded-md bg-white">
        <Typography variant="h6" component="h3">
          {data.name}
        </Typography>
      </Paper>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}

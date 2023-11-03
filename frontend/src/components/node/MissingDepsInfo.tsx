import { useState, ChangeEvent } from "react";
import {
  Button,
  Alert,
  Stack,
  TextField,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogContent,
} from "@mui/material";
import { IMissingDependency } from "utils/models";

export type MissingDepsInfoProp = {
  missingDeps: IMissingDependency[];
};

export default function MissingDepsInfo({ missingDeps }: MissingDepsInfoProp) {
  return (
    <div className="w-full flex flex-col items-center bg-white">
      <DialogContent dividers>
        <Stack spacing={2}>
          {missingDeps.map((dep, index) => (
            <Alert key={index} severity="error" variant="outlined">
              {`${dep.nodeName} is missing prerequisite course: ${dep.missingDep}`}
            </Alert>
          ))}
        </Stack>
      </DialogContent>
    </div>
  );
}

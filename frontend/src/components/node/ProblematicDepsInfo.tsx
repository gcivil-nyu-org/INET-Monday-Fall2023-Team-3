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
import { IMissingDependency, IWrongDepedency } from "utils/models";

export type ProblematicDepsInfoProp = {
  missingDeps: IMissingDependency[];
  wrongDeps: IWrongDepedency[];
};

export default function ProblematicDepsInfo({ missingDeps, wrongDeps }: ProblematicDepsInfoProp) {
  return (
    <div className="w-full flex flex-col items-center bg-white">
      <DialogContent dividers>
        <Stack spacing={2}>
          {missingDeps.map((dep, index) => (
            <Alert key={index} severity="error" variant="outlined">
              {`${dep.nodeName} is missing prerequisite course: ${dep.missingDep}`}
            </Alert>
          ))}
          {wrongDeps.map((dep, index) => (
            <Alert key={index} severity="error" variant="outlined">
              {`The dependency between ${dep.sourceName} and ${dep.targetName} is reversed`}
            </Alert>
          ))}
        </Stack>
      </DialogContent>
    </div>
  );
}

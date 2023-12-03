import { Alert, DialogContent, Stack } from "@mui/material";

export type IFaultyDependency = {
  reason: "missing" | "wrong";
  cause: "node" | "edge";
  sourceName: string;
  targetName: string;
};

type FaultyDependencyProp = {
  faultyDependencies: IFaultyDependency[];
};

export default function FaultyDependency({ faultyDependencies }: FaultyDependencyProp) {
  return (
    <div className="w-full flex flex-col items-center bg-white">
      <DialogContent dividers>
        <Stack spacing={2}>
          {faultyDependencies.map((faultyDependency, index) => (
            <Alert key={index} severity="error" variant="outlined">
              {`${faultyDependency.reason} ${faultyDependency.cause}: ${
                faultyDependency.cause === "node"
                  ? `dependency ${faultyDependency.targetName} of ${faultyDependency.sourceName}`
                  : `from ${faultyDependency.sourceName} to ${faultyDependency.targetName}`
              }`}
            </Alert>
          ))}
        </Stack>
      </DialogContent>
    </div>
  );
}

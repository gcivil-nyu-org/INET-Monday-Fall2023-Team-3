import { BackendModels } from "src/utils/models";
import GraphEntry from "./GraphEntry";
import { Button } from "@mui/material";
import { useState } from 'react';

export type GraphListProp = {
  name: string;
  graphs: BackendModels.IGraph[];
};

export default function GraphList({ name, graphs }: GraphListProp) {
  const [edit, setEdit] = useState(false);

  const onEditClicked = () => {
    console.log("edit is clicked!");
    setEdit(true);

  };

  const onDoneClicked = () => {
    console.log("done is clicked!");
    setEdit(false);
  }

  return (
    <div className="flex flex-col self-stretch">
      <div className="h-16 m-4">
        <span className="text-lg">{name}</span>
        { !edit &&
        <Button className="h-16 w-16 p-2 rounded-lg bg-white bg-opacity-60" onClick={onEditClicked}>
          Edit
        </Button>
        }
        { edit &&
        <Button className="h-16 w-16 p-2 rounded-lg bg-white bg-opacity-60" onClick={onDoneClicked}>
          Done
        </Button>
        }
      </div>
      <div className="flex flex-1 flex-row min-h-[16rem]">
        {graphs.map((graph) => (
          <div className="h-64 w-64 flex m-4" key={graph.id}>
            <GraphEntry graph={graph} edit={edit} />
          </div>
        ))}
      </div>
    </div>
  );
}

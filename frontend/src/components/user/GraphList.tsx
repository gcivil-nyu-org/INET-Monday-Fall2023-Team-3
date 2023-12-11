import { BackendModels } from "src/utils/models";
import GraphEntry from "./GraphEntry";
import { Button } from "@mui/material";
import { useState } from 'react';
import { useCombinedStore } from "src/store/combinedStore";
import { useShallow } from "zustand/react/shallow";

export type GraphListProp = {
  name: string;
  graphs: BackendModels.IGraph[];
};

export default function GraphList({ name, graphs }: GraphListProp) {
  const [edit, setEdit] = useState(false);
  // const disabled = name === "SHARED GRAPHS";
  const disabled = false;
  const onEditClicked = () => {
    console.log("edit is clicked!");
    setEdit(true);
  };
  const user = useCombinedStore(
    useShallow((state) => state.user)
  );

  const onDoneClicked = () => {
    console.log("done is clicked!");
    setEdit(false);
  }


  return (
    <div className="flex flex-col self-stretch">
      <div className="h-16 ml-4 mt-2">
        <span className="text-2xl">{name}</span>
        {!disabled && !edit &&
          <Button className="h-10 w-20 p-2 rounded-3xl font-sans rounded-full
        border-2 border-solid border-olive text-olive m-5" onClick={onEditClicked}>
            Edit
          </Button>
        }
        {edit &&
          <Button className="h-10 w-20 p-2 rounded-3xl font-sans rounded-full
        border-2 border-solid border-olive text-olive m-5" onClick={onDoneClicked}>
            Done
          </Button>
        }
      </div>
      {/* <div className="flex flex-1 flex-row overflow-x-auto min-h-[16rem]">
        {graphs.map((graph, index) => (
          <div key={graph.id}>
            <GraphEntry graph={graph} edit={edit} index={index} />
          </div>
        ))}
      </div> */}
      <div className="flex flex-1 flex-row overflow-x-auto min-h-[16rem] m-0">
        {graphs.map((graph, index) => (
          <div key={graph.id}>
            <GraphEntry graph={graph} edit={edit} index={index} />
          </div>
        ))}
      </div>
    </div>
  );
}

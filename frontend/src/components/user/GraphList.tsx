import GraphEntry, { GraphEntryProp } from "./GraphEntry";
import { Button } from "@mui/material";

export type GraphListProp = {
  name: string;
  graphs: GraphEntryProp[];
};

export default function GraphList({ name, graphs }: GraphListProp) {
  const onEditClicked = () => {
    console.log("edit clicked");
  };

  return (
    <div className="flex flex-col self-stretch">
      <div className="h-16 m-4">
        <span className="text-lg">{name}</span>
        <Button className="h-16 w-16 p-2 rounded-lg bg-white bg-opacity-60" onClick={onEditClicked}>
          Edit
        </Button>
      </div>
      <div className="flex flex-1 flex-row">
        {graphs.map((graph) => (
          <div className="h-64 w-64 flex m-4" key={graph.id}>
            <GraphEntry id={graph.id} title={graph.title} imgUrl={graph.imgUrl} />
          </div>
        ))}
      </div>
    </div>
  );
}

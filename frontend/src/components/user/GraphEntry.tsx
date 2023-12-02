import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useCombinedStore } from "src/store/combinedStore";
import { BackendModels } from "src/utils/models";
import { useShallow } from "zustand/react/shallow";

export type GraphEntryProp = {
  graph: BackendModels.IGraph;
};

export default function GraphEntry({ graph }: GraphEntryProp) {
  const user = useCombinedStore((state) => state.user);
  const displayName = user.email == graph.createdBy ? "" : "@" + graph.createdBy;
  const imgUrl =
    "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg";
  const navigate = useNavigate();
  const setGraph = useCombinedStore((state) => state.setGraph);

  const onGraphClicked = () => {
    console.log(`navigating to graph ${graph.title}`);
    console.log(`navigating to ${graph.id}`);
    // use store to persist graph id
    setGraph(graph);
    navigate(`/graph`);
  };

  return (
    <div className="flex flex-1" onClick={onGraphClicked}>
      <Card className="relative">
        <CardHeader title={graph.title + displayName}></CardHeader>
        <CardContent>
          <IconButton color="error" className="absolute top-1 right-1">
            <DeleteForeverIcon onClick={() => console.log("delete button clicked")} />
          </IconButton>
          <img src={imgUrl} alt="graph" />
        </CardContent>
      </Card>
    </div>
  );
}

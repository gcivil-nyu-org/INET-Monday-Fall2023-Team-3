import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, IconButton } from "@mui/material";
import { RequestMethods } from "src/utils/utils";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useCombinedStore } from "src/store/combinedStore";
import { BackendModels } from "src/utils/models";
import { useShallow } from "zustand/react/shallow";

export type GraphEntryProp = {
  graph: BackendModels.IGraph;
  edit: boolean;
};

export default function GraphEntry({ graph, edit }: GraphEntryProp) {
  const imgUrl =
    "https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg";
  const navigate = useNavigate();
  const {
    user,
    setUser,
    token,
    createdGraphs,
    sharedGraphs,
    setGraph,
  } = useCombinedStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
      token: state.token,
      createdGraphs: state.createdGraphs,
      sharedGraphs: state.sharedGraphs,
      setGraph: state.setGraph,
    }))
  );
  const disabled = user.email !== graph.createdBy;
  const displayName = user.email === graph.createdBy ? "" : "@" + graph.createdBy;

  const onGraphClicked = () => {
    console.log(`navigating to graph ${graph.title}`);
    console.log(`navigating to ${graph.id}`);
    // use store to persist graph id
    setGraph(graph);
    navigate(`/graph`);
  };

  const onDeleteClicked = async (_event: React.MouseEvent) => {
    // Prevent getting redirected to the graph page
    _event.stopPropagation();
    console.log("delete button clicked");
    // there needs to be an if statement to tell whether ur own graph or a shared graph is being deleted
    // for now just assume it's ur own graph
    console.log(graph.id);
    console.log("Combined store state before delete:", useCombinedStore.getState())

    const deleteGraphResult = await RequestMethods.graphDelete({
      param: graph.id,
      token,
    });

    if (deleteGraphResult.status) {
      console.log("delete succeeded");
      console.log("created graphs are", createdGraphs);
      const postDeletionGraphs = createdGraphs.filter((g) => g.id != graph.id)
      console.log("post deletion graphs are", postDeletionGraphs);
      setUser({
        createdGraphs: postDeletionGraphs.map(graph => graph.id)
      })
    }
    else {
      console.log("delete failed ", deleteGraphResult);
    }
  };


  return (
    <div className="flex flex-1" onClick={onGraphClicked}>
      <Card className="relative">
        <CardHeader title={graph.title + displayName}></CardHeader>
        <CardContent>
          {edit &&
          <IconButton color="error" className="absolute top-1 right-1" onClick={onDeleteClicked}>
            <DeleteForeverIcon />
          </IconButton>
          }
          <img src={imgUrl} alt="graph" />
        </CardContent>
      </Card>
    </div>
  );
}

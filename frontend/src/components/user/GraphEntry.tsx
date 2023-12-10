import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, IconButton } from "@mui/material";
import { RequestMethods } from "src/utils/utils";
import ClearIcon from '@mui/icons-material/Clear';
import { useCombinedStore } from "src/store/combinedStore";
import { BackendModels } from "src/utils/models";
import { useShallow } from "zustand/react/shallow";
import { useState, useEffect } from 'react';

export type GraphEntryProp = {
  graph: BackendModels.IGraph;
  edit: boolean;
  index: number;
};

export default function GraphEntry({ graph, edit, index }: GraphEntryProp) {
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
  // const displayName = user.email === graph.createdBy ? "" : "@" + graph.createdBy;

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

  const colors = ['#F3AC42', '#FCF071', '#90D5D9', '#F2ADBE', '#9EDF76'];

  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  const getColor = (index: number) => {
    const color = colors[index % 5];
    console.log("picked random color", color);
    return color;
  }

  // const getNextColor = () => {
  //   const nextIndex = (currentColorIndex + 1) % colors.length;
  //   return colors[nextIndex];
  // };

  // useEffect(() => {
  //   setCurrentColorIndex(prevIndex => (prevIndex + 1) % colors.length);
  // }, []);

  const getcardStyle = () => {
    return {
      backgroundColor: getColor(index),
    }
  }

  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col h-64 w-64 m-4 overflow-auto flex-shrink-0 cursor-pointer" onClick={onGraphClicked}>
      <div className=""
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      >
        <Card className="relative m-4" style={getcardStyle()}>
          <CardHeader
            className="text-olive"
            titleTypographyProps={{ style: { fontFamily: "Archivo Black", textAlign: "center" } }}
            title={graph.title}>
          </CardHeader>
          <CardContent>
            {edit &&
              <IconButton color="default" className="absolute top-1 right-1" onClick={onDeleteClicked}>
                <ClearIcon />
              </IconButton>
            }
            <img src={imgUrl} alt="graph" />
          </CardContent>
        </Card>
      </div>
      {graph.createdBy !== user.email && showInfo && <div
      className="top-0 left-0 right-0 bottom-0 bg-gray-800 text-white p-4 transition-opacity">
      shared by {graph.createdBy}</div>}
    </div >
  );
}

import { Card, CardContent, CardHeader, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { graphGet } from "utils/backendRequests";
import { useState } from "react";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';


export type IGraphEntryProp = {
  id: string;
  title: string;
  imgUrl: string;
};



export default function GraphEntry({ id, title, imgUrl }: IGraphEntryProp) {
  const navigate = useNavigate();
  const [closeButton, setcloseButton] = useState(false);

  const onGraphClicked = () => {
    console.log(`redirect to graph`);
    graphGet(id, sessionStorage.getItem("token")!).then((result) => {
      if (result.status) {
        const graph = result.value;
        navigate("/graph", { state: { graph } });
      } else {
        console.log("could not get graph");
      }
    });
  };
    /*
    TODO:
      1. redirect to graph
      2. Restore the variables in the graph page to the state they
         were in when this graph was saved.
    */

  return (
    <div className="flex flex-1" onClick={onGraphClicked}>
      <Card className="relative">
        <CardHeader title={title}></CardHeader>
        <CardContent>
          <IconButton color="error" className="absolute top-1 right-1">
              <DeleteForeverIcon
                onClick={() => console.log("delete button clicked")}
              />
          </IconButton>
          <img src={imgUrl} alt="graph" />
        </CardContent>
      </Card>
    </div>
  );
}

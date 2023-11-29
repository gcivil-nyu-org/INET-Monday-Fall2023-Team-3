import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, IconButton } from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export type GraphEntryProp = {
  id: string;
  title: string;
  imgUrl: string;
};

export default function GraphEntry({ id, title, imgUrl }: GraphEntryProp) {
  const navigate = useNavigate();

  const onGraphClicked = () => {
    console.log(`navigating to graph ${title}`);
    console.log(`navigating to ${id}`);
    // this will persist the graph state in url
    // will not lose after refresh
    // graph endpoint should handle get graph
    navigate(`/graph/${id}/`);
  };

  return (
    <div className="flex flex-1" onClick={onGraphClicked}>
      <Card className="relative">
        <CardHeader title={title}></CardHeader>
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

import { Button, Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  const onBackHomeButtonClicked = () => {
    navigate("/");
  }
  return (
    <div className="bg-beige w-full h-full overflow-hidden">
      <div className="bg-beige flex flex-col w-full">
        <div className="basis-1/6 m-5">
          <Button
            className="bg-beige text-olive font-sans rounded-full
              border-2 border-solid"
            size="large"
            variant="contained"
            onClick={onBackHomeButtonClicked}
          >
            Back Home
          </Button>
        </div>
        <div className="basis-5/6 m-5 flex flex-row w-full">
          <div className="flex flex-col h-80 w-full bg-pink mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">Yulin</h2>
            <Avatar className="w-16 h-16 place-self-center" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/039.png" />
          </div>
          <div className="flex flex-col h-80 w-full bg-green mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">Layla</h2>
            <Avatar className="w-16 h-16 place-self-center" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png" />
          </div>
          <div className="flex flex-col h-80 w-full bg-orange mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">Sahil</h2>
            <Avatar className="w-16 h-16 place-self-center" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png" />
          </div>
          <div className="flex flex-col h-80 w-full bg-yellow  mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">Siyan</h2>
            <Avatar className="w-16 h-16 place-self-center" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/054.png" />
          </div>
          <div className="flex flex-col h-80 w-full bg-blue mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">Haoliang</h2>
            <Avatar className="w-16 h-16 place-self-center" src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png" />
          </div>
        </div>
      </div>

    </div>
  )
}

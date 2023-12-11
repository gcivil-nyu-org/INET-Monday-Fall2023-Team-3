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
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">YULIN</h2>
            <Avatar className="w-20 h-20 place-self-center border-olive p-1"
            src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/039.png"/>
          </div>
          <div className="flex flex-col w-full bg-green mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">LAYLA</h2>
            <Avatar className="w-20 h-20 place-self-center border-olive p-1"
            src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/001.png" />
            <p className="m-5">
              Hiiiii!!! This is Layla! I'm currently in my second year as a Financial Engineering student
              and have had a fantastic experience with this course. Also, a fun fact about me: I've recently
              developed a passion for tattoos, having gotten three within the past month😆 !
            </p>
          </div>
          <div className="flex flex-col h-80 w-full bg-orange mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">SAHIL</h2>
            <Avatar className="w-20 h-20 place-self-center border-olive p-1"
            src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png"/>
          </div>
          <div className="flex flex-col w-full bg-yellow  mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">SIYAN</h2>
            <Avatar className="w-20 h-20 place-self-center border-olive p-1"
            src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/054.png"/>
            <p className="m-5">
              Hello! My background is in neuroscience, philosophy, and design, now
              studying CS to thread everything together! I'm so proud of this project
              from conception to delivery. My side endeavor these days is building an
              interactive personal blog where I vent about how all of my sufferings come
              from the fact that the human perception of time is a fusiform.
            </p>
          </div>
          <div className="flex flex-col h-80 w-full bg-blue mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">HAOLIANG</h2>
            <Avatar className="w-20 h-20 place-self-center border-olive p-1"
            src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png"/>
          </div>
        </div>
      </div>

    </div>
  )
}

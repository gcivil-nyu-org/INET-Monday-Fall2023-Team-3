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
        <div className="1/6 m-5 flex flex-row items-center">
          <span className="font-sans text-olive text-2xl">TEAM MEMBERS</span>
          <span className="h-12 w-12 ml-5">
            <a href="https://github.com/gcivil-nyu-org/INET-Monday-Fall2023-Team-3">
              <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png"
                alt="github repository">
              </img>
            </a>
          </span>
          <span className="h-12 w-12 ml-5">
            <a href="http://smooth-dev.us-west-2.elasticbeanstalk.com/">
              <img src="https://www.svgrepo.com/show/354521/vitejs.svg" alt="live site">
              </img>
            </a>
          </span>
        </div>
        <div className="basis-4/6 m-5 flex flex-row w-full">
          <div className="flex flex-col w-full bg-pink mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">YULIN</h2>
            <Avatar className="w-20 h-20 place-self-center border-olive p-1"
              src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/039.png" />
            <p className="m-5">
              Hi, this is Yulin! I am first-year master student at NYU MSCS, and previouly I finished my BS in CS from FDU.
              I am a tech lover and AI enthusiast, and I am passionate about building cool and Impactful software. 
              It's a great journey to collaborate with my lovely teammates, and I've learned a lot from both my teammates and the project.
            </p>
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
          <div className="flex flex-col w-full bg-orange mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">SAHIL</h2>
            <Avatar className="w-20 h-20 place-self-center border-olive p-1"
              src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png" />
            <p className="m-5">
            Hi! I am Sahil, a first-year master’s student majoring in computer science.
            I have had a great experience working on this project with my teammates and learning new concepts.
            My hobbies include watching documentaries, and videos on history, technology, etc. I enjoy traveling,
            adventure sports, and spending time with my friends.
            </p>
          </div>
          <div className="flex flex-col w-full bg-yellow mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">SIYAN</h2>
            <Avatar className="w-20 h-20 place-self-center border-olive p-1"
              src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/054.png" />
            <p className="m-5">
              Hello! My background is in neuroscience, philosophy, and design, now
              studying CS to thread everything together! I'm so proud of this project
              from conception to delivery. My side endeavor these days is building an
              interactive personal blog where I vent about how all of my sufferings come
              from the fact that the human perception of time is a fusiform.
            </p>
          </div>
          <div className="flex flex-col w-full bg-blue mb-10 mr-10 shadow-lg">
            <h2 className="mt-5 ml-5 font-sans text-olive text-2xl">HAOLIANG</h2>
            <Avatar className="w-20 h-20 place-self-center border-olive p-1"
              src="https://assets.pokemon.com/assets/cms2/img/pokedex/full/007.png" />
            <p className="m-5">
              Hi, my name is Haoliang Zhang. My background is UCSD Math-CS B.A., NYU CS M.A..
              This project gives me a lot of valuable experiences about frontend and backend development.
              I also learned a lot from my teammates. Very cool experience!
            </p>
          </div>
        </div>
      </div>

    </div>
  )
}

import { useState } from "react";
import { Button, Dialog, DialogTitle } from "@mui/material";

import Login from "src/components/login/Login";
import SignUp from "src/components/signup/SignUp";
import UserStory from "src/components/custom/UserStory";
import { useNavigate } from "react-router-dom";

export default function Welcome() {
  const [login, setLogin] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const navigate = useNavigate();

  const onLoginButtonClicked = () => {
    console.log("login button clicked");
    setLogin(true);
    setSignUp(false);
  };
  const onSignUpButtonClicked = () => {
    console.log("sign up button clicked");
    setLogin(false);
    setSignUp(true);
  };
  const onAboutButtonClicked = () => {
    console.log("about button clicked!");
    navigate("/about");
  };
  const onCancel = () => {
    console.log("cancelled");
    setLogin(false);
    setSignUp(false);
  };

  const [userStory1, setUserStory1] = useState(false);
  const [userStory2, setUserStory2] = useState(false);
  const [userStory3, setUserStory3] = useState(false);

  return (
    <div className="bg-beige w-full h-full overflow-hidden">
      <div className="bg-beige flex flex-row w-full">
        <div className="basis-1/2 m-5 flex-wrap">
          <div className="font-sans font-bold text-3xl">
            <span className="text-blue">SMOOTH</span>
            <span className="text-olive"> IS A </span>
            <span className="text-pink">TASK AND DEPENDENCY</span>
            <span className="text-olive"> MANAGEMENT TOOL DESIGNED TO STREAMLINE </span>
            <span className="text-green">CURRICULUM PLANNING</span>
            <span className="text-olive"> AT NYU. USERS CAN CREATE NODES REPRESENTING </span>
            <span className="text-orange">TASKS OR COURSES</span>
            <span className="text-olive"> AND ESTABLISH DEPENDENCIES BETWEEN THEM BY DRAWING EDGES. </span>
          </div>
        </div>
        <div className="flex flex-col basis-1/2">
          <div className="flex flex-row-reverse w-full">
            <div className="mt-5 mr-5">
              <Button
                className="bg-beige text-olive font-sans rounded-full
              border-2 border-solid"
                size="large"
                variant="contained"
                onClick={onLoginButtonClicked}
              >
                Log In
              </Button>
            </div>
            <div className="mt-5 mr-5">
              <Button
                className="bg-beige text-olive font-sans rounded-full
              border-2 border-solid"
                size="large"
                variant="contained"
                onClick={onSignUpButtonClicked}
              >
                Sign Up
              </Button>
            </div>
            <div className="mt-5 mr-5">
              <Button
                className="bg-beige text-olive font-sans rounded-full
              border-2 border-solid"
                size="large"
                variant="contained"
                onClick={onAboutButtonClicked}
              >
                About
              </Button>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <span className="bg-orange">...</span>
            <span className="bg-pink">....</span>
            <span className="bg-green">....</span>
            <span className="bg-yellow">....</span>
            <span className="bg-blue">....</span>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full mt-20">
        <UserStory
          title="COURSE PLANNING"
          content="Tommy is a freshman at NYU. He’s a talented student with ADHD -
            doing research and building things come relatively easy to Tommy,
            but he can’t manage complex, administrative tasks like devising a course plan,
            deciding where to live, etc., because those things depend on a thousand other
            things and deadlines! Tommy sits down to read the 100 emails NYU has sent him regarding
            the upcoming course registration cycle,
            and soon gets burned out by the complex interdependencies between prerequites, timeline,
            major declaration, graduation, and so on.
            He gives up and picks random courses that he has little
            interest in and that don’t fit with his career ambitions. Fresh out of high school, losing
            all the support from his parents, missing the pre-fabricated ‘track and order’ that
            his old life used to provide, Tommy soon becomes overwhelmed and eventually depressed.
            Our app is designed to help Tommy stay calm and manage the overwhelming complexity!"
          bgColor="yellow"
          rotate="-rotate-20"
        />
        <UserStory
          title="PRODUCT MANAGEMENT"
          content="Alisha is a product manager at a tech company.
            The swiss knife of her team, Alisha’s job involves talking to people in different roles
            and bringing their visions together. She’s experienced with using productivity softwares
            to manage her thousand tasks and priorities. However, Alisha longs for a simple, Zen-infused
            application that allows her to simply input a task and its prerequisites, and the
            application gives her an interactive graph for her to visualize how the tasks are streamlined.
            She can modify
            the task names and descriptions, mark tasks as done, regular, or urgent, and have an intuitive
            sense of her progress. Our app is built as the perfect tool for Alisha!"
          bgColor="pink"
          rotate="rotate-15"
        />
        <UserStory
          title="COURSE DESIGN"
          content="Colt is an NYU alum and teaches asynchronous online courses.
            One of the biggest challenges Colt faces when designing his course material is that he
            doesn’t know when to present a certain material. For example, in the full stack Web Development
            course he teaches, the materials range from HTML to react, node, and mongoDB. There are so many
            pieces of information that hinge on each other, oftentimes not in a modularized, clean way.
            Another challenge comes from the students’ side: many people come in with some prior experience
            in web development, and they want to know which lessons they can skip. If Colt has a topographically
            sorted node graph, where each node represents a piece of knowledge, then he can use the graph to best
            design the order of his video lessons. His students, too, can use the graph to test themselves out and
            only learn the nodes they haven’t mastered yet."
          bgColor="blue"
          rotate="-rotate-20"
        />
      </div>
      <div className="w-full flex flex-row self-stretch items-stretch justify-between flex-1">
        <Dialog className="border-solid border-2" open={login || signUp} onClose={onCancel} maxWidth="sm" fullWidth={true}>
          {/* style don't work on Dialog  */}

          {login && ( // if login is true, then render the Login component
            <div className="bg-beige">
              <DialogTitle className="font-sans">Log In</DialogTitle>
              <Login />
            </div>
          )}
          {signUp && ( // if signup is true, then render the Signup component
            <div className="bg-beige">
              <DialogTitle className="font-sans">Sign Up</DialogTitle>
              <SignUp />
            </div>
          )}
        </Dialog>
      </div>
    </div>
  );
}

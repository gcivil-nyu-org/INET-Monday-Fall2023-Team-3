import { useState } from "react";
import { Button, Dialog, DialogTitle } from "@mui/material";

import Login from "src/components/login/Login";
import SignUp from "src/components/signup/SignUp";

export default function Welcome() {
  const [login, setLogin] = useState(false);
  const [signUp, setSignUp] = useState(false);

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
  const onCancel = () => {
    console.log("cancelled");
    setLogin(false);
    setSignUp(false);
  };

  return (
    <div className="bg-beige w-full h-full overflow-hidden">
      <div className="bg-beige flex flex-row w-full">
        <div className="basis-1/2 m-5">
          <div className="font-sans text-3xl">
            <span className="text-yellow">SMOOTH</span>
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
        <div className="w-4/12 h-80 bg-blue m-0 shadow-lg -rotate-20">
          <p className="m-5 font-sans text-olive text-xl">User Case</p>
        </div>
        <div className="w-3/12 h-96 bg-pink m-0 shadow-lg rotate-15">
          <p className="m-5 font-sans text-olive text-xl">User Case</p>
        </div>
        <div className="w-4/12 h-80 bg-yellow m-5 shadow-lg -rotate-20">
          <p className="m-5 font-sans text-olive text-xl">User Case</p>
        </div>
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

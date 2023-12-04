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
    // <div className="w-full h-full flex flex-col min-h-screen items-center justify-between">
    //   <div className="w-full flex h-24 flex-row bg-slate-100">
    //     <div className="flex h-24 flex-row">
    //       <div className="h-16 w-16 bg-slate-400 m-4"></div>
    //       <div className="h-16 m-4">
    //         <span className="h-16 flex items-center justify-center text-center m-auto text-lg">
    //           SMOOTH
    //         </span>
    //       </div>
    //     </div>

    //     <div className="flex h-24 flex-row ml-auto">
    //       <div className="flex h-16 m-4">
    //         <Button
    //           className="w-60 mr-4 bg-gray-500"
    //           size="large"
    //           variant="contained"
    //           onClick={onSignUpButtonClicked}
    //         >
    //           Sign Up
    //         </Button>
    //         <Button
    //           className="w-60 bg-blue-400"
    //           size="large"
    //           variant="contained"
    //           onClick={onLoginButtonClicked}
    //         >
    //           Log In
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="w-full flex flex-row self-stretch items-stretch justify-between flex-1">
    //     <div className="flex flex-1 bg-gray-500"></div>
    //     <Dialog open={login || signUp} onClose={onCancel} maxWidth="sm" fullWidth={true}>
    //       {login && ( // if login is true, then render the Login component
    //         <>
    //           <DialogTitle>Log In</DialogTitle>
    //           <Login />
    //         </>
    //       )}
    //       {signUp && ( // if signup is true, then render the Signup component
    //         <>
    //           <DialogTitle>Sign Up</DialogTitle>
    //           <SignUp />
    //         </>
    //       )}
    //     </Dialog>
    //   </div>
    // </div>
    // <div className="bg-beige w-full h-screen flex justify-center">
    //   <div className="w-3/6 inline absolute left text-3xl font-bold">
    //     SMOOTH IS A TASK AND DEPENDENCY
    //     MANAGEMENT TOOL DESIGNED TO STREAMLINE
    //     CURRICULUM PLANNING AT NYU. USERS CAN
    //     CREATE NODES REPRESENTING TASKS OR COURSES
    //     AND ESTABLISH DEPENDENCIES BETWEEN THEM BY DRAWING EDGES.
    //   </div>
    // </div>


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

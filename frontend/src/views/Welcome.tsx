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
    <div className="w-full h-full flex flex-col min-h-screen items-center justify-between">
      <div className="w-full flex h-24 flex-row bg-slate-100">
        <div className="flex h-24 flex-row">
          <div className="h-16 w-16 bg-slate-400 m-4"></div>
          <div className="h-16 m-4">
            <span className="h-16 flex items-center justify-center text-center m-auto text-lg">
              SMOOTH
            </span>
          </div>
        </div>

        <div className="flex h-24 flex-row ml-auto">
          <div className="flex h-16 m-4">
            <Button
              className="w-60 mr-4 bg-gray-500"
              size="large"
              variant="contained"
              onClick={onSignUpButtonClicked}
            >
              Sign Up
            </Button>
            <Button
              className="w-60 bg-blue-400"
              size="large"
              variant="contained"
              onClick={onLoginButtonClicked}
            >
              Log In
            </Button>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-row self-stretch items-stretch justify-between flex-1">
        <div className="flex flex-1 bg-gray-500"></div>
        <Dialog open={login || signUp} onClose={onCancel} maxWidth="sm" fullWidth={true}>
          {login && ( // if login is true, then render the Login component
            <>
              <DialogTitle>Log In</DialogTitle>
              <Login />
            </>
          )}
          {signUp && ( // if signup is true, then render the Signup component
            <>
              <DialogTitle>Sign Up</DialogTitle>
              <SignUp />
            </>
          )}
        </Dialog>
      </div>
    </div>
  );
}

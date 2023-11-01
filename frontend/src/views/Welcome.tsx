import { useState } from "react";
import { Button, Dialog, DialogTitle } from "@mui/material";

import Login from "components/welcome/Login";
import Signup from "components/welcome/SignUp";

export default function Welcome() {
  const [login, setLogin] = useState(false);
  const [signup, setSignup] = useState(false);

  const onSignUpButtonClicked = () => {
    console.log("Sign Up Button Clicked!");
    if (!signup) setSignup(true);
    if (login) setLogin(false);
  };
  const onLoginButtonClicked = () => {
    console.log("Log In Button Clicked!");
    if (!login) setLogin(true);
    if (signup) setSignup(false);
  };
  const onLoginOrSignupCancelled = () => {
    console.log("login or signup cancelled");
    if (signup) setSignup(false);
    if (login) setLogin(false);
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
        <Dialog
          open={login || signup}
          onClose={onLoginOrSignupCancelled}
          maxWidth="sm"
          fullWidth={true}
        >
          {login && (
            <>
              <DialogTitle>Log In</DialogTitle>
              <Login />
            </>
          )}
          {signup && (
            <>
              <DialogTitle>Sign Up</DialogTitle>
              <Signup />
            </>
          )}
        </Dialog>
      </div>
    </div>
  );
}

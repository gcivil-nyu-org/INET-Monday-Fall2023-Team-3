import { ChangeEvent, useState } from "react";
import { Button, Alert, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { RequestMethods } from "src/utils/utils";
import { Validate } from "src/utils/validation";
import { useCombinedStore } from "src/store/combinedStore";
import { useShallow } from "zustand/react/shallow";

export default function SignUp() {
  const navigate = useNavigate();
  // use store to persist user information
  const [setUser, setToken] = useCombinedStore(
    useShallow((state) => [state.setUser, state.setToken])
  );
  const [signUpData, setSignUpData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");

  const validateSignUp = () => {
    if (verifyPassword !== signUpData.password) {
      setError("password mismatch");
      return false;
    }
    if (!Validate.validateEmail(signUpData.email, setError)) {
      return false;
    }
    if (!Validate.validatePassword(signUpData.password, setError)) {
      return false;
    }
    return true;
  };

  const onSignUpButtonClicked = async () => {
    console.log(`user: ${JSON.stringify(signUpData)}`);
    if (!validateSignUp()) return;

    const result = await RequestMethods.userSignUp({ body: signUpData });

    if (result.status) {
      setError("");
      console.log(result.value);
      // sessionStorage.setItem("token", result.value.token);
      // sessionStorage.setItem("email", signUpData.email);
      // store user information in store
      setUser({
        email: result.value.email,
        username: result.value.username,
        createdGraphs: result.value.createdGraphs,
        sharedGraphs: result.value.sharedGraphs,
        avatar: result.value.avatar,
      });
      setToken(result.value.token);

      navigate("/user");
    } else {
      setError(result.detail);
      console.error(result.detail);
    }
  };

  const onEmailInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSignUpData({
      ...signUpData,
      email: event.target.value,
    });
  };
  const onUsernameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSignUpData({
      ...signUpData,
      username: event.target.value,
    });
  };
  const onPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setSignUpData({
      ...signUpData,
      password: event.target.value,
    });
  };
  const onVerifyPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setVerifyPassword(event.target.value);
  };

  return (
    <div className="w-full flex flex-col items-center bg-white">
      <div className="h-24 w-full flex">
        <TextField
          className="h-16 m-4 flex-1"
          label="Email"
          variant="outlined"
          onChange={onEmailInputChanged}
        />
      </div>
      <div className="h-24 w-full flex">
        <TextField
          className="h-16 m-4 flex-1"
          label="Username"
          variant="outlined"
          onChange={onUsernameInputChanged}
        />
      </div>
      <div className="h-24 w-full flex">
        <TextField
          className="h-16 m-4 flex-1"
          label="Password"
          type="password"
          variant="outlined"
          onChange={onPasswordInputChanged}
        />
      </div>
      <div className="h-24 w-full flex">
        <TextField
          className="h-16 m-4 flex-1"
          label="Verify Password"
          type="password"
          variant="outlined"
          onChange={onVerifyPasswordInputChanged}
        />
      </div>
      {error !== "" && (
        <div className="h-24 w-full flex">
          <Alert className="h-12 w-full m-4" severity="error">
            {error}
          </Alert>
        </div>
      )}
      <div className="h-24 w-full flex">
        <Button
          className="w-64 h-16 ml-auto mr-auto bg-beige text-olive border-2 border-solid rounded-full"
          size="large"
          variant="contained"
          onClick={onSignUpButtonClicked}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}

import { ChangeEvent, useState } from "react";
import { Alert, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { RequestMethods } from "src/utils/utils";

export default function Login() {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const onLoginButtonClicked = async () => {
    console.log(`user: ${loginData}`);

    const result = await RequestMethods.userLogin({
      body: loginData,
    });

    console.log(result);
    if (result.status) {
      setError("");
      console.log(result.value);
      sessionStorage.setItem("token", result.value.token);
      sessionStorage.setItem("email", loginData.email);
      navigate("/user");
    } else {
      setError(result.detail);
      console.error(result.detail);
    }
  };

  const onEmailInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      email: event.target.value,
    });
  };
  const onPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      password: event.target.value,
    });
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
          label="Password"
          type="password"
          variant="outlined"
          onChange={onPasswordInputChanged}
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
          className="w-64 h-16 m-auto bg-blue-400"
          size="large"
          variant="contained"
          onClick={onLoginButtonClicked}
        >
          Log In
        </Button>
      </div>
    </div>
  );
}

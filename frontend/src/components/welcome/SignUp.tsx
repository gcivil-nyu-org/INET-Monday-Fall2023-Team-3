import { ChangeEvent, useState } from "react";
import { Button, Alert, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { userCreate } from "utils/backendRequests";
import validator from "validator";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmailHost = () => {
    return validator.isEmail(email, {
      host_whitelist: ["nyu.edu"],
    });
  };
  const validateOption = {
    minLength: 8,
    minUppercase: 0,
    minSymbols: 0,
    minLowercase: 0,
    minNumbers: 0,
  };
  const validatePasswordLength = () => {
    return validator.isStrongPassword(password, validateOption);
  };
  const validatePasswordUppercase = () => {
    validateOption.minUppercase = 1;
    return validator.isStrongPassword(password, validateOption);
  };
  const validatePasswordSymbols = () => {
    validateOption.minSymbols = 1;
    return validator.isStrongPassword(password, validateOption);
  };
  const validateEmail = () => {
    const isValid = validateEmailHost();
    if (!isValid) {
      setErrorMessage("email must end with @nyu.edu");
    }
    return isValid;
  };
  const validatePassword = () => {
    let isValid = validatePasswordLength();
    if (!isValid) {
      setErrorMessage("password must be at least 8 characters long");
      return false;
    }
    isValid = validatePasswordUppercase();
    if (!isValid) {
      setErrorMessage("password must contain at least 1 uppercase character");
      return false;
    }
    isValid = validatePasswordSymbols();
    if (!isValid) {
      setErrorMessage("password must contain at least 1 symbol");
      return false;
    }
    return true;
  };
  const validateUser = () => {
    const isEmailValid = validateEmail();
    if (!isEmailValid) return false;
    return validatePassword();
  };

  const onSignupButtonClicked = () => {
    console.log(`email: ${email}`);
    console.log(`username: ${username}`);
    console.log(`password: ${password}`);

    if (password !== verifyPassword) {
      setErrorMessage("Password mismatch, please try again");
      return;
    }

    // if user credential does not meet requirement do nothing
    // error messages are set correspondingly in the function
    if (!validateUser()) return;

    userCreate({
      email: email,
      username: username,
      password: password,
    }).then((result) => {
      if (result.status) {
        setErrorMessage("");
        console.log(result.value);

        sessionStorage.setItem("token", result.value.token);
        navigate("/user");
      } else {
        setErrorMessage(result.error);
        console.error(result.error);
      }
    });
  };

  const onEmailInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const onUsernameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const onPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
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
      {errorMessage !== "" && (
        <div className="h-24 w-full flex">
          <Alert className="h-16 w-full m-4" severity="error">
            {errorMessage}
          </Alert>
        </div>
      )}
      <div className="h-24 w-full flex">
        <Button
          className="w-64 h-16 m-auto bg-blue-400"
          size="large"
          variant="contained"
          onClick={onSignupButtonClicked}
        >
          Sign Up
        </Button>
      </div>
    </div>
  );
}

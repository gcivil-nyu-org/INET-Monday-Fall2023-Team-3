import { Alert, AlertColor, Avatar, TextField, Button } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { RequestMethods } from "src/utils/utils";
import { refreshPokemonAvatar } from "src/utils/helpers";
import { useCombinedStore } from "src/store/combinedStore";
import { useShallow } from "zustand/react/shallow";
import { Validate } from "src/utils/validation";
import { useNavigate } from "react-router-dom";

interface UpdateProps {
  onAvatarChanged: (url: string) => void;
  avatarSrc: string;
}

export default function Update({ onAvatarChanged, avatarSrc }: UpdateProps) {
  const [token, user, setUser, setToken] = useCombinedStore(
    useShallow((state) => [state.token, state.user, state.setUser, state.setToken])
  );
  const [severity, setSeverity] = useState<AlertColor>("error");
  // use object state saves us a log of separate state definitions
  const [updateData, setUpdateData] = useState({
    username: "",
    password: "",
  });
  const [verifyPassword, setVerifyPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setUpdateData({
      ...updateData,
      username: user.username,
    });
  }, [user]);

  const validateUpdate = () => {
    if (verifyPassword !== updateData.password) {
      setSeverity("error");
      setMessage("password mismatch");
      return false;
    }
    if (!Validate.validatePassword(updateData.password, setMessage)) {
      setSeverity("error");
      return false;
    }
    return true;
  };

  const onUsernameInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setUpdateData({
      ...updateData,
      username: event.target.value,
    });
  };

  const onPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setUpdateData({
      ...updateData,
      password: event.target.value,
    });
  };

  const onVerifyPasswordInputChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setVerifyPassword(event.target.value);
  };

  const onUpdateButtonClicked = () => {
    console.log(`new username ${updateData.username}`);
    console.log(`new password ${updateData.password}`);

    if (!validateUpdate()) return;

    RequestMethods.userPatch({
      body: updateData,
      token,
    }).then((result) => {
      if (result.status) {
        // update store user information
        setUser(result.value);

        setSeverity("success");
        setMessage("user update success");
      } else {
        setSeverity("error");
        setMessage(result.detail);
      }
    });
  };

  const onLogOutButtonClicked = () => {
    console.log("user log out");
    const token = "";
    setToken(token);
    navigate("/");
  };

  const onRefreshAvatar = () => {
    console.log("refreshing avatar");
    const newAvatarUrl = refreshPokemonAvatar();

    RequestMethods.userPatch({
      body: {avatar: newAvatarUrl},
      token,
    }).then((result) => {
      if (result.status) {
        setUser(result.value);
        setSeverity("success");
        setMessage("avatar update success");
      } else {
        setSeverity("error");
        setMessage(result.detail);
      }
    });

    onAvatarChanged(newAvatarUrl);
  };

  return (
    <div className="w-full flex flex-col items-center bg-beige">
      <div className="mt-8 mb-4">
        <Avatar
          className="border-olive"
          alt="Pokemon"
          src={avatarSrc}
          sx={{
            width: 100,
            height: 100,
            border: "2px solid",
            cursor: "pointer", // Change cursor to hand on hover
            transition: "transform 0.3s",
          }}
          onClick={onRefreshAvatar}
        />
      </div>

      <div className="h-24 w-full flex">
        <TextField
          className="h-16 m-4 flex-1"
          label="Username"
          variant="outlined"
          defaultValue={updateData.username}
          InputLabelProps={{ shrink: true }}
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
      {message !== "" && (
        <div className="h-24 w-full flex">
          <Alert className="h-16 w-full m-4" severity={severity}>
            {message}
          </Alert>
        </div>
      )}
      <div className="h-24 w-full flex">
        <Button
          className="w-64 h-16 m-auto bg-beige text-olive font-sans rounded-full
          border-2 border-solid"
          size="large"
          variant="contained"
          onClick={onUpdateButtonClicked}
        >
          Update
        </Button>
      </div>
      <div className="h-24 w-full flex">
        <Button
          className="w-64 h-16 m-auto bg-beige text-olive font-sans rounded-full
          border-2 border-solid"
          size="large"
          variant="contained"
          onClick={onLogOutButtonClicked}
        >
          Log out
        </Button>
      </div>
    </div>
  );
}

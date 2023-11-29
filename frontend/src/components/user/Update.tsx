import { Alert, AlertColor, Avatar, TextField, Button } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import { RequestMethods } from "src/utils/utils";
import { refreshPokemonAvatar } from "src/utils/helpers";

interface UpdateProps {
  onAvatarChanged: (url: string) => void;
  avatarSrc: string;
}

export default function Update({ onAvatarChanged, avatarSrc }: UpdateProps) {
  const [severity, setSeverity] = useState<AlertColor>("error");
  // use object state saves us a log of separate state definitions
  const [updateData, setUpdateData] = useState({
    username: "",
    password: "",
  });
  const [verifyPassword, setVerifyPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    RequestMethods.userGetSelf({
      token: sessionStorage.getItem("token") ?? "",
    }).then((result) => {
      if (result.status) {
        setUpdateData({
          ...result.value,
          ...updateData,
        });
      } else {
        setSeverity("error");
        setMessage("failed to get current user");
      }
    });
  }, []);

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

    if (updateData.password !== verifyPassword) {
      setSeverity("error");
      setMessage("password mismatch, please try again");
      return;
    }

    RequestMethods.userPatch({
      body: updateData,
      token: sessionStorage.getItem("token") ?? "",
    }).then((result) => {
      if (result.status) {
        setSeverity("success");
        setMessage("user update success");
      } else {
        setSeverity("error");
        setMessage(result.detail);
      }
    });
  };

  const onRefreshAvatar = () => {
    console.log("refreshing avatar");
    const avatarUrl = refreshPokemonAvatar();
    onAvatarChanged(avatarUrl);
  };

  return (
    <div className="w-full flex flex-col items-center bg-white">
      <div className="mt-8 mb-4">
        <Avatar
          alt="Pokemon"
          src={avatarSrc}
          sx={{
            width: 100,
            height: 100,
            border: "2px solid rgba(164, 164, 164, 0.8)",
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
          className="w-64 h-16 m-auto bg-blue-400"
          size="large"
          variant="contained"
          onClick={onUpdateButtonClicked}
        >
          Update
        </Button>
      </div>
    </div>
  );
}

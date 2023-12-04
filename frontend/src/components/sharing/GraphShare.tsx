import { useState, useMemo, useEffect, ChangeEvent } from "react";
import { Button, Alert, TextField, Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import { useCombinedStore } from "src/store/combinedStore";
import { RequestMethods } from "src/utils/utils";
import { useShallow } from "zustand/react/shallow";

export type GraphSharingProp = {
  onClose: () => void;
};

export default function GraphSharing({ onClose }: GraphSharingProp) {
  const { user, token, graph } = useCombinedStore(
    useShallow((state) => ({
      user: state.user,
      token: state.token,
      graph: state.graph,
    }))
  );
  const [sharedUsers, setSharedUsers] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  useEffect(() => {
    async function fetchAllSharedGraphs() {
      const response = await RequestMethods.graphGet({
        param: graph.id,
        token,
      });
      if (response.status) {
        const sharedUsersArray = Object.values(response.value.sharedWith);
        const sortedSharedUsers = sharedUsersArray.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
        setSharedUsers(sortedSharedUsers);
      }
    }
    async function fetchAllUsers() {
      const response = await RequestMethods.userGetAll({ token });
      if (response.status) {
        const usersArray = Object.values(response.value).map((user) => user.email);
        const filteredUsers = usersArray.filter((email) => email !== user.email);
        const sortedUsers = filteredUsers.sort((a, b) => {
          if (a < b) return -1;
          if (a > b) return 1;
          return 0;
        });
        setUsers(sortedUsers); // Assuming response.value is the array of users you want to set
      } else {
      }
    }
    fetchAllSharedGraphs();
    fetchAllUsers();
  }, []);

  const onShareButtonClicked = () => {
    RequestMethods.graphShare({
      param: graph.id,
      token: token,
      body: {
        sharedWith: [...sharedUsers, ...selectedUsers],
      },
    }).then((result) => {
      if (result.status) {
        setSharedUsers([...sharedUsers, ...selectedUsers]);
      }
      onClose();
    });
    console.log("shared");
  };
  const handleChange = (event: ChangeEvent<{}>, newValues: string[]) => {
    setSelectedUsers(newValues);
  };

  const filteredUsers = useMemo(
    () => users.filter((user) => !sharedUsers.includes(user)),
    [users, sharedUsers]
  );

  const handleSharedUsersDelete = (user: string) => {
    console.log(user);
    RequestMethods.graphShare({
      param: graph.id,
      token: token,
      body: {
        sharedWith: sharedUsers.filter((email) => email !== user),
      },
    }).then((result) => {
      if (result.status) {
        setSharedUsers(sharedUsers.filter((email) => email !== user));
      }
    });
    console.log("remove access from " + user);
  };

  return (
    <div className="w-full flex flex-col items-center bg-beige">
      <div className="w-full pl-8 pr-8 pt-4 flex justify-center items-center my-4 mt-8 flex-col items-center">
        <Stack spacing={2} sx={{ width: "100%", mb: 4 }}>
          <Autocomplete
            isOptionEqualToValue={(option, value) => {
              return (
                option === value || (!filteredUsers.includes(value) && sharedUsers.includes(value))
              );
            }}
            multiple
            id="tags-outlined"
            options={filteredUsers}
            filterSelectedOptions
            onChange={handleChange}
            renderInput={(params) => (
              <TextField {...params} label="Email" placeholder="Share with" />
            )}
          />
          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            {sharedUsers.map((email: string) => (
              <Chip
                label={email}
                variant="outlined"
                color="primary"
                onDelete={() => handleSharedUsersDelete(email)}
              />
            ))}
          </Stack>
        </Stack>
      </div>
      <div className="w-full pl-8 pr-8 flex justify-center items-center my-4 mt-8 flex-col items-center">
        <Alert severity="info" className="w-full bg-beige">
          The shared graph will not be able to modified by other users.
        </Alert>
      </div>
      <Stack spacing={2} sx={{ width: "100%", mb: 4 }}>
        <Button
          className="w-64 h-16 m-auto bg-beige text-olive font-sans my-4 border-2 border-solid rounded-full"
          size="large"
          variant="contained"
          onClick={onShareButtonClicked}
        >
          Share
        </Button>
        <Button
          className="w-64 h-16 m-auto bg-beige text-olive font-sans my-4 border-2 border-solid rounded-full"
          size="large"
          variant="contained"
          onClick={onClose}
        >
          Cancel
        </Button>
      </Stack>
    </div>
  );
}

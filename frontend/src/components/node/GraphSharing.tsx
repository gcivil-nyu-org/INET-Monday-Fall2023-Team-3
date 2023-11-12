import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button, Alert, TextField, List, ListItem } from "@mui/material";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import FormControl from "@mui/material/FormControl"; // Import FormControl component
import InputLabel from "@mui/material/InputLabel"; // Import InputLabel component
import Select, { SelectChangeEvent } from "@mui/material/Select"; // Import Select component
import MenuItem from "@mui/material/MenuItem"; // Import MenuItem component
import Stack from "@mui/material/Stack";
import { INode, IUser } from "utils/models";
import { userList } from "utils/backendRequests";

export type GraphSharingProp = {
  onClose: () => void;
};

export default function GraphSharing({ onClose }: GraphSharingProp) {
  const [sharedUsers, setSharedUsers] = useState<Partial<IUser>[]>([]);
  const [users, setUsers] = useState<Partial<IUser>[]>([]);
  const [accessPermission, setAccessPermission] = useState("");
  useEffect(() => {
    async function fetchAllUsers() {
      const response = await userList(sessionStorage.getItem("token")!);
      if (response.status) {
        const usersArray = Object.values(response.value);
        const sortedUsers = usersArray.sort((a, b) => {
          if (a.email < b.email) return -1;
          if (a.email > b.email) return 1;
          return 0;
        });
        setUsers(sortedUsers); // Assuming response.value is the array of users you want to set
      } else {
        console.error("Error fetching predefined nodes:", response.error);
      }
    }
    fetchAllUsers();
  }, []);
  const onShareButtonClicked = () => {
    console.log("shared");
  };
  const handleSelectChange = (event: SelectChangeEvent) => {
    setAccessPermission(event.target.value);
  };

  return (
    <div className="w-full flex flex-col items-center bg-white py-4">
      <div className="h-24 w-full flex justify-center items-center px-4">
        <Stack spacing={2} sx={{ width: '100%', maxWidth: 600, mb: 4 }}>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={users}
            getOptionLabel={(option) => option.email!}
            defaultValue={[]}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} label="Email" placeholder="Share with" />
            )}
          />
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Access Permission</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={accessPermission}
              label="Access"
              onChange={handleSelectChange}
            >
              <MenuItem value={"Editing"}>Editing</MenuItem>
              <MenuItem value={"Viewing"}>Viewing</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </div>
      <div className="h-24 w-full flex justify-center items-center px-4">
        <Button
          className="w-64 h-16 m-auto bg-blue-400 my-4"
          size="large"
          variant="contained"
          onClick={onShareButtonClicked}
        >
          Share
        </Button>
        <Button
          className="w-64 h-16 m-auto bg-blue-400"
          size="large"
          variant="contained"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

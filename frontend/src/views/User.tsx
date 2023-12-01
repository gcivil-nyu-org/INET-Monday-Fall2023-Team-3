import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button, Avatar, Dialog } from "@mui/material";
import { RequestMethods } from "src/utils/utils";

import GraphList from "src/components/user/GraphList";
import Update from "src/components/user/Update";
import { BackendModels } from "src/utils/models";
import { defaultAvatarSrc } from "src/utils/helpers";
import { useCombinedStore } from "src/store/combinedStore";
import { useShallow } from "zustand/react/shallow";

import usePusher from "src/components/pusher/usePusher";

export default function User() {
  const navigate = useNavigate();
  const [update, setUpdate] = useState(false);
  const {
    user,
    setUser,
    token,
    createdGraphs,
    fetchCreatedGraphs,
    sharedGraphs,
    fetchSharedGraphs,
    setGraph,
  } = useCombinedStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
      token: state.token,
      createdGraphs: state.createdGraphs,
      fetchCreatedGraphs: state.fetchCreatedGraphs,
      sharedGraphs: state.sharedGraphs,
      fetchSharedGraphs: state.fetchSharedGraphs,
      setGraph: state.setGraph,
    }))
  );
  const [avatarSrc, setAvatarSrc] = useState(
    localStorage.getItem("smooth/avatar") ?? defaultAvatarSrc
  );

  // when user content changed, we
  // fetch graphs again
  useEffect(() => {
    console.log(user);
    fetchCreatedGraphs();
    fetchSharedGraphs();
  }, [user]);

  // Subscribe to Pusher channel and events
  usePusher("graph-channel", "new-graph-share", async () => {
    console.log("usePusher");
    console.log(sharedGraphs);
    const resp = await RequestMethods.userGetSelf({
      token
    });
    if (resp.status) {
      setUser({ sharedGraphs: resp.value.sharedGraphs})
    }

    console.log(resp);
  });

  const onUpdateCancelled = () => {
    console.log("update cancelled");
    setUpdate(false);
  };

  const onCreateGraphButtonClicked = async () => {
    console.log("create graph button clicked");

    const createGraphResult = await RequestMethods.graphCreate({
      body: {
        createdBy: user.email,
      },
      token,
    });

    if (createGraphResult.status) {
      setUser({ createdGraphs: [...user.createdGraphs, createGraphResult.value.id] });
      setGraph(createGraphResult.value);
      navigate(`/graph`);
    } else {
      console.error(`error creating graph ${createGraphResult.detail}`);
    }
  };

  const onAvatarChanged = (src: string) => {
    setAvatarSrc(src);
    setUpdate(false);
  };

  return (
    <div className="w-full h-full flex flex-col min-h-screen">
      <div className="flex h-24 flex-row ml-auto">
        <div className="flex h-16 m-4">
          <Button
            className="w-60 mr-4 bg-gray-500"
            size="large"
            variant="contained"
            onClick={onCreateGraphButtonClicked}
          >
            Create New Graph
          </Button>

          <Button
            className="h-16 w-16 p-2 rounded-lg bg-white bg-opacity-60"
            onClick={() => setUpdate(true)}
          >
            <Avatar className="w-12 h-12" src={avatarSrc} />
          </Button>
        </div>
      </div>

      <Dialog open={update} onClose={onUpdateCancelled} maxWidth="sm" fullWidth={true}>
        <Update onAvatarChanged={onAvatarChanged} avatarSrc={avatarSrc} />
      </Dialog>

      <GraphList name="My Graph" graphs={createdGraphs} />

      <GraphList name="Shared Graph" graphs={sharedGraphs} />
    </div>
  );
}

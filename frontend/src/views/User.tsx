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
    // localStorage.getItem("smooth/avatar") ??
    user.avatar == null ? defaultAvatarSrc : user.avatar
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
    const resp = await RequestMethods.userGetSelf({
      token
    });
    if (resp.status) {
      setUser({ sharedGraphs: resp.value.sharedGraphs })
    }
  });

  const onUpdateCancelled = () => {
    console.log("user avatar is:", user.avatar);
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
    <div className="bg-beige w-full h-auto">
      <div className="bg-beige flex flex-row-reverse w-full">
        <div className="flex h-16 m-4">
          <Button
            className="w-60 mr-4 bg-beige text-olive font-sans rounded-full
            border-2 border-solid"
            size="large"
            variant="contained"
            onClick={onCreateGraphButtonClicked}
          >
            Create New Graph
          </Button>

          <Button
            className="h-16 w-16 p-2 bg-beige text-olive font-sans rounded-full
            border-2 border-solid shadow-lg"
            onClick={() => setUpdate(true)}
          >
            <Avatar className="w-12 h-12" src={avatarSrc} />
          </Button>
        </div>
        <div className="ml-5 mr-auto">
          <span className="inline-block w-10 h-12 bg-pink mt-6 mr-5" ></span>
          <span className="inline-block w-10 h-12 bg-green mt-6 mr-5" ></span>
          <span className="inline-block w-10 h-12 bg-orange mt-6 mr-5" ></span>
          <span className="inline-block w-10 h-12 bg-blue mt-6 mr-5" ></span>
          <span className="inline-block w-10 h-12 bg-yellow mt-6 mr-5" ></span>
        </div>
      </div>
      <div>
        <Dialog open={update} onClose={onUpdateCancelled} maxWidth="sm" fullWidth={true}>
          <Update onAvatarChanged={onAvatarChanged} avatarSrc={avatarSrc} />
        </Dialog>
      </div>
      <div className="font-sans text-olive">
        <GraphList name="MY GRAPHS" graphs={createdGraphs} />
        <GraphList name="SHARED GRAPHS" graphs={sharedGraphs} />
      </div>
    </div>
  );
}

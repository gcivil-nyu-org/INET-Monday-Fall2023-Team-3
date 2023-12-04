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
    <div className="bg-beige w-full h-full">
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
    </div>

    // <div className="w-full h-full flex flex-col min-h-screen">
    //   <div className="flex h-24 flex-row ml-auto">
    // <div className="flex h-16 m-4">
    //   <Button
    //     className="w-60 mr-4 bg-gray-500"
    //     size="large"
    //     variant="contained"
    //     onClick={onCreateGraphButtonClicked}
    //   >
    //     Create New Graph
    //   </Button>

    //   <Button
    //     className="h-16 w-16 p-2 rounded-lg bg-white bg-opacity-60"
    //     onClick={() => setUpdate(true)}
    //   >
    //     <Avatar className="w-12 h-12" src={avatarSrc} />
    //   </Button>
    // </div>
    //   </div>

    //   <Dialog open={update} onClose={onUpdateCancelled} maxWidth="sm" fullWidth={true}>
    //     <Update onAvatarChanged={onAvatarChanged} avatarSrc={avatarSrc} />
    //   </Dialog>

    //   <GraphList name="My Graph" graphs={createdGraphs} />

    //   <GraphList name="Shared Graph" graphs={sharedGraphs} />
    // </div>
    // <div className="bg-beige flex flex-row justify-center w-full">
    //   <div className="bg-beige flex h-24 flex-row ml-auto">
    //     <div className="flex h-16 m-4">
    //       <Button
    //         className="w-60 mr-4 bg-beige text-olive"
    //         size="large"
    //         variant="contained"
    //         onClick={onCreateGraphButtonClicked}
    //       >
    //         Create New Graph
    //       </Button>
    //     </div>

    //     <div className="absolute w-[453px] h-[71px] top-[195px] left-[29px]">
    //       <div className="absolute w-[368px] top-[3px] left-0 [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[40px] tracking-[0] leading-[normal]">
    //         MY GRAPHS
    //       </div>
    //       <button className="absolute w-[150px] h-[52px] top-0 left-[303px] all-[unset] box-border">
    //         <div className="relative w-[148px] h-[52px]">
    //           <div className="absolute w-[126px] h-[52px] top-0 left-0 bg-[#f9f4eb] rounded-[40px] border-b-2 [border-bottom-style:solid] border-[#2b5413]" />
    //           <div className="absolute w-[115px] top-[14px] left-[33px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[24px] tracking-[0] leading-[normal]">
    //             Edit
    //           </div>
    //         </div>
    //       </button>
    //     </div>
    //     <div className="absolute w-[565px] h-[69px] top-[583px] left-[26px]">
    //       <div className="absolute w-[513px] top-px left-0 [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[40px] tracking-[0] leading-[normal]">
    //         SHARED GRAPHS
    //       </div>
    //       <button className="absolute w-[150px] h-[52px] top-0 left-[415px] all-[unset] box-border">
    //         <div className="relative w-[148px] h-[52px]">
    //           <div className="absolute w-[126px] h-[52px] top-0 left-0 bg-[#f9f4eb] rounded-[40px] border-b-2 [border-bottom-style:solid] border-[#2b5413]" />
    //           <div className="absolute w-[115px] top-[14px] left-[33px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[24px] tracking-[0] leading-[normal]">
    //             Edit
    //           </div>
    //         </div>
    //       </button>
    //     </div>
    //     {/* <button className="absolute w-[262px] h-[75px] top-[59px] left-[1000px] all-[unset] box-border">
    //       <div className="relative w-[260px] h-[75px]">
    //         <div className="absolute w-[237px] h-[75px] top-0 left-0 bg-[#f9f4eb] rounded-[40px] border-2 border-solid border-[#2b5413] shadow-[0px_4px_4px_#00000040]" />
    //         <div className="absolute w-[216px] top-[25px] left-[44px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[24px] tracking-[0] leading-[normal]">
    //           New Graph
    //         </div>
    //       </div>
    //     </button> */}

    //     <div className="absolute top-[232px] left-[716px] [font-family:'Tajawal-Regular',Helvetica] font-normal text-black text-[24px] tracking-[0] leading-[normal]">
    //       hidden horizontal scroll
    //     </div>
    //     <img
    //       className="absolute w-[118px] h-[118px] top-[42px] left-[1267px] object-cover"
    //       alt="Ellipse"
    //       src="ellipse-1.png"
    //     />
    //     <div className="absolute w-[316px] h-[216px] top-[267px] left-[42px]">
    //       <div className="absolute w-[316px] h-[216px] top-0 left-0">
    //         <div className="relative w-[314px] h-[216px] bg-[#fcf071] shadow-[0px_4px_4px_#00000040]">
    //           <div className="absolute w-[234px] top-[12px] left-[17px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[40px] tracking-[0] leading-[normal]">
    //             Use Case
    //           </div>
    //         </div>
    //       </div>
    //       <div className="absolute w-[316px] h-[216px] top-0 left-0">
    //         <div className="relative w-[314px] h-[216px] bg-[#fcf071] shadow-[0px_4px_4px_#00000040]">
    //           <div className="absolute w-[234px] top-[12px] left-[17px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[40px] tracking-[0] leading-[normal]">
    //             GRAPH
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //   </div>
    // </div>
  );
}

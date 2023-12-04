import { useState } from "react";
import { Button, Dialog, DialogTitle } from "@mui/material";

import Login from "src/components/login/Login";
import SignUp from "src/components/signup/SignUp";

export default function Welcome() {
  const [login, setLogin] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const onLoginButtonClicked = () => {
    console.log("login button clicked");
    setLogin(true);
    setSignUp(false);
  };
  const onSignUpButtonClicked = () => {
    console.log("sign up button clicked");
    setLogin(false);
    setSignUp(true);
  };
  const onCancel = () => {
    console.log("cancelled");
    setLogin(false);
    setSignUp(false);
  };

  return (
    // <div className="w-full h-full flex flex-col min-h-screen items-center justify-between">
    //   <div className="w-full flex h-24 flex-row bg-slate-100">
    //     <div className="flex h-24 flex-row">
    //       <div className="h-16 w-16 bg-slate-400 m-4"></div>
    //       <div className="h-16 m-4">
    //         <span className="h-16 flex items-center justify-center text-center m-auto text-lg">
    //           SMOOTH
    //         </span>
    //       </div>
    //     </div>

    //     <div className="flex h-24 flex-row ml-auto">
    //       <div className="flex h-16 m-4">
    //         <Button
    //           className="w-60 mr-4 bg-gray-500"
    //           size="large"
    //           variant="contained"
    //           onClick={onSignUpButtonClicked}
    //         >
    //           Sign Up
    //         </Button>
    //         <Button
    //           className="w-60 bg-blue-400"
    //           size="large"
    //           variant="contained"
    //           onClick={onLoginButtonClicked}
    //         >
    //           Log In
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="w-full flex flex-row self-stretch items-stretch justify-between flex-1">
    //     <div className="flex flex-1 bg-gray-500"></div>
    //     <Dialog open={login || signUp} onClose={onCancel} maxWidth="sm" fullWidth={true}>
    //       {login && ( // if login is true, then render the Login component
    //         <>
    //           <DialogTitle>Log In</DialogTitle>
    //           <Login />
    //         </>
    //       )}
    //       {signUp && ( // if signup is true, then render the Signup component
    //         <>
    //           <DialogTitle>Sign Up</DialogTitle>
    //           <SignUp />
    //         </>
    //       )}
    //     </Dialog>
    //   </div>
    // </div>
    // <div className="bg-beige w-full h-screen flex justify-center">
    //   <div className="w-3/6 inline absolute left text-3xl font-bold">
    //     SMOOTH IS A TASK AND DEPENDENCY
    //     MANAGEMENT TOOL DESIGNED TO STREAMLINE
    //     CURRICULUM PLANNING AT NYU. USERS CAN
    //     CREATE NODES REPRESENTING TASKS OR COURSES
    //     AND ESTABLISH DEPENDENCIES BETWEEN THEM BY DRAWING EDGES.
    //   </div>
    // </div>
    <div className="bg-beige flex flex-row justify-center w-full">
      <div>
        <div className="top-[301px] left-[1078px] bg-[#f3ac42] border border-solid border-[#f2adbe] absolute w-[38px] h-[75px]" />
        <p className="absolute w-[935px] top-[192px] left-[26px] font-sans font-bold text-4xl leading-[normal]">
          <span className="text-yellow">SMOOTH</span>
          <span className="text-olive"> IS A </span>
          <span className="text-pink">TASK AND DEPENDENCY</span>
          <span className="text-olive"> MANAGEMENT TOOL DESIGNED TO STREAMLINE </span>
          <span className="text-green">CURRICULUM PLANNING</span>
          <span className="text-olive"> AT NYU. USERS CAN CREATE NODES REPRESENTING </span>
          <span className="text-orange">TASKS OR COURSES</span>
          <span className="text-olive"> AND ESTABLISH DEPENDENCIES BETWEEN THEM BY DRAWING EDGES. </span>
        </p>
        <div className="absolute w-[170px] h-[75px] top-[59px] left-[1017px]">
          <div className="relative w-[168px] h-[75px] bg-[#f9f4eb] rounded-[40px] border-2 border-solid border-[#2b5413] shadow-[0px_4px_4px_#00000040]">
            <div className="absolute w-[106px] top-[20px] left-[41px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[24px] tracking-[0] leading-[normal]">
            <Button
              className="bg-beige text-olive"
              size="large"
              variant="contained"
              onClick={onLoginButtonClicked}
            >
              Log In
            </Button>
            </div>
          </div>
        </div>
        <div className="absolute w-[170px] h-[75px] top-[59px] left-[803px]">
          <div className="relative w-[168px] h-[75px] bg-[#f9f4eb] rounded-[40px] border-2 border-solid border-[#2b5413] shadow-[0px_4px_4px_#00000040]">
            <div className="absolute w-[106px] top-[20px] left-[41px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[24px] tracking-[0] leading-[normal]">
              About
            </div>
          </div>
        </div>

        <div className="absolute w-[170px] h-[75px] top-[59px] left-[1231px]">
          <div className="relative w-[168px] h-[75px] bg-[#f9f4eb] rounded-[40px] border-2 border-solid border-[#2b5413] shadow-[0px_4px_4px_#00000040]">
            <div className="absolute w-[106px] top-[21px] left-[29px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[24px] tracking-[0] leading-[normal]">
            <Button
              className="bg-beige text-olive"
              size="large"
              variant="contained"
              onClick={onSignUpButtonClicked}
            >
              Sign Up
            </Button>
            </div>
          </div>
        </div>
        <div className="absolute top-[385px] left-[1122px] [font-family:'Tajawal-Regular',Helvetica] font-normal text-black text-[24px] tracking-[0] leading-[normal]">
          some illustration
        </div>
        <div className="absolute w-[554px] h-[386px] top-[595px] left-[36px] rotate-[-20.00deg]">
          <div className="relative w-[552px] h-[386px] bg-[#90d5d9] shadow-[0px_4px_4px_#00000040]">
            <div className="absolute w-[307px] top-[19px] left-[28px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[40px] tracking-[0] leading-[normal]">
              Use Case
            </div>
          </div>
        </div>
        <div className="absolute w-[342px] h-[449px] top-[575px] left-[622px] rotate-[15.00deg]">
          <div className="relative w-[340px] h-[449px] bg-[#f2adbe] shadow-[0px_4px_4px_#00000040]">
            <div className="top-[20px] left-[23px] absolute w-[307px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[40px] tracking-[0] leading-[normal]">
              Use Case
            </div>
          </div>
        </div>
        <div className="absolute w-[414px] h-[373px] top-[585px] left-[1079px] rotate-[-20.00deg]">
          <div className="relative w-[412px] h-[373px] bg-[#fcf071] shadow-[0px_4px_4px_#00000040]">
            <div className="top-[21px] left-[22px] absolute w-[307px] [font-family:'Archivo_Black-Regular',Helvetica] font-normal text-[#2b5413] text-[40px] tracking-[0] leading-[normal]">
              Use Case
            </div>
          </div>
        </div>
        <div className="w-full flex flex-row self-stretch items-stretch justify-between flex-1">
         <div className="flex flex-1 bg-gray-500"></div>
         <Dialog open={login || signUp} onClose={onCancel} maxWidth="sm" fullWidth={true}>
          {login && ( // if login is true, then render the Login component
             <>
               <DialogTitle>Log In</DialogTitle>
               <Login />
             </>
           )}
           {signUp && ( // if signup is true, then render the Signup component
             <>
               <DialogTitle>Sign Up</DialogTitle>
               <SignUp />
             </>
           )}
         </Dialog>
       </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Node } from "reactflow";
import { useCombinedStore } from "src/store/combinedStore";
import { BackendModels } from "src/utils/models";
import { useShallow } from "zustand/react/shallow";
import { CommentState } from "./Comment";
import { RequestMethods } from "src/utils/utils";
import usePusher from "../pusher/usePusher";
import { ThemeProvider } from "@emotion/react";
import Theme from "./Theme";
import { Box, CssBaseline } from "@mui/material";
import CommentForm from "./CommentForm";
import Comment from "./Comment";

interface NodeCommentProps {
  node: Node<BackendModels.INode>;
}

export default function NodeComments({ node }: NodeCommentProps) {
  const { user, token, graph } = useCombinedStore(
    useShallow((state) => ({
      user: state.user,
      token: state.token,
      graph: state.graph,
    }))
  );

  const [activeComment, setActiveComment] = useState<CommentState | null>(null);
  const [comments, setComments] = useState<BackendModels.IComment[]>([]);
  const rootComments = comments.filter((comment) => comment.parent === null);

  const [severity, setSeverity] = useState<"error" | "success">("error");
  const [message, setMessage] = useState("");

  useEffect(() => {
    RequestMethods.nodeCommentGetByNode({
      token: token,
      param: node.id,
    }).then((result) => {
      if (result.status) {
        console.log(result.value);
        setComments(result.value);
      } else {
        setMessage(`error when fetching comments for node ${node.id}`);
      }
    });
  }, []);

  const getReplies = (commentId: string) => {
    return comments
      .filter((comment) => comment.parent === commentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const addComment = (text: string, parentId: string | null) => {
    const body = parentId
      ? {
          body: text,
          createdBy: user.email,
          belongsTo: node.id,
          parent: parentId,
        }
      : {
          body: text,
          createdBy: user.email,
          belongsTo: node.id,
        };
    RequestMethods.nodeCommentCreate({
      token: token,
      body: body,
    }).then((result) => {
      if (result.status) {
        setComments([...comments, result.value]);
        setActiveComment(null);
      } else {
        setMessage(`error when creating comment for node ${node.id}`);
      }
    });
  };

  usePusher("comments-channel", "new-node-comment", () => {
    RequestMethods.nodeCommentGetByNode({
      token: token,
      param: node.id,
    }).then((result) => {
      if (result.status) {
        console.log("usePusher");
        const commentsArray = Object.values(result.value);
        setComments(commentsArray);
      } else {
        setMessage("error when fetching comment on new-node-comment");
      }
    });
  });

  usePusher("comments-channel", "delete-node-comment", () => {
    RequestMethods.nodeCommentGetByNode({
      token: token,
      param: node.id,
    }).then((result) => {
      if (result.status) {
        console.log("usePusher");
        const commentsArray = Object.values(result.value);
        setComments(commentsArray);
      } else {
        setMessage("error when fetching comment on delete-node-comment");
      }
    });
  });

  usePusher("comments-channel", "patch-node-comment", () => {
    RequestMethods.nodeCommentGetByNode({
      token: token,
      param: node.id,
    }).then((result) => {
      if (result.status) {
        console.log("usePusher");
        const commentsArray = Object.values(result.value);
        setComments(commentsArray);
      } else {
        setMessage("error when fetching comment on patch-node-comment");
      }
    });
  });

  const updateComment = (text: string, commentId: string) => {
    RequestMethods.nodeCommentPatch({
      token: token,
      body: {
        body: text,
      },
      param: commentId,
    }).then((result) => {
      if (result.status) {
        setComments(
          comments.map((comment) => {
            if (comment.id === commentId) {
              return { ...comment, body: text };
            }
            return comment;
          })
        );
        setActiveComment(null);
      } else {
        setMessage(`error when patching comment ${commentId} for node ${node.id}`);
      }
    });
  };

  const deleteComment = (commentId: string) => {
    if (!window.confirm("Are you sure you want to remove comment?")) {
      return;
    }

    RequestMethods.nodeCommentDelete({
      token: token,
      param: commentId,
    }).then((result) => {
      if (result.status) {
        setComments(comments.filter((comment) => comment.id !== commentId));
        setActiveComment(null);
      } else {
        setMessage(`error when deleting comment ${commentId} for node ${node.id}`);
      }
    });
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center">
      <div className="mb-4">
        <div className="text-olive font-sans text-2xl mt-5">NODE DISCUSSION</div>
        <CommentForm submitLabel="Write" handleSubmit={addComment} />
      </div>

      <div className="flex flex-col justify-start overflow-auto mb-16" style={{ height: 'calc(100% - 4rem)' }}>
        {/* had to hard key this thing or it wont scroll */}
        {rootComments.map((rootComment) => (
          <div className="m-4">
            <Comment
              key={rootComment.id}
              comment={rootComment}
              replies={getReplies(rootComment.id)}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              addComment={addComment}
              deleteComment={deleteComment}
              updateComment={updateComment}
              currentUserId={user.email}
            />
          </div>
        ))}
      </div>
    </div>

    // <ThemeProvider theme={Theme}>
    //   <CssBaseline />
    //   <Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
    //     {/* Centered content block with overflow allowed on y-axis */}
    //     <Box
    //       sx={{
    //         position: "relative",
    //         zIndex: 3,
    //         display: "flex",
    //         justifyContent: "center",
    //         alignItems: "center",
    //         height: "100%",
    //       }}
    //     >
    //       {/* <Paper
    //         elevation={3}
    //         sx={{
    //           maxWidth: "600px",
    //           width: "100%",
    //           maxHeight: "calc(100vh - 64px)",
    //           overflowY: "auto", // allows for vertical scrolling inside the paper
    //           margin: "32px",
    //           overflowX: "hidden",
    //           backgroundColor: "rgba(255,255,255,0.3)",
    //           display: "flex", // Use flex layout
    //           flexDirection: "column", // Stack children vertically,
    //           height: "100%",
    //           position: "relative",
    //         }}
    //       > */}
    //       <div className="flex flex-col relative h-full w-full overflow-y-auto">
    //         <Box sx={{ p: 2, textAlign: "center" }}>
    //           <Box className="text-olive font-sans text-2xl">NODE DISCUSSION</Box>
    //           <CommentForm submitLabel="Write" handleSubmit={addComment} />
    //         </Box>
    //         {/* Scrollable comments area */}
    //         <Box
    //           sx={{
    //             p: 2,
    //             flex: 1,
    //             overflowY: "auto", // Enable vertical scrolling for comments
    //           }}
    //         >
    //           {rootComments.map((rootComment) => (
    //             <Comment
    //               key={rootComment.id}
    //               comment={rootComment}
    //               replies={getReplies(rootComment.id)}
    //               activeComment={activeComment}
    //               setActiveComment={setActiveComment}
    //               addComment={addComment}
    //               deleteComment={deleteComment}
    //               updateComment={updateComment}
    //               currentUserId={user.email}
    //             />
    //           ))}
    //         </Box>
    //       </div>
    //       {/* </Paper> */}
    //     </Box>
    //   </Box>
    // </ThemeProvider>
  );
}

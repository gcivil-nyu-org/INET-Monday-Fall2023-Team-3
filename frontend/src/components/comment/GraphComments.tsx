import React, { useState, useEffect, useRef } from "react";
import CommentForm from "./CommentFrom";
import Comment from "./Comment";
import { CommentState } from "./Comment";
import { ThemeProvider, CssBaseline, Grid, Paper, Box } from "@mui/material";
import Theme from "./Theme"; // Import your theme configuration
import { RequestMethods } from "src/utils/utils";
import { BackendModels } from "src/utils/models";
import usePusher from "../pusher/usePusher";
import { useCombinedStore } from "src/store/combinedStore";
import { useShallow } from "zustand/react/shallow";
import { Node } from "reactflow";

interface CommentsProps {
}

const GraphComments: React.FC<CommentsProps> = ({ }) => {
  const { user, token, graph } = useCombinedStore(
    useShallow((state) => ({
      user: state.user,
      token: state.token,
      graph: state.graph,
    }))
  );
  const [severity, setSeverity] = useState<"error" | "success">("error");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [activeComment, setActiveComment] = useState<CommentState | null>(null); // Specify the type for activeComment
  const [comments, setComments] = useState<BackendModels.IComment[]>([]);
  useEffect(() => {
    // Function to fetch comments by node and user details
    const fetchData = async () => {
      try {
        // Get comments associated with the node
        // Check for a valid user session and set user details

        const response = await RequestMethods.graphCommentGetByGraph({
          token: token,
          param: graph.id,
        });
        console.log(response)
        console.log(response.status)
        if (response.status) {
          console.log(response.value);
          const commentsArray = Object.values(response.value);
          setComments(commentsArray);
        } else {
          console.error("Error fetching comments");
        }
      } catch (error) {
        // Handle any errors that occur during the fetch operations
        console.error("Error fetching data:", error);
        setSeverity("error");
        setMessage("An error occurred while fetching data");
      }
    };

    // Call the fetchData function
    fetchData();
  }, []); // Empty dependency array means this effect will only run once on mount

  const rootComments = comments.filter((comment) => comment.parent === null);

  const getReplies = (commentId: string) => {
    return comments
      .filter((comment) => comment.parent === commentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const addComment = (text: string, parentId: string | null) => {
    RequestMethods.graphCommentCreate({
      token: token,
      body: {
        body: text,
        createdBy: user.email,
        belongsTo: graph.id,
      },
    }).then((result) => {
      if (result.status) {
        const newComment = [result.value, ...comments];
        setComments(newComment);
        setActiveComment(null);
      } else {
        console.log("Error creating comment");
      }
    });
  };

  // Subscribe to Pusher channel and events


  usePusher("comments-channel", "new-graph-comment", async (newComment: BackendModels.IComment) => {
    const response = await RequestMethods.graphCommentGetByGraph({
      token: token,
      param: graph.id,
    });
    if (response.status) {
      console.log("usePusher");
      const commentsArray = Object.values(response.value);
      setComments(commentsArray);
    }
  });

  usePusher("comments-channel", "patch-graph-comment", async (newComment: BackendModels.IComment) => {
    const response = await RequestMethods.graphCommentGetByGraph({
      token: token,
      param: graph.id,
    });
    if (response.status) {
      console.log("usePusher");
      const commentsArray = Object.values(response.value);
      setComments(commentsArray);
    }
  });

  usePusher("comments-channel", "delete-graph-comment", async (newComment: BackendModels.IComment) => {
    const response = await RequestMethods.graphCommentGetByGraph({
      token: token,
      param: graph.id,
    });
    if (response.status) {
      console.log("usePusher");
      const commentsArray = Object.values(response.value);
      setComments(commentsArray);
    }
  });

  const updateComment = (text: string, commentId: string) => {
    RequestMethods.graphCommentPatch({
      token: token,
      body: {
        body: text,
      },
      param: commentId,
    }).then((result) => {
      if (result.status) {
        const updatedComments = comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, body: text };
          }
          return comment;
        });
        setComments(updatedComments);
        setActiveComment(null);
      } else {
        console.log("Error updating comment");
      }
    });
  };

  const deleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      RequestMethods.graphCommentDelete({ token: token, param: commentId }).then((result) => {
        console.log(result);
        if (result.status) {
          const updatedComments = comments.filter((comment) => comment.id !== commentId);
          console.log(updatedComments);
          setComments(updatedComments);

          setActiveComment(null);
          console.log(result.value);
        } else {
          console.log("Error deleting comment");
        }
      });
    }
  };

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        {/* Centered content block with overflow allowed on y-axis */}
        <Box
          sx={{
            position: "relative",
            zIndex: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          {/* <Paper
            elevation={3}
            sx={{
              maxWidth: "600px",
              width: "100%",
              maxHeight: "calc(100vh - 64px)",
              overflowY: "auto", // allows for vertical scrolling inside the paper
              margin: "32px",
              overflowX: "hidden",
              backgroundColor: "rgba(255,255,255,0.3)",
              display: "flex", // Use flex layout
              flexDirection: "column", // Stack children vertically,
              height: "100%",
              position: "relative",
            }}
          > */}
          <div className="flex flex-col relative h-full overflow-y-auto">
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Box className="text-olive font-sans text-2xl">
                DISCUSSION
              </Box>
              <CommentForm submitLabel="Write" handleSubmit={addComment} />
            </Box>
            {/* Scrollable comments area */}
            <Box
              sx={{
                p: 2,
                flex: 1,
                overflowY: "auto", // Enable vertical scrolling for comments
              }}
            >
              {rootComments.map((rootComment) => (
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
              ))}
            </Box>
          </div>
          {/* </Paper> */}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default GraphComments;

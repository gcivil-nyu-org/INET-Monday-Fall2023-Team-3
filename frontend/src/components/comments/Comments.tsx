import React, { useState, useEffect, useRef } from "react";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import { CommentState } from "./Comment";
import {
  getComments as getCommentsApi,
  createComment as createCommentApi,
  updateComment as updateCommentApi,
  deleteComment as deleteCommentApi,
} from "../../api";
import { ThemeProvider, CssBaseline, Grid, Paper, Box } from "@mui/material";
import Theme from "./Theme"; // Import your theme configuration
import {
  userGet,
  userUpdate,
  commentGetByNode,
  commentCreate,
  commentUpdate,
  commentDelete,
} from "utils/backendRequests";
import { IComment, INode } from "utils/models";

interface CommentsProps {
  node: INode;
}

const Comments: React.FC<CommentsProps> = ({ node }) => {
  const [severity, setSeverity] = useState<"error" | "success">("error");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [activeComment, setActiveComment] = useState<CommentState | null>(null); // Specify the type for activeComment
  const [comments, setComments] = useState<IComment[]>([]);
  const ws = useRef<WebSocket | null>(null); // Use useRef to persist the WebSocket connection without causing re-renders
  const wsUrl = "ws://127.0.0.1:5000/ws/comment/"; // Your WebSocket URL ws://localhost:8000/ws/somepath/
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    // Establish WebSocket connection

    if (ws.current === null) {
      ws.current = new WebSocket("ws://127.0.0.1:5000/ws/comment/");

      ws.current.onopen = () => {
        console.log("WebSocket connection established");
        ws.current?.send(JSON.stringify({ action: "open", data: token })); // Authenticate if needed
      };

      ws.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      if (ws.current?.readyState === 1) {
        ws.current.close();
      }
    };
  }, [wsUrl, token]);

  useEffect(() => {
    if (ws.current) {
      ws.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log(message);
        if (message.type === "new_comment") {
          console.log(message.data);
          setComments((prevComments) => [...prevComments, message.data]);
          console.log(comments);
        } else if (message.type === "update_comment") {
          console.log("update");
          console.log(message.data);
          console.log(comments);
          const updatedComments = comments.map((comment) => {
            if (comment.id === message.data.id) {
              console.log("Updating comment:", comment);
              return { ...comment, body: message.data.body };
            }
            return comment;
          });
          console.log(updatedComments);
          setComments(updatedComments);
        } else if (message.type === "delete_comment") {
          console.log("delete");
          console.log(message.data);
          const updatedComments = comments.filter((comment) => comment.id !== message.data.id);
          console.log(updatedComments);
          setComments(updatedComments);
        }
        // ... handle messages
      };
    }
  }, [comments, setComments]);
  useEffect(() => {
    // Function to fetch comments by node and user details
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setSeverity("error");
        setMessage("No token found in session storage");
        return;
      }

      try {
        // Get comments associated with the node
        // Check for a valid user session and set user details
        const result = await userGet(token);
        if (result.status) {
          setEmail(result.value.email);
          const response = await commentGetByNode(node.id, token);
          if (response.status) {
            const commentsArray = Object.values(response.value);
            setComments(commentsArray);
          } else {
            console.error("Error fetching comments:", response.error);
          }
        } else {
          // Handle case where user details cannot be fetched
          setSeverity("error");
          setMessage("Cannot get current user");
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
  }, [node]); // Empty dependency array means this effect will only run once on mount

  const rootComments = comments.filter((comment) => comment.parent === null);

  const getReplies = (commentId: string) => {
    return comments
      .filter((comment) => comment.parent === commentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const addComment = (text: string, parentId: string | null) => {
    const payload = {
      body: text,
      user: email, // This should be the user's ID, not their email.
      parent: parentId!,
      relatedToNode: node.id,
    };
    commentCreate(payload, sessionStorage.getItem("token")!).then((result) => {
      if (result.status) {
        const newComment = [result.value, ...comments];
        setComments(newComment);
        setActiveComment(null);
        // Check if the WebSocket is connected
        if (ws && ws.current?.readyState === WebSocket.OPEN) {
          // Send the comment data through the WebSocket
          ws.current.send(JSON.stringify({ action: "create", data: result.value }));
        } else {
          console.error("WebSocket is not connected.");
        }
      } else {
        console.log(result.error);
      }
    });
  };

  const updateComment = (text: string, commentId: string) => {
    const payload = {
      id: commentId,
      body: text,
    };
    commentUpdate(payload, sessionStorage.getItem("token")!).then((result) => {
      if (result.status) {
        const updatedComments = comments.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, body: text };
          }
          return comment;
        });
        setComments(updatedComments);
        setActiveComment(null);
        if (ws && ws.current?.readyState === WebSocket.OPEN) {
          // Send the comment data through the WebSocket
          ws.current.send(JSON.stringify({ action: "update", data: result.value }));
        } else {
          console.error("WebSocket is not connected.");
        }
      } else {
        console.log(result.error);
      }
    });
  };

  const deleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to remove comment?")) {
      commentDelete(commentId, sessionStorage.getItem("token")!).then((result) => {
        console.log(result);
        if (result.status) {
          const updatedComments = comments.filter((comment) => comment.id !== commentId);
          console.log(updatedComments);
          setComments(updatedComments);

          setActiveComment(null);
          console.log(result.value);
          if (ws && ws.current?.readyState === WebSocket.OPEN) {
            // Send the comment data through the WebSocket
            ws.current.send(JSON.stringify({ action: "delete", data: result.value }));
          } else {
            console.error("WebSocket is not connected.");
          }
        } else {
          console.log(result.error);
        }
      });
    }
  };

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <Box sx={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        {/* Semi-transparent overlay */}
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(100, 116, 139, 0.5)", // Adjust transparency as needed
            zIndex: 2,
          }}
        />
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
          <Paper
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
          >
            <Box sx={{ p: 2, textAlign: "center" }}>
              <Box sx={{ fontWeight: "bold", fontSize: "24px", mb: 2, p: 2, textAlign: "center" }}>
                Discussion Section
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
                  currentUserId={email}
                />
              ))}
            </Box>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Comments;

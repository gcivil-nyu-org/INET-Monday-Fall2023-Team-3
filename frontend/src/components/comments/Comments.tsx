import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { CommentState } from './Comment';
import {
    getComments as getCommentsApi,
    createComment as createCommentApi,
    updateComment as updateCommentApi,
    deleteComment as deleteCommentApi,
} from '../../api';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Theme from "./Theme"; // Import your theme configuration
import { userGet, userUpdate, commentGetByNode, commentCreate, commentUpdate, commentDelete } from "utils/backendRequests";
import { IComment, INode } from 'utils/models';

interface CommentsProps {
    node: INode,
}

const Comments: React.FC<CommentsProps> = ({node}) => {
    const [severity, setSeverity] = useState<"error" | "success">("error");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [activeComment, setActiveComment] = useState<CommentState | null>(null); // Specify the type for activeComment
    const [comments, setComments] = useState<IComment[]>([]);

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
      

    const rootComments = comments.filter(
        (comment) => comment.parent === null
    );

    const getReplies = (commentId: string) => {
        return comments
            .filter((comment) => comment.parent === commentId)
            .sort(
                (a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
    }


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
        commentUpdate(payload, sessionStorage.getItem("token")!).then(() => {
            const updatedComments = comments.map((comment) => {
                if (comment.id === commentId) {
                    return { ...comment, body: text };
                }
                return comment;
            });
            setComments(updatedComments);
            setActiveComment(null);
        });
    };

    const deleteComment = (commentId: string) => {
        if (window.confirm('Are you sure you want to remove comment?')) {
            commentDelete(commentId, sessionStorage.getItem("token")!).then(() => {
                const updatedComments = comments.filter(
                    (comment) => comment.id !== commentId
                );
                setComments(updatedComments);
            });
        }
    };

    return (
        <ThemeProvider theme={Theme}>
        <CssBaseline />
        <div className="mt-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="text-2xl">Discussion Section</div>
            <CommentForm submitLabel="Write" handleSubmit={addComment} />
            <div className="mt-4">
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
            </div>
        </div>
        </ThemeProvider>
    );
};

export default Comments;

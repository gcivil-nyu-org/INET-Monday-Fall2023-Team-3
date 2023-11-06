import React, { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import Comment from './Comment';
import { CommentState } from './Comment';
import { Comment as CommentFromApi } from '../../api';
import {
    getComments as getCommentsApi,
    createComment as createCommentApi,
    updateComment as updateCommentApi,
    deleteComment as deleteCommentApi,
} from '../../api';
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Theme from "./Theme"; // Import your theme configuration
import { userGet, userUpdate } from "utils/backendRequests";

interface CommentsProps {
    commentsUrl: string;
    currentUserId: string;
}

const Comments: React.FC<CommentsProps> = ({ commentsUrl, currentUserId }) => {
    const [severity, setSeverity] = useState<"error" | "success">("error");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");
    const [backendComments, setBackendComments] = useState<CommentFromApi[]>([]); // Specify the type for backendComments
    const [activeComment, setActiveComment] = useState<CommentState | null>(null); // Specify the type for activeComment

    useEffect(() => {
        userGet(sessionStorage.getItem("token")!).then((result) => {
          if (result.status) {
            const user = result.value;
            setEmail(user.email);
            setUsername(user.username);
          } else {
            setSeverity("error");
            setMessage("Cannot get current user");
          }
        });
      }, []);

    const rootComments = backendComments.filter(
        (backendComment) => backendComment.parentId === null
    );

    const getReplies = (commentId: string) => {
        return backendComments
            .filter((backendComment) => backendComment.parentId === commentId)
            .sort(
                (a, b) =>
                    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
    }


    const addComment = (text: string, parentId: string | null) => {
        createCommentApi(text, parentId).then(comment => {
            const newComment = [comment, ...backendComments]
            setBackendComments(newComment);
            setActiveComment(null);
        });
    };

    const updateComment = (text: string, commentId: string) => {
        updateCommentApi(text).then(() => {
            const updatedBackendComments = backendComments.map((backendComment) => {
                if (backendComment.id === commentId) {
                    return { ...backendComment, body: text };
                }
                return backendComment;
            });
            setBackendComments(updatedBackendComments);
            setActiveComment(null);
        });
    };

    const deleteComment = (commentId: string) => {
        if (window.confirm('Are you sure you want to remove comment?')) {
            deleteCommentApi().then(() => {
                const updatedBackendComments = backendComments.filter(
                    (backendComment) => backendComment.id !== commentId
                );
                setBackendComments(updatedBackendComments);
            });
        }
    };

    useEffect(() => {
        getCommentsApi().then((data) => {
            setBackendComments(data);
        });
    }, []);

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
                        currentUserId={currentUserId}
                    />
                ))}
            </div>
        </div>
        </ThemeProvider>
    );
};

export default Comments;

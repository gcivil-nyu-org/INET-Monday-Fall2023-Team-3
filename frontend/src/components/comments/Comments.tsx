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

interface CommentsProps {
    commentsUrl: string;
    currentUserId: string;
}

const Comments: React.FC<CommentsProps> = ({ commentsUrl, currentUserId }) => {
    const [backendComments, setBackendComments] = useState<CommentFromApi[]>([]); // Specify the type for backendComments
    const [activeComment, setActiveComment] = useState<CommentState | null>(null); // Specify the type for activeComment

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
        <div className="comments">
            <div className="comment-form-title">Write a comment</div>
            <CommentForm submitLabel="Write" handleSubmit={addComment} />
            <div className="comments-container">
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
    );
};

export default Comments;

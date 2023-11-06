import React from 'react';
import CommentForm from './CommentForm';
import { Button, Avatar, Dialog, DialogTitle } from "@mui/material";
export interface CommentProps {
    comment: {
        id: string;
        username: string;
        body: string;
        userId: string;
        createdAt: string;
    };
    replies: any[]; // Update the type as needed
    setActiveComment: React.Dispatch<React.SetStateAction<CommentState | null>>;
    activeComment: CommentState | null;
    updateComment: (text: string, id: string) => void;
    deleteComment: (id: string) => void;
    addComment: (text: string, parentId: string) => void;
    parentId?: string | null;
    currentUserId: string;
}

export interface CommentState {
    id: string;
    type: 'editing' | 'replying';
}

const Comment: React.FC<CommentProps> = ({
    comment,
    replies,
    setActiveComment,
    activeComment,
    updateComment,
    deleteComment,
    addComment,
    parentId = null,
    currentUserId,
}) => {
    const isEditing =
        activeComment &&
        activeComment.id === comment.id &&
        activeComment.type === 'editing';
    const isReplying =
        activeComment &&
        activeComment.id === comment.id &&
        activeComment.type === 'replying';
    const canDelete = currentUserId === comment.userId && replies.length === 0;
    const canReply = Boolean(currentUserId);
    const canEdit = currentUserId === comment.userId;
    const replyId = parentId ? parentId : comment.id;
    const createdAt = new Date(comment.createdAt).toLocaleDateString();

    return (
        <div key={comment.id} className="flex mb-7">
            <div className="mr-4">
                <Avatar className="w-12 h-12" src="https://mui.com/static/images/avatar/1.jpg" />
            </div>
            <div className="w-full">
                <div className="flex">
                    <div className="mr-4 text-lg text-white">{comment.username}</div>
                    <div>{createdAt}</div>
                </div>
                {!isEditing && <div className="text-xl">{comment.body}</div>}
                {isEditing && (
                    <CommentForm
                        submitLabel="Update"
                        hasCancelButton
                        initialText={comment.body}
                        handleSubmit={(text) => updateComment(text, comment.id)}
                        handleCancel={() => {
                            setActiveComment(null);
                        }}
                    />
                )}
                <div className="flex text-sm text-white	 cursor-pointer mt-4">
                    {canReply && (
                        <div
                            className="mr-4 hover:underline"
                            onClick={() =>
                                setActiveComment({ id: comment.id, type: 'replying' })
                            }
                        >
                            Reply
                        </div>
                    )}
                    {canEdit && (
                        <div
                            className="mr-4 hover:underline"
                            onClick={() =>
                                setActiveComment({ id: comment.id, type: 'editing' })
                            }
                        >
                            Edit
                        </div>
                    )}
                    {canDelete && (
                        <div
                            className="mr-4 hover:underline"
                            onClick={() => deleteComment(comment.id)}
                        >
                            Delete
                        </div>
                    )}
                </div>
                {isReplying && (
                    <CommentForm
                        submitLabel="Reply"
                        handleSubmit={(text) => addComment(text, replyId)}
                    />
                )}
                {replies.length > 0 && (
                    <div className="mt-6">
                        {replies.map((reply) => (
                            <Comment
                                comment={reply}
                                key={reply.id}
                                setActiveComment={setActiveComment}
                                activeComment={activeComment}
                                updateComment={updateComment}
                                deleteComment={deleteComment}
                                addComment={addComment}
                                parentId={comment.id}
                                replies={[]} // Update the type as needed
                                currentUserId={currentUserId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;
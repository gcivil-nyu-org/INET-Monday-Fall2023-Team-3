import React from 'react';
import CommentForm from './CommentForm';

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
        <div key={comment.id} className="comment">
            <div className="comment-image-container">
                <img src="/user-icon.png" alt="User Icon" />
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.username}</div>
                    <div>{createdAt}</div>
                </div>
                {!isEditing && <div className="comment-text">{comment.body}</div>}
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
                <div className="comment-actions">
                    {canReply && (
                        <div
                            className="comment-action"
                            onClick={() =>
                                setActiveComment({ id: comment.id, type: 'replying' })
                            }
                        >
                            Reply
                        </div>
                    )}
                    {canEdit && (
                        <div
                            className="comment-action"
                            onClick={() =>
                                setActiveComment({ id: comment.id, type: 'editing' })
                            }
                        >
                            Edit
                        </div>
                    )}
                    {canDelete && (
                        <div
                            className="comment-action"
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
                    <div className="replies">
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

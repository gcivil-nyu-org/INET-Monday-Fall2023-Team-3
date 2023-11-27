import React, { useState, useEffect } from "react";
import CommentForm from "./CommentForm";
import { Button, Avatar, Dialog, DialogTitle } from "@mui/material";
import {
  userGetName,
  userUpdate,
  commentGetByNode,
  commentCreate,
  commentUpdate,
  commentDelete,
} from "utils/backendRequests";
import { IComment } from "utils/models";
export interface CommentProps {
  comment: IComment;
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
  type: "editing" | "replying";
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
  const [username, setUsername] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const isEditing =
    activeComment && activeComment.id === comment.id && activeComment.type === "editing";
  const isReplying =
    activeComment && activeComment.id === comment.id && activeComment.type === "replying";
  const canDelete = currentUserId === comment.user && replies.length === 0;
  const canReply = Boolean(currentUserId);
  const canEdit = currentUserId === comment.user;
  const replyId = parentId ? parentId : comment.id;

  useEffect(() => {
    // Function to fetch user by comments and user details
    const fetchData = async () => {
      const token = sessionStorage.getItem("token");
      try {
        // Get user associated with the comment
        // Check for a valid user session and set user details
        const result = await userGetName(comment.user, token!);
        if (result.status) {
          const username = result.value.username;
          setUsername(username);
          setCreatedAt(new Date(comment.createdAt).toLocaleString());
        } else {
          // Handle case where user details cannot be fetched
          console.error("error fetching user:", result.status);
        }
      } catch (error) {
        // Handle any errors that occur during the fetch operations
        console.error("Error fetching data:", error);
      }
    };
    // Call the fetchData function
    fetchData();
  }, [comment.createdAt, comment.user]); // Empty dependency array means this effect will only run once on mount
  return (
    <div key={comment.id} className="flex mb-7">
      <div className="mr-4">
        <Avatar className="w-12 h-12" src="https://mui.com/static/images/avatar/1.jpg" />
      </div>
      <div className="bg-steel-blue-700">
        <div className="flex items-center space-x-2">
          <div className="ml-2 text-md text-black font-bold">{username}</div>
          <div className='text-yellow-300 font-bold'>{createdAt}</div>
        </div>
        {!isEditing &&
          <div className="ml-3 mr-4 text-lg text-black bg-white mt-2 rounded-lg p-4">
            {comment.body}
          </div>}
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
        <div className="flex text-sm cursor-pointer mt-4">
          {canReply && (
            <div
              className="ml-3 mr-3 hover:underline text-blue-600 font-bold"
              onClick={() => {
                setActiveComment({ id: comment.id, type: "replying" });
              }}
            >
              Reply
            </div>
          )}
          {canEdit && (
            <div
              className="ml-3 mr-3 hover:underline text-gray-700 font-bold"
              onClick={() => setActiveComment({ id: comment.id, type: "editing" })}
            >
              Edit
            </div>
          )}
          {canDelete && (
            <div className="ml-3 mr-3 hover:underline text-red-600 font-bold" onClick={() => deleteComment(comment.id)}>
              Delete
            </div>
          )}
        </div>
        {isReplying && (
          <CommentForm submitLabel="Reply" handleSubmit={(text) => addComment(text, replyId)} />
        )}
        {replies.length > 0 && (
          <div className="mt-4">
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

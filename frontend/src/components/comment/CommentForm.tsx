import React, { useState, FormEvent } from 'react';
import { Button } from "@mui/material";


interface CommentFormProps {
  handleSubmit: (text: string, parentId: string | null) => void;
  submitLabel: string;
  hasCancelButton?: boolean;
  handleCancel?: () => void;
  initialText?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  handleSubmit,
  submitLabel,
  hasCancelButton = false,
  handleCancel,
  initialText = '',
}) => {
  const [text, setText] = useState(initialText);
  const isTextareaDisabled = text.length === 0;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    handleSubmit(text, null);
    setText('');
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col justify-center w-full"> {/* Flex container for buttons */}
        <textarea
          className="resize-none w-full h-32 mt-5 mb-5 rounded-xl"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button
          // className="rounded-md hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          className="m-auto bg-transparent text-olive font-sans rounded-full
          border-2 border-solid disabled:opacity-70 disabled:cursor-not-allowed"
          variant="contained"
          disabled={isTextareaDisabled}
          type="submit">
          {submitLabel}
        </Button>
        {hasCancelButton && (
          <button
            type="button"
            className="text-base ml-4 px-4 py-2 bg-blue-700 rounded-md text-white hover:cursor-pointer hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed
                    ml-4 "
            onClick={handleCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default CommentForm;

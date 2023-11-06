import React, { useState, FormEvent } from 'react';

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
            <textarea
                className="w-full h-32 mb-4 mt-4 border border-white"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="text-base px-4 py-2 bg-blue-700 rounded-md text-white hover:cursor-pointer hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" disabled={isTextareaDisabled}>
                {submitLabel}
            </button>
            {hasCancelButton && (
                <button
                    type="button"
                    className="text-base px-4 py-2 bg-blue-700 rounded-md text-white hover:cursor-pointer hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed
                    ml-4 "
                    onClick={handleCancel}>
                    Cancel
                </button>
            )}
        </form>
    );
};

export default CommentForm;

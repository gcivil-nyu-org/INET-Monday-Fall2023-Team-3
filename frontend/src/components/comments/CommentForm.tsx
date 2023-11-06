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
                className="comment-form-textarea"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button className="comment-form-button" disabled={isTextareaDisabled}>
                {submitLabel}
            </button>
            {hasCancelButton && (
                <button
                    type="button"
                    className="comment-form-button comment-form-cancel-button"
                    onClick={handleCancel}
                >
                    Cancel
                </button>
            )}
        </form>
    );
};

export default CommentForm;

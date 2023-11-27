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
        <form onSubmit={onSubmit} className="flex flex-col items-center">
            <textarea
                className="w-full p-3 mt-3 ml-3 mr-3 mb-3 border rounded border-black"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-center w-full"> {/* Flex container for buttons */}
                <button className="text-base ml-4 px-4 py-2 bg-blue-700 rounded-md text-white hover:cursor-pointer hover:bg-blue-500 disabled:opacity-70 disabled:cursor-not-allowed" disabled={isTextareaDisabled}>
                    {submitLabel}
                </button>
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

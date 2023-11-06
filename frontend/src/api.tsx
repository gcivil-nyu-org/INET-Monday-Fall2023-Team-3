export const getComments = async () => {
    return [
        {
            id: "1",
            body: "Shall we review the PRs today?",
            username: "Sahil",
            userId: "1",
            parentId: null,
            createdAt: "2023-11-01T23:00:33.010+02:00",
        },
        {
            id: "2",
            body: "My explanation works!",
            username: "Haoliang",
            userId: "2",
            parentId: null,
            createdAt: "2023-10-30T23:00:33.010+02:00",
        },
        {
            id: "3",
            body: "Looking forward to the next sprint",
            username: "Siyan",
            userId: "2",
            parentId: "1",
            createdAt: "2023-10-25T23:00:33.010+02:00",
        },
        {
            id: "4",
            body: "I am working on the node edge epic",
            username: "Yulin",
            userId: "2",
            parentId: "2",
            createdAt: "2023-10-28T23:00:33.010+02:00",
        },
    ] as Comment[]; // Added type annotation for the returned array
};

export const createComment = async (text: string, parentId: string | null = null) => {
    return {
        id: Math.random().toString(36).substr(2, 9),
        body: text,
        parentId,
        userId: "1",
        username: "Layla",
        createdAt: new Date().toISOString(),
    } as Comment; // Added type annotation for the returned object
};

export const updateComment = async (text: string) => {
    return { text } as CommentUpdateResponse; // Added type annotation for the returned object
};

export const deleteComment = async () => {
    return {}; // Return type not specified since it's an empty object
};

// Define the types
export interface Comment {
    id: string;
    body: string;
    username: string;
    userId: string;
    parentId: string | null;
    createdAt: string;
}

interface CommentUpdateResponse {
    text: string;
}

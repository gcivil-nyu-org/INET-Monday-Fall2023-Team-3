// UserStory.tsx
import React, { useState } from 'react';

interface UserStoryProps {
  title: string;
  content: string;
  bgColor: string;
  rotate: string;
}

const UserStory: React.FC<UserStoryProps> = ({ rotate, title, content, bgColor }) => {
  const [showText, setShowText] = useState(false);

  const handleCardClick = () => {
    setShowText(!showText);
  };

  return (
    <div
      className={`w-4/12 h-80 m-5 shadow-lg overflow-auto cursor-pointer bg-${bgColor} ${rotate}`}
      onClick={handleCardClick}
    >
      {!showText && <p className="m-5 font-sans text-olive flex items-center justify-center h-3/4">
        <h3 className='text-center text-2xl'>{title}</h3>
      </p>}
      {showText && <p className="m-5 font-sans text-olive text-xl">
        <h4 className="font-serif">{content}</h4>
      </p>}
    </div>
  );
};

export default UserStory;

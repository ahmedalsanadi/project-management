import React from 'react';

export const Header = ({ header, subHeader }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {header}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400">{subHeader}</p>
    </div>
  );
};

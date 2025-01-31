const Card = ({ title, icon: Icon, children }) => {
  return (
    <div className="bg-white  border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      {/* <div className=" bg-white border border-gray-200 dark:border-gray-800 dark:bg-purple-500/10 rounded-2xl p-6 shadow-sm"> */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          {title}
        </h3>
        <Icon className="w-5 h-5 text-gray-500" />
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Card;

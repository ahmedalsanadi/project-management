export const UserRoleCard = ({ role, count }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-600 dark:text-gray-300">{role}</span>
      <span className="px-3 py-1 text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
        {count}
      </span>
    </div>
  );
};

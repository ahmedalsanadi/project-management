const RecentUserCard = ({ user }) => (
  <div className="py-3 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
        <span className="text-white text-sm font-medium">
          {user.name.charAt(0)}
        </span>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {user.name}
        </p>
        <p className="text-xs text-gray-500">{user.email}</p>
      </div>
    </div>
    <span className="text-xs text-gray-500">
      {new Date(user.created_at).toLocaleDateString()}
    </span>
  </div>
);

export default RecentUserCard;

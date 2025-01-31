const ProgressBar = ({ progress, color }) => (
  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
    <div
      className={`h-full rounded-full ${color}`}
      style={{ width: `${progress}%` }}
    />
  </div>
);
export default ProgressBar;

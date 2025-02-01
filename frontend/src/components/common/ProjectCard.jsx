import ProgressBar from '@/components/common/ProgressBar';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-5 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-semibold text-gray-900 dark:text-white">
          {project.name}
        </h4>
        <span className="px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full">
          {project.tasks_count} Tasks
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {project.description.split(' ').slice(0, 6).join(' ')}...
      </p>

      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600 dark:text-gray-300">Progress</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {project.progress}%
          </span>
        </div>

        <ProgressBar
          progress={project.progress}
          color={
            project.progress <= 20
              ? 'bg-red-500'
              : project.progress <= 40
                ? 'bg-orange-500'
                : project.progress <= 60
                  ? 'bg-yellow-500'
                  : project.progress <= 80
                    ? 'bg-green-500'
                    : 'bg-emerald-500'
          }
        />

        <div className="pt-3">
          <a
            href={`/dashboard/projects/${project.id}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white transition-colors rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

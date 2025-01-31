import Card from '@/components/common/Card';
import ProjectCard from '@/components/common/ProjectCard';
import { Briefcase } from 'lucide-react';

const ProjectsOverview = ({ projects }) => {
  return (
    <Card title="Projects Overview" icon={Briefcase}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Card>
  );
};

export default ProjectsOverview;

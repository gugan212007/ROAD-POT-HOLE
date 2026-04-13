import { useApp } from '@/context/AppContext';
import { PROJECTS } from '@/lib/demo-data';
import ReportCard from '@/components/ReportCard';

const ProjectView = () => {
  const { reports, selectedProject, selectProject } = useApp();

  // Map project names to location_name substrings for filtering
  const projectLocationMap: Record<string, string[]> = {
    'MG Road Zone': ['MG Road'],
    'Ring Road': ['Ring Road'],
    'NH-48': ['NH-48', 'Gurgaon'],
    'Noida Sector': ['Noida'],
  };

  const matchTerms = selectedProject ? projectLocationMap[selectedProject] || [] : [];
  const filtered = reports.filter(r =>
    matchTerms.some(term => r.location_name.toLowerCase().includes(term.toLowerCase()))
  );

  const project = PROJECTS.find(p => p.name === selectedProject);

  return (
    <>
      <div className="px-8 py-6 border-b border-border animate-fade-up max-[768px]:px-4 max-[768px]:py-4 max-[480px]:px-3">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[28px] font-extrabold tracking-tight max-[768px]:text-[22px] max-[480px]:text-xl">
            {selectedProject}
          </h1>
          <button
            onClick={() => selectProject(null)}
            className="px-3.5 py-1.5 rounded-xs border border-border bg-card text-muted-foreground text-[13px] font-semibold shadow-xs hover:border-accent/30 hover:text-accent transition-all"
          >
            ← Back
          </button>
        </div>
        <p className="text-[13.5px] text-muted-foreground mt-1.5 max-[768px]:text-[12.5px]">
          {filtered.length} report{filtered.length !== 1 ? 's' : ''} in this zone · {project?.count || 0} total tracked
        </p>
      </div>

      <div className="flex-1 p-7 overflow-y-auto animate-fade-up max-[768px]:p-4 max-[480px]:p-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-[52px] block mb-3.5">📍</span>
            <div className="text-[17px] font-bold text-muted-foreground mb-2">No reports in this zone</div>
            <div className="text-[13px] text-muted-foreground">Reports matching "{selectedProject}" location will appear here</div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 max-[768px]:grid-cols-1 max-[1024px]:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] min-[1400px]:grid-cols-[repeat(auto-fill,minmax(340px,1fr))]">
            {filtered.map((r, i) => <ReportCard key={r.id} report={r} isAdmin delay={i} />)}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectView;

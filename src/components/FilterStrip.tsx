import { useApp } from '@/context/AppContext';
import { statusLabel } from '@/lib/demo-data';

interface Props {
  counts: Record<string, number>;
}

const FilterStrip = ({ counts }: Props) => {
  const { filter, setFilter } = useApp();
  const filters = ['all', 'pending', 'in_progress', 'resolved'];

  return (
    <div className="flex gap-1 p-1 rounded-[10px] bg-secondary border border-border mb-5 w-fit overflow-x-auto scrollbar-hide max-[768px]:w-full">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-4 py-1.5 rounded-lg text-[13px] font-medium border border-transparent whitespace-nowrap transition-all max-[768px]:px-3 max-[768px]:text-xs ${
            filter === f
              ? 'bg-card text-foreground shadow-xs border-border'
              : 'text-muted-foreground hover:text-foreground/70'
          }`}
        >
          {f === 'all' ? 'All' : statusLabel(f)}
          <span className="opacity-50 ml-1 text-[11px]">{counts[f] ?? 0}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterStrip;

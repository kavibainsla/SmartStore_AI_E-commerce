import { Button } from './Button';

export const Pagination = ({ page, pages, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3 dark:border-slate-700">
      <Button variant="secondary" className="text-sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-slate-500">
        Page {page} of {pages}
      </span>
      <Button
        variant="secondary"
        className="text-sm"
        disabled={page >= pages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
};

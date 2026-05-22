import { HiOutlineExclamationCircle } from 'react-icons/hi2';
import { Button } from './Button';

export const ErrorState = ({ title = 'Something went wrong', message, onRetry }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 py-12 text-center dark:border-rose-800/50 dark:bg-rose-900/20">
    <HiOutlineExclamationCircle className="mb-4 h-12 w-12 text-rose-500" />
    <h3 className="text-lg font-semibold text-rose-800 dark:text-rose-300">{title}</h3>
    <p className="mt-2 max-w-md text-sm text-rose-600 dark:text-rose-400">{message}</p>
    {onRetry && (
      <Button variant="secondary" className="mt-6" onClick={onRetry}>
        Try Again
      </Button>
    )}
  </div>
);

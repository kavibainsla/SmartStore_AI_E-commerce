import { Modal } from './Modal';
import { Button } from './Button';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, itemName, loading }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete" size="sm">
    <p className="text-slate-600 dark:text-slate-400">
      Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{itemName}</strong>?
      This action cannot be undone.
    </p>
    <div className="mt-6 flex justify-end gap-3">
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} disabled={loading}>
        {loading ? 'Deleting...' : 'Delete'}
      </Button>
    </div>
  </Modal>
);

import { useState } from 'react';
import { submitTask } from '../../api/submissions';

const SubmitTaskModal = ({ task, onClose, onSubmitted }) => {
  const [file, setFile]   = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (file) formData.append('file', file);
    formData.append('notes', notes);
    try {
      await submitTask(task._id, formData);
      onSubmitted();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[200] p-6"
      onClick={onClose}>
      <div className="bg-bg-card border border-border rounded-xl w-full max-w-lg shadow-[0_32px_80px_rgba(0,0,0,0.6)] animate-modal-in"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-[17px] font-semibold text-text-primary">Submit Task</h2>
          <button onClick={onClose}
            className="bg-transparent border-none text-text-muted text-base cursor-pointer px-2 py-1 rounded-md hover:bg-bg-hover hover:text-text-primary transition-all">✕</button>
        </div>

        {/* Task info strip */}
        <div className="px-6 py-3.5 bg-bg-surface border-b border-border">
          <p className="text-[14px] font-semibold text-text-primary">{task.title || 'Untitled Task'}</p>
          {task.dueDate && (
            <p className="text-[12px] text-text-faint mt-0.5">Due: {task.dueDate}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">

          {/* File upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-muted">
              Upload File
            </label>
            
            <input id="sub-file" type="file" onChange={handleFileChange} className="file-input-hidden" />
            <label htmlFor="sub-file"
              className="flex flex-col items-center justify-center gap-2 py-7 px-4 bg-bg-input border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-center">
              {file ? (
                <span className="text-[13px] text-primary font-medium break-all">📎 {file.name}</span>
              ) : (
                <>
                  <span className="text-xl">⬆</span>
                  <span className="text-[13px] text-text-muted">Click to choose a file</span>
                  
                </>
              )}
            </label>
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-muted">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4}
              placeholder="Describe what you've done, include any relevant links..."
              className="w-full bg-bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none placeholder:text-[#4e4a6e] focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-all font-sans resize-y" />
          </div>

          
          <div className="flex justify-end gap-2.5 pt-1 border-t border-border mt-1">
            <button type="button" onClick={onClose} disabled={loading}
              className="px-5 py-2.5 bg-bg-input text-text-muted border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-bg-hover hover:text-text-primary transition-all font-sans disabled:opacity-50 disabled:cursor-not-allowed">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer btn-gradient border-none font-sans disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Submitting...' : 'Submit Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitTaskModal;

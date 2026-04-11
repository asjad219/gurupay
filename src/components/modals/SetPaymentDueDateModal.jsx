import { useState } from "react";

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

const daysUntil = (d) => {
  if (!d) return null;
  const now = new Date();
  const dueDate = new Date(d);
  const diff = dueDate - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

const presets = [
  { label: "Due in 7 days", offset: 7 },
  { label: "Due in 14 days", offset: 14 },
  { label: "End of month", offset: "eom" },
  { label: "Due in 30 days", offset: 30 },
];

export default function SetPaymentDueDateModal({ payment, onSave, onClose }) {
  const [dueDate, setDueDate] = useState(payment?.dueDate || "");

  const applyPreset = (offset) => {
    const today = new Date();
    let date = new Date(today);

    if (offset === "eom") {
      date = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else {
      date.setDate(date.getDate() + offset);
    }

    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    setDueDate(`${yyyy}-${mm}-${dd}`);
  };

  const days = daysUntil(dueDate);

  const handleSave = () => {
    if (!dueDate) {
      alert("Please select a due date");
      return;
    }
    onSave({ ...payment, dueDate });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{background: "var(--gradient-primary)"}}>
          <h2 className="modal-title">Set Due Date</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Select Due Date</label>
            <input
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={{ marginBottom: 8 }}
            />
            {dueDate && (
              <div className="input-hint">
                {days > 0 ? `Due in ${days} days` : days === 0 ? "Due today" : `${Math.abs(days)} days overdue`}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="input-label">Quick Presets</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset.offset)}
                  style={{
                    padding: "10px 12px",
                    border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    background: "var(--bg3)",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--text2)",
                    transition: "var(--transition-smooth)",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "var(--gradient-primary)";
                    e.target.style.color = "white";
                    e.target.style.border = "1.5px solid var(--blue)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "var(--bg3)";
                    e.target.style.color = "var(--text2)";
                    e.target.style.border = "1.5px solid var(--border)";
                  }}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {dueDate && (
            <div
              style={{
                padding: "14px 12px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 16,
                fontSize: "13px",
                color: "var(--text2)",
              }}
            >
              <strong>Due Date:</strong> {fmtDate(dueDate)}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{background: "var(--gradient-primary)"}}
          >
            Set Due Date
          </button>
        </div>
      </div>
    </div>
  );
}

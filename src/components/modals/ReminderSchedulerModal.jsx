import { useState } from "react";

const fmtDateTime = (dt) =>
  dt ? new Date(dt).toLocaleString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "";

const reminderOptions = [
  { label: "1 day before due date", offset: -1 },
  { label: "On due date", offset: 0 },
  { label: "1 day after due date", offset: 1 },
  { label: "3 days after due date", offset: 3 },
];

export default function ReminderSchedulerModal({ payment, student, batch, onSave, onClose }) {
  const [reminderEnabled, setReminderEnabled] = useState(!!payment?.reminderScheduledAt);
  const [reminderOffset, setReminderOffset] = useState(-1);
  const [reminders, setReminders] = useState(payment?.reminders || []);

  const calculateReminderDate = (offset) => {
    if (!payment?.dueDate) return null;
    const dueDate = new Date(payment.dueDate);
    dueDate.setDate(dueDate.getDate() + offset);
    return dueDate.toISOString();
  };

  const addReminder = () => {
    const reminderDate = calculateReminderDate(reminderOffset);
    if (!reminderDate) return;

    const newReminder = {
      id: Date.now().toString(),
      offset: reminderOffset,
      scheduledAt: reminderDate,
      sent: false,
    };

    setReminders([...reminders, newReminder]);
  };

  const removeReminder = (id) => {
    setReminders(reminders.filter((r) => r.id !== id));
  };

  const handleSave = async () => {
    onSave(payment, { enabled: reminderEnabled, reminders });
    onClose();
  };

  const getReminderLabel = (offset) => {
    const option = reminderOptions.find((o) => o.offset === offset);
    return option?.label || `${offset} days`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{background: "var(--gradient-warning)"}}>
          <h2 className="modal-title">Schedule Reminders</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {/* Header */}
          <div
            style={{
              padding: "14px",
              background: "var(--bg3)",
              borderRadius: "var(--radius-sm)",
              marginBottom: 20,
              fontSize: "13px",
            }}
          >
            <div style={{ marginBottom: 6 }}>
              <strong>{student?.name}</strong> · {batch?.name}
            </div>
            <div style={{ fontSize: "12px", color: "var(--text3)" }}>
              Due: {payment?.dueDate ? new Date(payment.dueDate).toLocaleDateString("en-IN") : "Not set"}
            </div>
          </div>

          {/* Enable Toggle */}
          <div
            style={{
              padding: "12px 14px",
              background: "var(--bg3)",
              borderRadius: "var(--radius-sm)",
              marginBottom: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
            onClick={() => setReminderEnabled(!reminderEnabled)}
          >
            <div>
              <strong style={{ fontSize: "13px" }}>Enable Reminders</strong>
              <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: 2 }}>
                Schedule automatic WhatsApp reminders before due date
              </div>
            </div>
            <div
              style={{
                width: 44,
                height: 24,
                background: reminderEnabled ? "var(--accent)" : "#e2e8f0",
                borderRadius: 99,
                transition: "background 0.2s",
                display: "flex",
                alignItems: "center",
                padding: "2px",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  background: "white",
                  borderRadius: 50,
                  transition: "transform 0.2s",
                  transform: reminderEnabled ? "translateX(20px)" : "translateX(0)",
                }}
              />
            </div>
          </div>

          {reminderEnabled && (
            <>
              {/* Add Reminder */}
              <div className="input-group" style={{ marginBottom: 16 }}>
                <label className="input-label">Add Reminder</label>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <select
                    className="input"
                    value={reminderOffset}
                    onChange={(e) => setReminderOffset(+e.target.value)}
                    style={{ flex: 1 }}
                  >
                    {reminderOptions.map((opt) => (
                      <option key={opt.offset} value={opt.offset}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={addReminder}
                    style={{
                      padding: "9px 16px",
                      background: "var(--gradient-warning)",
                      color: "white",
                      border: "none",
                      borderRadius: "var(--radius-sm)",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                      transition: "var(--transition-smooth)",
                    }}
                    onMouseEnter={(e) => (e.target.style.transform = "scale(1.02)")}
                    onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Scheduled Reminders List */}
              {reminders.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <label className="input-label">Scheduled Reminders</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {reminders.map((reminder) => (
                      <div
                        key={reminder.id}
                        style={{
                          padding: "12px 14px",
                          background: "var(--bg3)",
                          borderLeft: "3px solid var(--amber)",
                          borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          fontSize: "13px",
                        }}
                      >
                        <div>
                          <strong>{getReminderLabel(reminder.offset)}</strong>
                          <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: 2 }}>
                            {fmtDateTime(reminder.scheduledAt)}
                          </div>
                        </div>
                        <button
                          onClick={() => removeReminder(reminder.id)}
                          style={{
                            background: "var(--red)",
                            color: "white",
                            border: "none",
                            borderRadius: "var(--radius-sm)",
                            padding: "4px 8px",
                            cursor: "pointer",
                            fontSize: "11px",
                            fontWeight: 600,
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {reminders.length === 0 && (
                <div
                  style={{
                    padding: "14px",
                    background: "var(--blue-light)",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "12px",
                    color: "var(--text2)",
                    marginBottom: 16,
                    textAlign: "center",
                  }}
                >
                  No reminders scheduled yet. Add one above!
                </div>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{background: "var(--gradient-warning)"}}
          >
            Save Reminders
          </button>
        </div>
      </div>
    </div>
  );
}

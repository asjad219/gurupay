import { useState } from "react";

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

export default function BulkMarkPaidModal({ payments, students, batches, selectedMonth, onSave, onClose }) {
  const [selected, setSelected] = useState(new Set());
  const [paidDate, setPaidDate] = useState(new Date().toISOString().split("T")[0]);

  const getBatch = (batchId) => batches.find((b) => b.id === batchId);
  const getStudent = (studentId) => students.find((s) => s.id === studentId);

  const toggleSelect = (paymentId) => {
    const newSelected = new Set(selected);
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId);
    } else {
      newSelected.add(paymentId);
    }
    setSelected(newSelected);
  };

  const selectAll = () => {
    if (selected.size === payments.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(payments.map((p) => p.id)));
    }
  };

  const selectedPayments = payments.filter((p) => selected.has(p.id));
  const selectedAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0);

  const handleSave = async () => {
    if (selected.size === 0) {
      alert("Please select at least one payment");
      return;
    }

    onSave(selectedPayments, paidDate);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{background: "var(--gradient-primary)"}}>
          <h2 className="modal-title">Mark as Paid</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-content">
          {/* Date Input */}
          <div className="input-group" style={{ marginBottom: 18 }}>
            <label className="input-label">Payment Date (for all selected)</label>
            <input
              type="date"
              className="input"
              value={paidDate}
              onChange={(e) => setPaidDate(e.target.value)}
            />
          </div>

          {/* Select All */}
          <div
            style={{
              padding: "12px 14px",
              background: "var(--bg3)",
              borderRadius: "var(--radius-sm)",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={selectAll}
          >
            <input
              type="checkbox"
              checked={selected.size === payments.length && payments.length > 0}
              onChange={selectAll}
              style={{ cursor: "pointer" }}
            />
            <div style={{ flex: 1 }}>
              <strong>Select All</strong>
              <div style={{ fontSize: "11px", color: "var(--text4)" }}>
                {selected.size} of {payments.length} payments selected
              </div>
            </div>
          </div>

          {/* Payments List */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "300px", overflowY: "auto", marginBottom: 16 }}>
            {payments.map((payment) => {
              const student = getStudent(payment.studentId);
              const batch = getBatch(student?.batchId);
              const isSelected = selected.has(payment.id);

              return (
                <div
                  key={payment.id}
                  onClick={() => toggleSelect(payment.id)}
                  style={{
                    padding: "12px 14px",
                    background: isSelected
                      ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
                      : "var(--bg3)",
                    border: `2px solid ${isSelected ? "var(--blue)" : "var(--border)"}`,
                    borderRadius: "var(--radius-sm)",
                    cursor: "pointer",
                    transition: "var(--transition-smooth)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(payment.id)}
                    style={{ cursor: "pointer" }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, fontSize: "13px" }}>
                      {student?.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text4)" }}>
                      {batch?.name}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: isSelected ? "var(--blue)" : "var(--text)",
                    }}
                  >
                    {fmtINR(payment.amount)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          {selected.size > 0 && (
            <div
              style={{
                padding: "12px 14px",
                background: "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)",
                borderRadius: "var(--radius-sm)",
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px",
              }}
            >
              <div>
                <strong>{selected.size} payments selected</strong>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--blue)" }}>
                {fmtINR(selectedAmount)}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={selected.size === 0}
            style={{background: "var(--gradient-primary)", opacity: selected.size === 0 ? 0.5 : 1}}
          >
            Mark {selected.size} as Paid
          </button>
        </div>
      </div>
    </div>
  );
}

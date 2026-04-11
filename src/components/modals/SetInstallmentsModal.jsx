import { useState } from "react";

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

export default function SetInstallmentsModal({ payment, student, batch, onSave, onClose }) {
  const [numInstallments, setNumInstallments] = useState(3);
  const [spacing, setSpacing] = useState(30);
  const maxInstallments = 6;

  const calculateInstallments = () => {
    if (numInstallments < 1 || numInstallments > maxInstallments) return [];
    const amountPerInstallment = Math.floor(payment.amount / numInstallments);
    const firstAmount = amountPerInstallment + (payment.amount % numInstallments);

    const installments = [];
    const today = new Date();

    for (let i = 0; i < numInstallments; i++) {
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + (i === 0 ? spacing : spacing + i * 30));

      const yyyy = dueDate.getFullYear();
      const mm = String(dueDate.getMonth() + 1).padStart(2, "0");
      const dd = String(dueDate.getDate()).padStart(2, "0");

      installments.push({
        installmentNumber: i + 1,
        amount: i === 0 ? firstAmount : amountPerInstallment,
        dueDate: `${yyyy}-${mm}-${dd}`,
      });
    }

    return installments;
  };

  const installments = calculateInstallments();
  const totalAmount = installments.reduce((sum, inst) => sum + inst.amount, 0);

  const handleSave = async () => {
    onSave(payment, installments);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header" style={{background: "var(--gradient-success)"}}>
          <h2 className="modal-title">Split into Installments</h2>
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
              Total: {fmtINR(payment.amount)}
            </div>
          </div>

          {/* Number of Installments */}
          <div className="input-group" style={{ marginBottom: 18 }}>
            <label className="input-label">Number of Installments</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[2, 3, 4, 6].map((num) => (
                <button
                  key={num}
                  onClick={() => setNumInstallments(num)}
                  style={{
                    padding: "10px",
                    border: `2px solid ${numInstallments === num ? "var(--gradient-success)" : "var(--border)"}`,
                    borderRadius: "var(--radius-sm)",
                    background: numInstallments === num ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)" : "var(--bg3)",
                    cursor: "pointer",
                    fontWeight: numInstallments === num ? 600 : 500,
                    color: numInstallments === num ? "var(--accent)" : "var(--text2)",
                    transition: "var(--transition-smooth)",
                  }}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Spacing */}
          <div className="input-group" style={{ marginBottom: 20 }}>
            <label className="input-label">First Payment Offset (days)</label>
            <select
              className="input"
              value={spacing}
              onChange={(e) => setSpacing(+e.target.value)}
            >
              <option value={7}>7 days from now</option>
              <option value={14}>14 days from now</option>
              <option value={30}>30 days from now (Default)</option>
            </select>
          </div>

          {/* Installment Breakdown */}
          <div style={{ marginBottom: 16 }}>
            <label className="input-label">Installment Schedule</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {installments.map((inst, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "12px 14px",
                    background: "var(--bg3)",
                    borderLeft: "3px solid var(--gradient-success)",
                    borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    fontSize: "13px",
                  }}
                >
                  <div>
                    <strong>Installment {inst.installmentNumber}</strong>
                    <div style={{ fontSize: "11px", color: "var(--text4)", marginTop: 2 }}>
                      Due: {fmtDate(inst.dueDate)}
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent)" }}>
                    {fmtINR(inst.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Check */}
          <div
            style={{
              padding: "12px 14px",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)",
              borderRadius: "var(--radius-sm)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "13px",
              marginBottom: 16,
            }}
          >
            <strong>Total</strong>
            <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--accent)" }}>
              {fmtINR(totalAmount)}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            style={{background: "var(--gradient-success)"}}
          >
            Create {numInstallments} Installments
          </button>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../context/AppContext";
import ReceiptButton from "../components/fees/ReceiptButton";
import SetPaymentDueDateModal from "../components/modals/SetPaymentDueDateModal";
import BulkMarkPaidModal from "../components/modals/BulkMarkPaidModal";

const monthKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = (k) => {
  if (!k) return "";
  const [y, m] = k.split("-");
  return new Date(+y, +m - 1).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
};
const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n || 0);
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const months6 = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return monthKey(d);
});

const daysUntilDue = (dueDate) => {
  if (!dueDate) return null;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = due - now;
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return days;
};

const I = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Download: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  WA: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>,
  Waive: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  Receipt: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Undo: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>,
};


// ─── Mark Paid Modal Component ────────────────────────────────────
function MarkPaidModalContent({ student, batch, payment, onSave, onClose }) {
  const [lateFee, setLateFee] = useState(payment?.lateFee || 0);
  const [paidOn, setPaidOn] = useState(payment?.paidOn || new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState(payment?.notes || "");
  const base = batch.fee - (student.discount || 0);
  const gst = Math.round(base * batch.gstRate / 100);
  const amount = payment?.amount || (base + gst);
  const total = amount + (+lateFee || 0);

  const handleSave = () => {
    if (!paidOn) {
      alert("Please select a payment date");
      return;
    }
    onSave(payment || { id: Math.random().toString(36).slice(2, 9), studentId: student.id }, {
      paidOn,
      lateFee: +lateFee || 0,
      notes,
      amount,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 420 }}>
        <div className="modal-header">
          <div><div className="modal-title">✅ Mark as Paid</div><div className="modal-subtitle">{student.name} · {batch.name}</div></div>
          <button className="btn btn-ghost btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div style={{ background: "var(--bg3)", borderRadius: "var(--radius-sm)", padding: "12px 14px", marginBottom: 14, fontSize: 13 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: "var(--text3)" }}>Base fee</span><span style={{ fontWeight: 600 }}>₹{base.toLocaleString("en-IN")}</span></div>
            {gst > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: "var(--text3)" }}>GST ({batch.gstRate}%)</span><span style={{ fontWeight: 600 }}>₹{gst.toLocaleString("en-IN")}</span></div>}
            {lateFee > 0 && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: "var(--red)" }}>Late fee</span><span style={{ color: "var(--red)", fontWeight: 600 }}>₹{(+lateFee).toLocaleString("en-IN")}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--border)", paddingTop: 8, marginTop: 4 }}><span style={{ fontWeight: 700 }}>Total</span><span style={{ fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-display)", fontSize: 16 }}>₹{total.toLocaleString("en-IN")}</span></div>
          </div>
          <div className="input-group"><label className="input-label">Payment Date</label><input type="date" className="input" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} /></div>
          <div className="input-group"><label className="input-label">Late Fee (if any)</label><input type="number" className="input" value={lateFee} onChange={(e) => setLateFee(e.target.value)} placeholder="0" min="0" /></div>
          <div className="input-group"><label className="input-label">Notes</label><textarea className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Cheque #1234, Online transfer..." /></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Mark Paid</button>
        </div>
      </div>
    </div>
  );
}

export default function Fees() {
  const { state, dispatch } = useApp();
  const { batches, students, payments, businessProfile: profile, settings } = state;
  const setPayments = (np) => dispatch({ type: "SET_PAYMENTS", payload: np });
  const [selectedMonth, setSelectedMonth] = useState(monthKey());
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(new Set());
  const [modal, setModal] = useState(null);

  const _getStudent = (id) => students.find((s) => s.id === id);
  const getBatch = (id) => batches.find((b) => b.id === id);
  const getPayment = (sId, m) => payments.find((p) => p.studentId === sId && p.month === m);

  const filtered = students.filter((s) => {
    if (filterBatch !== "all" && s.batchId !== filterBatch) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.phone.includes(search)) return false;
    const p = getPayment(s.id, selectedMonth);
    if (filterStatus === "paid" && p?.status !== "paid") return false;
    if (filterStatus === "unpaid" && p?.status !== "unpaid") return false;
    if (filterStatus === "none" && p) return false;
    return true;
  });

  const mPayments = payments.filter((p) => p.month === selectedMonth);
  const paid = mPayments.filter((p) => p.status === "paid");
  const unpaid = mPayments.filter((p) => p.status === "unpaid");
  const collected = paid.reduce((a, p) => a + p.amount + (p.lateFee || 0), 0);
  const pending = unpaid.reduce((a, p) => a + p.amount, 0);
  const rate = mPayments.length ? Math.round((paid.length / mPayments.length) * 100) : 0;

  const handleUndo = async (payment) => {
    const np = payments.map((p) => p.id === payment.id ? { ...p, status: "unpaid", paidOn: null, lateFee: 0 } : p);
    setPayments(np);
  };

  const handleGenerateFees = () => {
    setModal({ type: "generateFees" });
  };

  const handleGenerateFeesConfirm = () => {
    const toGenerate = students.filter((s) => {
      const p = getPayment(s.id, selectedMonth);
      return !p;
    });

    if (toGenerate.length === 0) {
      alert("All students already have fees generated for this month");
      setModal(null);
      return;
    }

    const newPayments = toGenerate.map((s) => {
      const b = getBatch(s.batchId);
      const base = b.fee - (s.discount || 0);
      const gstAmount = Math.round(base * (b.gstRate / 100));
      return {
        id: Math.random().toString(36).slice(2, 9),
        studentId: s.id,
        month: selectedMonth,
        status: "unpaid",
        amount: base + gstAmount,
        lateFee: 0,
        notes: "",
      };
    });

    const updatedPayments = [...payments, ...newPayments];
    setPayments(updatedPayments);
    setModal(null);
  };

  const handleMarkPaidClick = (student, payment) => {
    const b = getBatch(student.batchId);
    setModal({ type: "markPaid", data: { student, batch: b, payment } });
  };

  const handleMarkPaidSave = (payment, { paidOn, lateFee, notes, amount }) => {
    const updatedPayment = {
      ...payment,
      status: "paid",
      paidOn,
      paidAt: new Date().toISOString(),
      lateFee,
      notes,
      amount,
    };
    const np = payments.map((p) => p.id === payment.id ? updatedPayment : p);
    setPayments(np);
    setModal(null);
  };

  const handleBulkMarkPaid = () => {
    if (selected.size === 0) {
      alert("Please select payments to mark as paid");
      return;
    }
    const selectedPayments = unpaid.filter((p) => selected.has(p.id));
    setModal({ type: "bulkMarkPaid", data: { payments: selectedPayments } });
  };

  const handleBulkMarkPaidConfirm = (selectedPayments, paidDate) => {
    const np = payments.map((p) =>
      selectedPayments.some((sp) => sp.id === p.id)
        ? { ...p, status: "paid", paidOn: paidDate, paidAt: new Date().toISOString() }
        : p
    );
    setPayments(np);
    setSelected(new Set());
    setModal(null);
  };

  const handleSetDueDate = (payment) => {
    setModal({ type: "setDueDate", data: { payment } });
  };

  const handleSetDueDateSave = (updatedPayment) => {
    const np = payments.map((p) => p.id === updatedPayment.id ? updatedPayment : p);
    setPayments(np);
    setModal(null);
  };

  const closeModal = () => {
    setModal(null);
  };

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
    if (selected.size === unpaid.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(unpaid.map((p) => p.id)));
    }
  };

  const exportCSV = () => {
    const rows = [["Name", "Phone", "Batch", "Month", "Amount", "Status", "Paid On", "Due Date", "Days Until", "Late Fee", "Notes"]];
    filtered.forEach((s) => {
      const b = getBatch(s.batchId);
      const p = getPayment(s.id, selectedMonth);
      const days = daysUntilDue(p?.dueDate);
      rows.push([s.name, s.phone, b?.name, monthLabel(selectedMonth), p ? fmtINR(p.amount) : "—", p?.status || "not generated", p?.paidOn || "—", p?.dueDate || "—", days !== null ? days : "—", p?.lateFee || 0, p?.notes || ""]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `FeeSync_${selectedMonth}.csv`; a.click();
  };

  return (
    <div>
      {/* Modals */}
      {modal?.type === "generateFees" && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <div><div className="modal-title">⚡ Generate Fees</div></div>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: "center", padding: "8px 0 16px" }}>
                <div style={{ fontSize: 40, marginBottom: 8 }}>⚡</div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>Generate for {monthLabel(selectedMonth)}</div>
                <div style={{ fontSize: 13, color: "var(--text3)", lineHeight: 1.6 }}>
                  {students.filter(s => !getPayment(s.id, selectedMonth)).length} students don't have fees yet
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary" onClick={handleGenerateFeesConfirm}>Generate</button>
            </div>
          </div>
        </div>
      )}
      
      {modal?.type === "markPaid" && (
        <MarkPaidModalContent
          student={modal.data.student}
          batch={modal.data.batch}
          payment={modal.data.payment}
          onSave={handleMarkPaidSave}
          onClose={closeModal}
        />
      )}
      
      {modal?.type === "setDueDate" && (
        <SetPaymentDueDateModal
          payment={modal.data.payment}
          onSave={handleSetDueDateSave}
          onClose={closeModal}
        />
      )}
      
      {modal?.type === "bulkMarkPaid" && (
        <BulkMarkPaidModal
          payments={modal.data.payments || []}
          students={students}
          batches={batches}
          selectedMonth={selectedMonth}
          onSave={handleBulkMarkPaidConfirm}
          onClose={closeModal}
        />
      )}

      <div className="toolbar">
        <select className="month-sel" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months6.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
        <button className="btn btn-secondary btn-sm" onClick={handleGenerateFees}>⚡ Generate</button>
        {selected.size > 0 && (
          <button className="btn btn-primary btn-sm" onClick={handleBulkMarkPaid} style={{background: "var(--gradient-primary)", color: "white"}}>
            ✓ Mark {selected.size} as Paid
          </button>
        )}
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={exportCSV}><I.Download /> Export CSV</button>
        </div>
      </div>
      <div className="card">
        <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <div className="search-wrap" style={{ flex: "1 1 180px" }}><I.Search /><input className="input" style={{ paddingLeft: 34 }} placeholder="Search student or phone..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th style={{width: 32}}><input type="checkbox" checked={selected.size === unpaid.length && unpaid.length > 0} onChange={selectAll} /></th><th>Student</th><th>Batch</th><th>Amount</th><th>Status</th><th>Due Date</th><th>Paid On</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((s) => {
                const b = getBatch(s.batchId);
                if (!b) return null;
                const p = getPayment(s.id, selectedMonth);
                const amt = p ? p.amount : b.fee - (s.discount || 0) + Math.round((b.fee - (s.discount || 0)) * b.gstRate / 100);
                const days = daysUntilDue(p?.dueDate);
                const isSelected = p && selected.has(p.id);
                const isUnpaid = p?.status === "unpaid";

                return (
                  <tr key={s.id} style={{background: isSelected ? "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(139, 92, 246, 0.05) 100%)" : "transparent"}}>
                    <td style={{width: 32}}>
                      {isUnpaid && (
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(p.id)}
                        />
                      )}
                    </td>
                    <td><div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div></td>
                    <td>{b.name}</td>
                    <td>{fmtINR(amt + (p?.lateFee || 0))}</td>
                    <td>{p?.status || "not generated"}</td>
                    <td>
                      <div style={{fontSize: 12}}>
                        {p?.dueDate ? fmtDate(p.dueDate) : "—"}
                        {p?.dueDate && days !== null && (
                          <div style={{fontSize: 11, color: days > 0 ? "var(--text4)" : days === 0 ? "var(--amber)" : "var(--red)"}}>
                            {days > 0 ? `in ${days}d` : days === 0 ? "Today" : `${Math.abs(days)}d overdue`}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{p?.status === "paid" ? fmtDate(p.paidOn) : "—"}</td>
                    <td><div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
                      {p?.status === "paid" && (
                        <ReceiptButton
                          student={{
                            ...s,
                            dueAmount: s?.dueAmount ?? Math.max((b?.fee || 0) - (p?.amount || 0), 0),
                          }}
                          batch={b}
                          payment={p}
                          settingsData={{
                            ...settings,
                            ...profile,
                            instituteName: profile?.name || settings?.instituteName,
                          }}
                        />
                      )}
                      {p?.status === "paid" && <button className="btn btn-danger btn-sm" onClick={() => handleUndo(p)}><I.Undo /></button>}
                      {p?.status === "paid" && <button className="btn btn-secondary btn-sm" onClick={() => { /* Built-in receipt shown above */ }}><I.Receipt /> Invoice</button>}
                      {p?.status === "unpaid" && <button className="btn btn-secondary btn-sm" onClick={() => handleMarkPaidClick(s, p)}>Mark Paid</button>}
                      {p?.status === "unpaid" && <button className="btn btn-secondary btn-sm" onClick={() => handleSetDueDate(p)}><I.Check /> Due</button>}
                    </div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

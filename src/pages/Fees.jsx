import { useState } from "react";
import { useApp } from "../context/AppContext";

const monthKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
const monthLabel = (k) => {
  if (!k) return "";
  const [y, m] = k.split("-");
  return new Date(+y, +m - 1).toLocaleString("en-IN", { month: "long", year: "numeric" });
};
const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";
const months6 = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return monthKey(d);
});
const KEYS = { payments: "gp2_p" };
async function dbSet(_k, _v) {}

const I = {
  Search: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Download: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Check: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
  WA: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347"/></svg>,
  Waive: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
  Receipt: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Undo: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4.95"/></svg>,
};

export default function Fees() {
  const { state, dispatch } = useApp();
  const { batches, students, payments, businessProfile: profile } = state;
  const setPayments = (np) => dispatch({ type: "SET_PAYMENTS", payload: np });
  const toast = () => {};
  const openModal = () => {};
  const [selectedMonth, setSelectedMonth] = useState(monthKey());
  const [filterBatch, setFilterBatch] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");

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
    await dbSet(KEYS.payments, np);
  };

  const exportCSV = () => {
    const rows = [["Name", "Phone", "Batch", "Month", "Amount", "Status", "Paid On", "Late Fee", "Notes"]];
    filtered.forEach((s) => {
      const b = getBatch(s.batchId);
      const p = getPayment(s.id, selectedMonth);
      rows.push([s.name, s.phone, b?.name, monthLabel(selectedMonth), p ? fmtINR(p.amount) : "—", p?.status || "not generated", p?.paidOn || "—", p?.lateFee || 0, p?.notes || ""]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `GuruPay_${selectedMonth}.csv`; a.click();
  };

  return (
    <div>
      <div className="toolbar">
        <select className="month-sel" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months6.map((m) => <option key={m} value={m}>{monthLabel(m)}</option>)}
        </select>
        <button className="btn btn-secondary btn-sm" onClick={() => openModal("generateFees")}>⚡ Generate</button>
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
            <thead><tr><th>Student</th><th>Batch</th><th>Amount</th><th>Status</th><th>Paid On</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
            <tbody>
              {filtered.map((s) => {
                const b = getBatch(s.batchId);
                if (!b) return null;
                const p = getPayment(s.id, selectedMonth);
                const amt = p ? p.amount : b.fee - (s.discount || 0) + Math.round((b.fee - (s.discount || 0)) * b.gstRate / 100);
                return (
                  <tr key={s.id}>
                    <td><div style={{ fontWeight: 600, fontSize: 13 }}>{s.name}</div></td>
                    <td>{b.name}</td>
                    <td>{fmtINR(amt + (p?.lateFee || 0))}</td>
                    <td>{p?.status || "not generated"}</td>
                    <td>{p?.status === "paid" ? fmtDate(p.paidOn) : "—"}</td>
                    <td><div style={{ display: "flex", gap: 5, justifyContent: "flex-end" }}>
                      {p?.status === "paid" && <button className="btn btn-danger btn-sm" onClick={() => handleUndo(p)}><I.Undo /></button>}
                      {p?.status === "paid" && <button className="btn btn-secondary btn-sm" onClick={() => openModal("receipt", { student: s, batch: b, payment: p })}><I.Receipt /></button>}
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

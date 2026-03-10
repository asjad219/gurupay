import { useState } from "react";
import { useApp } from "../context/AppContext";

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
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
const months6 = Array.from({ length: 6 }, (_, i) => {
  const d = new Date();
  d.setMonth(d.getMonth() - i);
  return monthKey(d);
});
const curMonth = monthKey();

const I = {
  WA: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
    </svg>
  ),
  Receipt: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
    </svg>
  ),
};

export default function Dashboard() {
  const { state } = useApp();
  const { batches, students, payments } = state;
  const [selectedMonth, setSelectedMonth] = useState(curMonth);
  const toast = () => {};
  const openModal = () => {};

  const mPayments = payments.filter((p) => p.month === selectedMonth);
  const paid = mPayments.filter((p) => p.status === "paid");
  const unpaid = mPayments.filter((p) => p.status === "unpaid");
  const waived = mPayments.filter((p) => p.status === "waived");
  const collected = paid.reduce((a, p) => a + p.amount + (p.lateFee || 0), 0);
  const pending = unpaid.reduce((a, p) => a + p.amount, 0);
  const rate = mPayments.length
    ? Math.round(((paid.length + waived.length) / mPayments.length) * 100)
    : 0;

  const sparkData = months6
    .slice()
    .reverse()
    .map((m) => {
      const mp = payments.filter((p) => p.month === m && p.status === "paid");
      return mp.reduce((a, p) => a + p.amount, 0);
    });
  const maxSpark = Math.max(...sparkData, 1);

  const getStudent = (id) => students.find((s) => s.id === id);
  const getBatch = (id) => batches.find((b) => b.id === id);

  return (
    <div>
      <div className="toolbar">
        <select className="month-sel" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          {months6.map((m) => (
            <option key={m} value={m}>{monthLabel(m)}</option>
          ))}
        </select>
        <button className="btn btn-secondary btn-sm" onClick={() => openModal("generateFees")}>⚡ Generate Fees</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => openModal("bulkReminder", unpaid)}><I.WA /> Bulk Remind ({unpaid.length})</button>
        </div>
      </div>

      <div className="stat-grid">
        {[
          { icon: "💰", iconBg: "#dcfce7", label: "Collected", val: fmtINR(collected), sub: `${paid.length} payments`, color: "var(--accent)" },
          { icon: "⏳", iconBg: "#fef2f2", label: "Pending", val: fmtINR(pending), sub: `${unpaid.length} dues`, color: "var(--red)" },
          { icon: "📊", iconBg: "#eff6ff", label: "Collection Rate", val: `${rate}%`, sub: `${mPayments.length} total records`, color: "var(--blue)" },
          { icon: "🎓", iconBg: "#f5f3ff", label: "Students", val: students.length, sub: `${batches.length} batches`, color: "var(--purple)" },
        ].map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon-wrap" style={{ background: s.iconBg }}>{s.icon}</div>
            <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
            <div className="stat-lbl">{s.label}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Revenue Trend</div><div className="card-subtitle">Last 6 months</div></div>
            <div className="sparkbar-wrap">
              {sparkData.map((v, i) => (
                <div key={i} className="sparkbar" style={{ height: `${Math.max(4, Math.round((v / maxSpark) * 32))}px`, background: i === 5 ? "var(--accent)" : "var(--bg4)", flex: 1 }} title={fmtINR(v)} />
              ))}
            </div>
          </div>
          {months6.slice().reverse().map((m, i) => {
            const mp = payments.filter((p) => p.month === m);
            const mc = mp.filter((p) => p.status === "paid");
            const total = mc.reduce((a, p) => a + p.amount, 0);
            const r = mp.length ? Math.round((mc.length / mp.length) * 100) : 0;
            return (
              <div key={m} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ fontSize: 12, color: "var(--text3)", width: 80, flexShrink: 0 }}>{monthLabel(m).split(" ")[0]}</div>
                <div className="progress" style={{ flex: 1 }}><div className="progress-fill" style={{ width: `${r}%`, background: i === 5 ? "var(--accent)" : "var(--bg4)" }} /></div>
                <div style={{ fontSize: 12, fontFamily: "var(--font-mono)", fontWeight: 600, width: 70, textAlign: "right" }}>{fmtINR(total)}</div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="card-header">
            <div><div className="card-title">Pending Fees</div><div className="card-subtitle">{monthLabel(selectedMonth)}</div></div>
            {unpaid.length > 0 && <span className="badge badge-unpaid">{unpaid.length} due</span>}
          </div>
          {unpaid.length === 0 ? <div className="empty" style={{ padding: 24 }}><div className="empty-icon">🎉</div><div className="empty-title">All fees collected!</div></div> : unpaid.slice(0, 6).map((p) => {
            const s = getStudent(p.studentId);
            const b = s && getBatch(s.batchId);
            if (!s || !b) return null;
            return (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
                <div className="dot overdue" style={{ background: "var(--red)" }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, truncate: true }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text4)" }}>{b.name}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--red)" }}>{fmtINR(p.amount)}</div>
                <button className="btn btn-wa btn-sm" onClick={() => openModal("wa", { student: s, batch: b })}><I.WA /></button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card">
        <div className="card-header"><div><div className="card-title">Recent Payments</div></div></div>
        {paid.length === 0 ? <div className="empty" style={{ padding: 24 }}><div className="empty-icon">💸</div><div className="empty-title">No payments yet this month</div></div> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Student</th><th>Batch</th><th>Amount</th><th>Paid On</th><th>Actions</th></tr></thead>
              <tbody>
                {paid.slice(0, 8).map((p) => {
                  const s = getStudent(p.studentId);
                  const b = s && getBatch(s.batchId);
                  if (!s || !b) return null;
                  return (
                    <tr key={p.id}>
                      <td className="td-primary">{s.name}</td>
                      <td><span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}><span className="dot" style={{ background: b.color }} />{b.name}</span></td>
                      <td className="td-mono" style={{ color: "var(--accent)", fontWeight: 700 }}>{fmtINR(p.amount + (p.lateFee || 0))}</td>
                      <td style={{ color: "var(--text4)", fontSize: 12 }}>{fmtDate(p.paidOn)}</td>
                      <td><button className="btn btn-secondary btn-sm" onClick={() => openModal("receipt", { student: s, batch: b, payment: p })}><I.Receipt /> Receipt</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

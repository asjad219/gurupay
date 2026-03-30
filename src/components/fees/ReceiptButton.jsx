import { generateReceiptPDF } from "../../utils/generateReceipt";
import { sendWhatsApp } from "../../utils/whatsapp";

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ReceiptButton({ student, batch, payment, settingsData }) {
  const hasPhone = !!String(student?.phone || "").trim();

  const handleSendReceipt = () => {
    if (!student || !payment) return;

    const paymentDate = payment?.paidOn || payment?.date;

    const { receiptNo } = generateReceiptPDF(
      {
        ...student,
        batchName: batch?.name || student?.batchName || "—",
      },
      payment,
      settingsData
    );

    const instituteName =
      settingsData?.instituteName || settingsData?.name || "FeeSync Institute";

    const message = `Dear ${student?.name || "Student"}, please find your fee receipt attached. Receipt No: ${receiptNo}, Amount: ₹${Number(
      payment?.amount || 0
    ).toLocaleString("en-IN")}, Date: ${formatDate(paymentDate)}. - ${instituteName}`;

    setTimeout(() => {
      sendWhatsApp(student?.phone, message);
    }, 300);
  };

  return (
    <button
      type="button"
      className="btn btn-sm"
      onClick={handleSendReceipt}
      disabled={!hasPhone}
      title={
        hasPhone
          ? "Download receipt PDF and send on WhatsApp"
          : "Student phone number not available"
      }
      style={{
        background: "#22c55e",
        color: "#fff",
        border: "none",
        opacity: hasPhone ? 1 : 0.6,
        cursor: hasPhone ? "pointer" : "not-allowed",
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
      </svg>
    </button>
  );
}

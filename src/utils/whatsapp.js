const normalizePhone = (phone = "") => {
  const digits = String(phone).replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10) return `91${digits}`;
  return digits;
};

export function sendWhatsApp(phone, message) {
  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) return false;

  const whatsappUrl = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
    message || ""
  )}`;

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  return true;
}

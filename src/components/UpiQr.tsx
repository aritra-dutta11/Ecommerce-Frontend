import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { ScanLine, Loader2 } from "lucide-react";

interface PaymentQrProps {
  amount: number;
}

export default function PaymentQr({ amount }: PaymentQrProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const qrData = `${amount.toFixed(2)} INR`;

  useEffect(() => {
    setGenerating(true);

    QRCode.toDataURL(qrData, {
      width: 240,
      margin: 2,
      color: {
        dark: "#0d0d10",
        light: "#ffffff",
      },
      errorCorrectionLevel: "M",
    })
      .then((url) => {
        setQrDataUrl(url);
        setGenerating(false);
      })
      .catch(() => {
        setQrDataUrl(null);
        setGenerating(false);
      });
  }, [amount]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-2xl bg-white p-4 ring-1 ring-ink-200 shadow-sm">
        {generating ? (
          <div className="flex h-[240px] w-[240px] items-center justify-center">
            <Loader2 size={32} className="animate-spin text-ink-400" />
          </div>
        ) : (
          qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="Payment QR Code"
              className="h-[240px] w-[240px] rounded-lg"
            />
          )
        )}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-ink-900">Scan QR Code</p>

        <p className="text-xs text-ink-500">Amount: ₹{amount.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2 text-xs text-ink-400">
        <ScanLine size={14} />
        <span>₹{amount.toFixed(2)} INR</span>
      </div>
    </div>
  );
}

import { IoClose } from "react-icons/io5";
import QRCode from "react-qr-code";
import Image from "next/image";
import { useEffect, useState } from "react";
import usePayment from "@/hooks/usePayment";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
  const payment = usePayment();
  const [selectedAmount, setSelectedAmount] = useState<string>("50");
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  const creditPackages = [
    { 
      amount: isDev ? "0.01" : "30", 
      credits: 10, 
      label: "Basic Package" 
    },
    { 
      amount: isDev ? "0.02" : "50", 
      credits: 20, 
      label: "Recommended", 
      popular: true 
    },
    { 
      amount: isDev ? "0.03" : "100", 
      credits: 45, 
      label: "Premium Package" 
    },
  ];

  // Reset state when modal is reopened
  useEffect(() => {
    if (isOpen) {
      setPaymentInitiated(false);
      setSelectedAmount(isDev ? "0.02" : "50"); // Default to recommended package
    }
  }, [isOpen, isDev]);

  useEffect(() => {
    // Only poll when modal is open and payment has been initiated
    if (isOpen && payment.outTradeNo) {
      const cleanup = payment.pollPaymentStatus(payment.outTradeNo);
      return cleanup;
    }
  }, [payment.outTradeNo, isOpen]);

  useEffect(() => {
    if (payment.tradeStatus === 'TRADE_SUCCESS' || payment.tradeStatus === 'TRADE_FINISHED') {
      // Payment success, handle subsequent logic like refreshing user data
      setTimeout(() => {
        onClose();
        // Refresh user information
        window.location.reload();
      }, 1500);
    }
  }, [payment.tradeStatus, onClose]);

  const handleCreatePayment = async () => {
    try {
      setPaymentInitiated(true);
      await payment.createPayment({
        totalAmount: selectedAmount,
        subject: `NutriAI ${selectedAmount} Credits Recharge`,
        paymentType: 'qrcode'
      });
    } catch (error) {
      console.error("Payment creation failed", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md mx-4 relative">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <IoClose size={24} />
        </button>
        
        <h2 className="text-xl font-semibold text-brand-green-dark mb-6 text-center">
          Purchase Recipe Credits
        </h2>

        {payment.tradeStatus === 'TRADE_SUCCESS' || payment.tradeStatus === 'TRADE_FINISHED' ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-green-500 text-2xl">✓</div>
            </div>
            <p className="text-lg font-medium text-gray-800 mb-2">Payment Successful</p>
            <p className="text-sm text-gray-500">Your credits have been added to your account</p>
          </div>
        ) : payment.loading && !payment.qrCode ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-green mx-auto"></div>
            <p className="mt-4 text-gray-600">Generating payment QR code...</p>
          </div>
        ) : payment.qrCode ? (
          <div className="text-center">
            <div className="mb-4 mx-auto inline-block">
              {payment.qrCode && (
                <div className="p-3 bg-white rounded-lg border mx-auto inline-block">
                  <QRCode
                    value={payment.qrCode}
                    size={180}
                    className="mx-auto"
                  />
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-3">Please scan the QR code with Alipay</p>
            {payment.qrCode && (
              <div className="mb-4 text-center">
                <p className="text-xs text-gray-600 mb-1">Click to open Alipay on mobile:</p>
                <a 
                  href={payment.qrCode} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline break-all px-4 inline-block"
                >
                  {payment.qrCode}
                </a>
              </div>
            )}
            {payment.payUrl && (
              <a 
                href={payment.payUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-brand-green hover:underline text-sm block mb-4"
              >
                Can't scan? Click here to open payment link
              </a>
            )}
            <p className="text-xs text-gray-400 mt-2">Order ID: {payment.outTradeNo}</p>
            {payment.error && (
              <p className="text-red-500 text-sm mt-2">{payment.error}</p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {creditPackages.map((pkg) => (
                <div 
                  key={pkg.amount}
                  onClick={() => setSelectedAmount(pkg.amount)}
                  className={`
                    relative cursor-pointer rounded-xl p-3 text-center
                    ${selectedAmount === pkg.amount 
                      ? 'bg-brand-green-light border-2 border-brand-green' 
                      : 'bg-gray-50 border border-gray-200'}
                  `}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2 -right-2 bg-brand-pink text-white text-xs px-2 py-0.5 rounded-full">
                      Popular
                    </span>
                  )}
                  <p className="font-bold text-lg text-gray-800">{pkg.credits}</p>
                  <p className="text-xs text-gray-500">{pkg.label}</p>
                  <p className="text-brand-green font-medium mt-1">¥{pkg.amount}</p>
                </div>
              ))}
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Select payment method</p>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center space-x-3">
                <Image src="/alipay-logo.png" alt="Alipay" width={80} height={60} />
                <span className="text-gray-700">Alipay</span>
              </div>
            </div>
            
            <button
              onClick={handleCreatePayment}
              disabled={payment.loading || paymentInitiated}
              className="w-full py-3 bg-brand-green text-white rounded-full text-center font-medium hover:bg-brand-green-dark transition-colors disabled:opacity-70"
            >
              {payment.loading ? "Processing..." : `Pay ¥${selectedAmount}`}
            </button>
            
            <p className="mt-4 text-xs text-center text-gray-500">
              By clicking the payment button, you agree to our <a href="#" className="text-brand-green hover:underline">Terms of Service</a>
            </p>
            {isDev && (
              <p className="mt-2 text-xs text-center text-amber-500">
                Development mode: Using test prices (¥0.01-0.03)
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
} 
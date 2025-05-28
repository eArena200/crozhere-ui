"use client";
import { useState } from "react";

export default function LoginDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = () => {
    setError('');
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
    }, 1000); // Simulate API call
  };

  const handleVerifyOtp = () => {
    setError('');
    if (otp.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
      // In real app, handle login/register success here
    }, 1000);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 relative"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">
          {mode === 'login' ? 'Login' : 'Register'} with Phone
        </h2>
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <input
              type="tel"
              placeholder="Phone Number"
              className="w-full px-4 py-2 border rounded mb-2 focus:outline-none text-gray-700"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/[^\d]/g, ''))}
              maxLength={10}
              disabled={otpSent}
            />
            {otpSent && (
              <button
                className="text-blue-600 hover:underline text-sm mb-2"
                onClick={() => { setOtpSent(false); setOtp(''); setError(''); }}
                type="button"
              >
                Change
              </button>
            )}
          </div>
          <button
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition mb-2 disabled:opacity-60"
            onClick={handleSendOtp}
            disabled={loading || otpSent}
          >
            {loading && !otpSent ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
        {otpSent && (
          <div className="mb-4 text-gray-900">
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full px-4 py-2 border rounded mb-2 focus:outline-none"
              value={otp}
              onChange={e => setOtp(e.target.value.replace(/[^\d]/g, ''))}
              maxLength={6}
            />
            <button
              className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 transition mb-2 disabled:opacity-60"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? 'Verifying...' : mode === 'login' ? 'Verify & Login' : 'Verify & Register'}
            </button>
          </div>
        )}
        {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
        <div className="text-center text-gray-900 mt-4">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button className="text-blue-600 hover:underline" onClick={() => { setMode('register'); setOtpSent(false); setOtp(''); setError(''); }}>
                Register
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button className="text-blue-600 hover:underline" onClick={() => { setMode('login'); setOtpSent(false); setOtp(''); setError(''); }}>
                Login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 
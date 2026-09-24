import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/api/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Key, CheckCircle2, ArrowLeft } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!email) {
      setErrorMsg('Please enter your account email address.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setInfoMsg(res.message || 'Reset code generated.');
      if (res.data?.demoResetCode) {
        setToken(res.data.demoResetCode);
      }
      setStep('reset');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to request password reset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!token || !newPassword) {
      setErrorMsg('Please enter the reset code and a new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      await api.resetPassword({
        email,
        token,
        newPassword
      });
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err?.message || 'Invalid or expired reset code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-full bg-rome-50 dark:bg-rome-950/50 text-rome-600 dark:text-rome-400 flex items-center justify-center mx-auto mb-3">
          <Key className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">
          {step === 'request' && 'Reset your password'}
          {step === 'reset' && 'Enter Verification Code'}
          {step === 'success' && 'Password Reset Complete'}
        </h2>
        <p className="text-sm text-surface-500 dark:text-surface-400">
          {step === 'request' && 'Enter your email and we’ll generate your secure reset code.'}
          {step === 'reset' && `We sent instructions to ${email}`}
          {step === 'success' && 'Your password has been successfully updated.'}
        </p>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-900/50">
          {errorMsg}
        </div>
      )}

      {infoMsg && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-sm border border-emerald-200 dark:border-emerald-900/50">
          {infoMsg}
        </div>
      )}

      {step === 'request' && (
        <form onSubmit={handleRequestReset} className="space-y-4">
          <Input
            id="email"
            type="email"
            label="Account Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex.chen@example.com"
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-4"
          >
            Send Reset Code
          </Button>

          <div className="text-center mt-4">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-surface-600 hover:text-rome-600 dark:text-surface-400">
              <ArrowLeft className="w-4 h-4" /> Back to Log in
            </Link>
          </div>
        </form>
      )}

      {step === 'reset' && (
        <form onSubmit={handleConfirmReset} className="space-y-4">
          <Input
            id="token"
            type="text"
            label="6-Digit Reset Code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="e.g. 849201"
            required
            fullWidth
          />

          <Input
            id="newPassword"
            type="password"
            label="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Minimum 6 characters"
            required
            fullWidth
          />

          <Input
            id="confirmPassword"
            type="password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-type new password"
            required
            fullWidth
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            className="mt-4"
          >
            Update Password
          </Button>

          <div className="flex justify-between items-center text-sm mt-4">
            <button
              type="button"
              onClick={() => setStep('request')}
              className="text-surface-500 hover:text-surface-700 dark:text-surface-400"
            >
              Change email
            </button>
            <Link to="/login" className="text-rome-600 hover:underline">
              Back to Log in
            </Link>
          </div>
        </form>
      )}

      {step === 'success' && (
        <div className="text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-surface-600 dark:text-surface-300 text-sm">
            You can now log in to your ROMEfind account using your new password.
          </p>
          <Button
            variant="primary"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Log in to ROMEfind
          </Button>
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordPage;

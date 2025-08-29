import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth-context";
import { 
  FiMail, 
  FiAlertCircle, 
  FiCheckCircle,
  FiArrowLeft,
  FiSend,
  FiLoader
} from "react-icons/fi";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      await resetPassword(email);
      setMsg("Check your inbox for a reset link.");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to send reset email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Main card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
          {/* Decorative gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10"></div>
          
          <div className="relative p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex items-center justify-center">
                <FiMail className="w-8 h-8 text-purple-300" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                Reset Password
              </h1>
              <p className="text-white/60">
                {msg ? 
                  "We've sent you a reset link" : 
                  "Enter your email to receive a password reset link"
                }
              </p>
            </div>

            {/* Success message */}
            {msg && (
              <div className="mb-6 p-4 rounded-2xl bg-green-500/20 border border-green-500/30 text-green-200 flex items-center gap-3 animate-in fade-in duration-300">
                <FiCheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <div className="font-medium">{msg}</div>
                  <div className="text-sm text-green-200/80 mt-1">
                    Check your spam folder if you don't see it in your inbox.
                  </div>
                </div>
              </div>
            )}

            {/* Error message */}
            {err && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-200 flex items-center gap-3 animate-in fade-in duration-300">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{err}</span>
              </div>
            )}

            {/* Reset form */}
            {!msg && (
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Email field */}
                <div className="space-y-2">
                  <label className="text-white/70 text-sm font-medium">Email Address</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                      <FiMail className="w-5 h-5" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                      placeholder="Enter your account email"
                      required
                    />
                  </div>
                  <p className="text-white/50 text-xs">
                    We'll send a password reset link to this email address.
                  </p>
                </div>

                {/* Send reset link button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <FiLoader className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <FiSend className="w-5 h-5" />
                        <span>Send Reset Link</span>
                      </>
                    )}
                  </div>
                </button>
              </form>
            )}

            {/* Success state - show different content */}
            {msg && (
              <div className="space-y-6">
                {/* Instructions */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <h3 className="text-white font-medium mb-3">Next steps:</h3>
                  <ol className="space-y-2 text-sm text-white/70">
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center justify-center mt-0.5">1</span>
                      <span>Check your email inbox (and spam folder)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center justify-center mt-0.5">2</span>
                      <span>Click the reset link in the email</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center justify-center mt-0.5">3</span>
                      <span>Create a new password</span>
                    </li>
                  </ol>
                </div>

                {/* Resend option */}
                <div className="text-center">
                  <p className="text-white/60 text-sm mb-4">Didn't receive the email?</p>
                  <button
                    onClick={() => {
                      setMsg(null);
                      setEmail("");
                    }}
                    className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-200"
                  >
                    Try again with a different email
                  </button>
                </div>
              </div>
            )}

            {/* Back to login */}
            <div className="mt-8">
              <Link 
                href="/login"
                className="flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors duration-200 group"
              >
                <FiArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Sign In</span>
              </Link>
            </div>

            {/* Additional help */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-white/50 text-xs mb-2">Still having trouble?</p>
                <p className="text-white/60 text-sm">
                  Contact support at{" "}
                  <a 
                    href="mailto:support@example.com" 
                    className="text-purple-300 hover:text-purple-200 transition-colors"
                  >
                    support@example.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute -z-10 top-4 left-4 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-60 animate-pulse"></div>
        <div className="absolute -z-10 bottom-4 right-4 w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>
    </div>
  );
}
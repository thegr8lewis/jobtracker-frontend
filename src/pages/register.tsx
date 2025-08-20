// import React, { useState } from "react";
// import Link from "next/link";
// import { useAuth } from "../lib/auth-context";
// import { useRouter } from "next/router";

// export default function RegisterPage() {
//   const { register } = useAuth();
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErr(null);
//     if (password !== confirm) {
//       setErr("Passwords do not match");
//       return;
//     }
//     setLoading(true);
//     try {
//       await register(email, password);
//       router.push("/application");
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to register");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main style={{ maxWidth: 420, margin: "64px auto", padding: 16 }}>
//       <h1>Create account</h1>
//       <form onSubmit={onSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
//         <input
//           placeholder="Email"
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />
//         <input
//           placeholder="Password (min 6 chars)"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           minLength={6}
//           required
//         />
//         <input
//           placeholder="Confirm password"
//           type="password"
//           value={confirm}
//           onChange={(e) => setConfirm(e.target.value)}
//           required
//         />
//         {err && <p style={{ color: "crimson" }}>{err}</p>}
//         <button disabled={loading} type="submit">Create account</button>
//       </form>

//       <div style={{ marginTop: 16 }}>
//         <Link href="/login">Already have an account? Sign in</Link>
//       </div>
//     </main>
//   );
// }

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth-context";
import { useRouter } from "next/router";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiUserPlus,
  FiLoader,
  FiCheck
} from "react-icons/fi";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Password strength validation
  const passwordRequirements = [
    { test: (p: string) => p.length >= 6, text: "At least 6 characters" },
    { test: (p: string) => /[A-Z]/.test(p), text: "One uppercase letter" },
    { test: (p: string) => /[0-9]/.test(p), text: "One number" },
  ];

  const passwordsMatch = password && confirm && password === confirm;
  const isPasswordValid = passwordRequirements.every(req => req.test(password));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    
    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    
    if (!isPasswordValid) {
      setErr("Password does not meet requirements");
      return;
    }
    
    setLoading(true);
    try {
      await register(email, password);
      router.push("/");
    } catch (e: any) {
      setErr(e?.message ?? "Failed to register");
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
                Create Account
              </h1>
              <p className="text-white/60">Join us and start tracking your job applications</p>
            </div>

            {/* Error message */}
            {err && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-200 flex items-center gap-3 animate-in fade-in duration-300">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{err}</span>
              </div>
            )}

            {/* Register form */}
            <form onSubmit={onSubmit} className="space-y-6">
              {/* Email field */}
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">Email</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
                    placeholder="Create a strong password"
                    minLength={6}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                
                {/* Password requirements */}
                {password && (
                  <div className="mt-3 p-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-white/70 text-xs font-medium mb-2">Password Requirements:</p>
                    <div className="space-y-1">
                      {passwordRequirements.map((req, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            req.test(password) ? 'bg-green-500/20 text-green-300' : 'bg-white/10 text-white/40'
                          }`}>
                            {req.test(password) && <FiCheck className="w-3 h-3" />}
                          </div>
                          <span className={req.test(password) ? 'text-green-300' : 'text-white/60'}>
                            {req.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm password field */}
              <div className="space-y-2">
                <label className="text-white/70 text-sm font-medium">Confirm Password</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
                    <FiLock className="w-5 h-5" />
                  </div>
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={`w-full pl-12 pr-12 py-4 bg-white/5 border rounded-2xl text-white placeholder-white/40 focus:outline-none focus:bg-white/10 transition-all duration-300 ${
                      confirm ? (passwordsMatch ? 'border-green-500/50 focus:border-green-500/70' : 'border-red-500/50 focus:border-red-500/70') : 'border-white/10 focus:border-purple-500/50'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showConfirm ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                  </button>
                </div>
                {confirm && (
                  <div className="flex items-center gap-2 text-xs mt-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      passwordsMatch ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {passwordsMatch && <FiCheck className="w-3 h-3" />}
                    </div>
                    <span className={passwordsMatch ? 'text-green-300' : 'text-red-300'}>
                      {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                    </span>
                  </div>
                )}
              </div>

              {/* Create account button */}
              <button
                type="submit"
                disabled={loading || !isPasswordValid || !passwordsMatch}
                className="group relative w-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                <div className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <FiLoader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <FiUserPlus className="w-5 h-5" />
                      <span>Create Account</span>
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Link to login */}
            <div className="mt-8 text-center">
              <Link 
                href="/login"
                className="text-white/60 hover:text-white transition-colors duration-200"
              >
                Already have an account? <span className="text-purple-300 hover:text-purple-200 font-semibold">Sign in</span>
              </Link>
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
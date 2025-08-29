// import React, { useState } from "react";
// import Link from "next/link";
// import { useAuth } from "../lib/auth-context";
// import { useRouter } from "next/router";
// import { 
//   FiMail, 
//   FiLock, 
//   FiEye, 
//   FiEyeOff, 
//   FiAlertCircle, 
//   FiArrowRight,
//   FiLoader
// } from "react-icons/fi";
// import { FcGoogle } from "react-icons/fc";

// export default function LoginPage() {
//   const { login, loginWithGoogle } = useAuth();
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [err, setErr] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setErr(null);
//     setLoading(true);
//     try {
//       await login(email, password);
//       router.push("/");
//     } catch (e: any) {
//       setErr(e?.message ?? "Failed to sign in");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const onGoogle = async () => {
//     setErr(null);
//     setLoading(true);
//     try {
//       await loginWithGoogle();
//       router.push("/dashboard");
//     } catch (e: any) {
//       setErr(e?.message ?? "Google sign-in failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//       </div>

//       <div className="relative w-full max-w-md">
//         {/* Main card */}
//         <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl">
//           {/* Decorative gradient overlay */}
//           <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10"></div>
          
//           <div className="relative p-8">
//             {/* Header */}
//             <div className="text-center mb-8">
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-2">
//                 Welcome Back
//               </h1>
//               <p className="text-white/60">Sign in to your account</p>
//             </div>

//             {/* Error message */}
//             {err && (
//               <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-200 flex items-center gap-3 animate-in fade-in duration-300">
//                 <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
//                 <span className="text-sm">{err}</span>
//               </div>
//             )}

//             {/* Login form */}
//             <form onSubmit={onSubmit} className="space-y-6">
//               {/* Email field */}
//               <div className="space-y-2">
//                 <label className="text-white/70 text-sm font-medium">Email</label>
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
//                     <FiMail className="w-5 h-5" />
//                   </div>
//                   <input
//                     type="email"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
//                     placeholder="Enter your email"
//                     required
//                   />
//                 </div>
//               </div>

//               {/* Password field */}
//               <div className="space-y-2">
//                 <label className="text-white/70 text-sm font-medium">Password</label>
//                 <div className="relative">
//                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40">
//                     <FiLock className="w-5 h-5" />
//                   </div>
//                   <input
//                     type={showPassword ? "text" : "password"}
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all duration-300"
//                     placeholder="Enter your password"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
//                   >
//                     {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
//                   </button>
//                 </div>
//               </div>

//               {/* Sign in button */}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="group relative w-full overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//               >
//                 <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
//                 <div className="relative flex items-center justify-center gap-2">
//                   {loading ? (
//                     <FiLoader className="w-5 h-5 animate-spin" />
//                   ) : (
//                     <>
//                       <span>Sign In</span>
//                       <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                     </>
//                   )}
//                 </div>
//               </button>
//             </form>

//             {/* Divider */}
//             <div className="relative my-8">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-white/10"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="bg-gradient-to-br from-slate-900 to-purple-900 px-4 text-white/60">Or continue with</span>
//               </div>
//             </div>

//             {/* Google sign in */}
//             <button
//               onClick={onGoogle}
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
//             >
//               <FcGoogle className="w-5 h-5" />
//               <span className="font-medium">Continue with Google</span>
//             </button>

//             {/* Links */}
//             <div className="mt-8 space-y-4 text-center">
//               <Link 
//                 href="/register"
//                 className="block text-white/60 hover:text-white transition-colors duration-200"
//               >
//                 Don't have an account? <span className="text-purple-300 hover:text-purple-200 font-semibold">Create one</span>
//               </Link>
//               <Link 
//                 href="/reset-password"
//                 className="block text-white/60 hover:text-white transition-colors duration-200"
//               >
//                 Forgot your password? <span className="text-purple-300 hover:text-purple-200 font-semibold">Reset it</span>
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* Floating elements */}
//         <div className="absolute -z-10 top-4 left-4 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-60 animate-pulse"></div>
//         <div className="absolute -z-10 bottom-4 right-4 w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../lib/auth-context";
import { useRouter } from "next/router";
import { 
  FiMail, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiAlertCircle, 
  FiArrowRight,
  FiLoader
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const { login, loginWithGoogle, user } = useAuth(); // add user
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect logged-in users away from login page
  useEffect(() => {
    if (user) {
      router.replace("/"); // replace avoids back button going to login
    }
  }, [user, router]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/"); // replace here too
    } catch (e: any) {
      setErr(e?.message ?? "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const onGoogle = async () => {
    setErr(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      router.replace("/"); // replace here too
    } catch (e: any) {
      setErr(e?.message ?? "Google sign-in failed");
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
                Welcome Back
              </h1>
              <p className="text-white/60">Sign in to your account</p>
            </div>

            {/* Error message */}
            {err && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-200 flex items-center gap-3 animate-in fade-in duration-300">
                <FiAlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{err}</span>
              </div>
            )}

            {/* Login form */}
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
                    placeholder="Enter your password"
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
              </div>

              {/* Sign in button */}
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
                      <span>Sign In</span>
                      <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-gradient-to-br from-slate-900 to-purple-900 px-4 text-white/60">Or continue with</span>
              </div>
            </div>

            {/* Google sign in */}
            {/* <button
              onClick={onGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="font-medium">Continue with Google</span>
            </button> */}

            {/* Links */}
            <div className="mt-8 space-y-4 text-center">
              <Link 
                href="/register"
                className="block text-white/60 hover:text-white transition-colors duration-200"
              >
                Don't have an account? <span className="text-purple-300 hover:text-purple-200 font-semibold">Create one</span>
              </Link>
              <Link 
                href="/reset-password"
                className="block text-white/60 hover:text-white transition-colors duration-200"
              >
                Forgot your password? <span className="text-purple-300 hover:text-purple-200 font-semibold">Reset it</span>
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

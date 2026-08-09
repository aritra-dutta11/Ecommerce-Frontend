import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  Check,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { handleAdminLogin } from "../api/auth/login";
import { handleAdminSignup } from "../api/auth/signup";
import { useNavigate } from "react-router-dom";

interface AdminAuthPageProps {}

export default function AdminAuthPage({}: AdminAuthPageProps) {
  //const { signIn, signUp } = useAuth();
  const { login } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError("");
    setSuccess("");
    setUserId("");
    setPassword("");
    setConfirmPassword("");
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    if (mode === "signup") {
      handleSignUp(e);
    } else {
      handleSignIn(e);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);
    let loginReq = { userId: userId, password: password };
    let loginRes = await handleAdminLogin(loginReq);
    //console.log(loginRes);
    if (!(loginRes?.serviceResult?.errorMsg === "")) {
      setError(loginRes?.serviceResult?.errorMsg);
    } else {
      //console.log(loginRes);
      if (!(loginRes.token === "")) {
        login(
          loginRes.token,
          loginRes.userId,
          loginRes.userName,
          loginRes.admin,
        );
        navigate(`/dashboard/${loginRes.userId}`);
      }
    }
    setSubmitting(false);
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    let signUpReq = { userName: userId, password: password };
    let signUpRes = await handleAdminSignup(signUpReq);
    //console.log(loginRes);
    if (!(signUpRes?.serviceResult?.errorMsg === "")) {
      setError(signUpRes?.serviceResult?.errorMsg);
    } else {
      setSuccess(
        "Account Created - UserId - " +
          signUpRes?.userId +
          ". Please save this UserId for login purposes.",
      );
    }
    setSubmitting(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
      <div className="relative hidden overflow-hidden lg:block lg:w-1/2">
        <img
          src="https://images.pexels.com/photos/9218402/pexels-photo-9218402.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Boutique store"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-ink-950/20" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <h2 className="font-display text-4xl font-bold leading-tight text-white">
            Hello Admin
          </h2>
          <p className="mt-3 max-w-md text-ink-200">
            Sign in to add value to our customers.
          </p>
          <div className="mt-6 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 backdrop-blur">
              <ShoppingBag size={22} className="text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md animate-fade-up">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-ink-900"
          >
            <ArrowRight size={16} className="rotate-180" /> Back to store
          </button>

          <h1 className="font-display text-3xl font-bold text-ink-900">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-ink-500">
            {mode === "signin"
              ? "Sign in to add value to our customers."
              : "Join Maison today."}
          </p>

          <div className="mt-8 flex rounded-full bg-ink-100 p-1">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${
                mode === "signin"
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-500"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full py-2.5 text-sm font-semibold transition-all ${
                mode === "signup"
                  ? "bg-white text-ink-900 shadow-sm"
                  : "text-ink-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                {mode === "signup" ? "User Name" : "User Id"}
              </label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type="text"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder={mode === "signup" ? "John Doe" : "U1234"}
                  className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-ink-700">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-12 pr-12 text-sm outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 transition-colors hover:text-ink-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div className="animate-fade-in">
                <label className="mb-1.5 block text-sm font-medium text-ink-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-ink-200 bg-white py-3 pl-12 pr-4 text-sm outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-error-500/10 px-4 py-3 text-sm font-medium text-error-600 animate-fade-in">
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 rounded-xl bg-success-500/10 px-4 py-3 text-sm font-medium text-success-600 animate-fade-in">
                <Check size={16} /> {success}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink-900 py-3.5 text-sm font-semibold text-white transition-all hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500">
            {mode === "signin"
              ? "Don't have an account? "
              : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              {mode === "signin" ? "Sign up" : "Sign in"}
            </button>
          </p>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-ink-400">
            <span>Your data is encrypted and secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}

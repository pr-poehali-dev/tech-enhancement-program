import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/extensions/auth-email/useAuth";
import LoginForm from "@/components/extensions/auth-email/LoginForm";
import RegisterForm from "@/components/extensions/auth-email/RegisterForm";
import UserProfile from "@/components/extensions/auth-email/UserProfile";

const AUTH_URL = "https://functions.poehali.dev/3d3639a6-0edd-4a54-a800-82deab2ec9bc";

const apiUrls = {
  login: `${AUTH_URL}?action=login`,
  register: `${AUTH_URL}?action=register`,
  verifyEmail: `${AUTH_URL}?action=verify-email`,
  refresh: `${AUTH_URL}?action=refresh`,
  logout: `${AUTH_URL}?action=logout`,
  resetPassword: `${AUTH_URL}?action=reset-password`,
};

export default function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const auth = useAuth({ apiUrls });

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-white text-sm">Загрузка...</div>
      </div>
    );
  }

  if (auth.isAuthenticated && auth.user) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <button
            onClick={() => navigate("/")}
            className="text-neutral-400 hover:text-white text-sm uppercase tracking-wide mb-8 flex items-center gap-2 transition-colors"
          >
            ← На главную
          </button>
          <UserProfile user={auth.user} onLogout={async () => { await auth.logout(); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/")}
          className="text-neutral-400 hover:text-white text-sm uppercase tracking-wide mb-8 flex items-center gap-2 transition-colors"
        >
          ← На главную
        </button>

        {mode === "login" ? (
          <LoginForm
            onLogin={auth.login}
            isLoading={auth.isLoading}
            error={auth.error}
            onSwitchToRegister={() => setMode("register")}
          />
        ) : (
          <RegisterForm
            onRegister={auth.register}
            onVerifyEmail={auth.verifyEmail}
            isLoading={auth.isLoading}
            error={auth.error}
            onSwitchToLogin={() => setMode("login")}
          />
        )}
      </div>
    </div>
  );
}

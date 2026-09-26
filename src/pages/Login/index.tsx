import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Button } from "../../components/ui";
import { BrandMark } from "../../components/layout/BrandMark";
import { useSession } from "../../hooks/useSession";

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setLoading(true);
    window.setTimeout(() => {
      signIn(email, remember);
      setLoading(false);
      navigate("/dashboard", { replace: true });
    }, 650);
  }

  return (
    <main className="login-screen">
      <section className="login-brand">
        <Link to="/login" className="brand-lockup">
          <BrandMark />
          <span>taskflow</span>
        </Link>
        <div className="login-message">
          <span className="eyebrow">LESS BUSYWORK. MORE GOOD WORK.</span>
          <h1>
            Make room for
            <br />
            <em>great work.</em>
          </h1>
          <p>
            One thoughtful place to plan projects, bring your team together, and
            move ideas forward.
          </p>
          <div className="login-quote">
            <div className="quote-avatars">
              <Avatar
                name="Maya Chen"
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=96&h=96&q=80"
                size="small"
              />
              <Avatar
                name="Oliver Grant"
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=96&h=96&q=80"
                size="small"
              />
              <Avatar
                name="Sofia Reyes"
                src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=96&h=96&q=80"
                size="small"
              />
            </div>
            <span>Built for the way good teams work.</span>
          </div>
        </div>
        <span className="login-copyright">© 2026 TaskFlow, Inc.</span>
      </section>
      <section className="login-form-side">
        <form className="login-form" onSubmit={submit} noValidate>
          <div className="mobile-brand">
            <BrandMark /> taskflow
          </div>
          <span className="eyebrow">WELCOME BACK</span>
          <h2>Sign in to your workspace</h2>
          <p className="login-subtitle">
            Your team's next great thing is waiting.
          </p>
          <label className="login-label" htmlFor="email">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label className="login-label password-label" htmlFor="password">
            Password{" "}
            <button type="button" className="forgot-link">
              Forgot password?
            </button>
          </label>
          <div className="password-input">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <label className="remember-label">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />{" "}
            Remember me
          </label>
          {error && (
            <p className="field-error" role="alert">
              {error}
            </p>
          )}
          <Button className="login-submit" disabled={loading}>
            {loading ? (
              <>
                <span className="button-spinner" /> Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="login-demo">
            Demo workspace · Use any valid email and a 6+ character password.
          </p>
          <p className="login-support">
            Having trouble?{" "}
            <a href="mailto:support@taskflow.team">Contact support</a>
          </p>
        </form>
      </section>
    </main>
  );
}

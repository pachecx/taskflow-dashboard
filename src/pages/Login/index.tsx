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
    <main className="grid min-h-screen grid-cols-[minmax(380px,0.9fr)_minmax(440px,1.1fr)] bg-[#f9faf8] text-[#25352d] max-[650px]:block max-[650px]:min-h-[100dvh]">
      <section className="relative flex min-h-screen flex-col bg-[#1e382d] px-[9%] py-8.5 text-[#f4f7f3] [background-image:linear-gradient(90deg,#ffffff08_1px,transparent_1px),linear-gradient(#ffffff08_1px,transparent_1px)] [background-size:48px_48px] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(135deg,#25453720,transparent_60%)] after:content-[''] max-[650px]:hidden [&>*]:z-[1]">
        <Link
          to="/login"
          className="flex items-center gap-2.5 font-['Manrope',sans-serif] text-[19px] leading-none font-extrabold text-[#f2f8f4]"
        >
          <BrandMark />
          <span>taskflow</span>
        </Link>
        <div className="m-auto w-full max-w-105 py-10 pb-13.75">
          <span className="mb-2.25 text-[9px] font-bold tracking-[1.15px] text-[#a6c6ae]">
            LESS BUSYWORK. MORE GOOD WORK.
          </span>
          <h1 className="mt-3.75 mb-3.5 font-['Manrope',sans-serif] text-[42px] leading-[1.14] font-semibold">
            Make room for
            <br />
            <em className="not-italic text-[#a7cfae]">great work.</em>
          </h1>
          <p className="max-w-83.75 text-xs leading-[1.8] text-[#bdcbbf]">
            One thoughtful place to plan projects, bring your team together, and
            move ideas forward.
          </p>
          <div className="mt-10.5 flex items-center gap-3 text-[10px] text-[#d4dfd6]">
            <div className="flex pl-1 [&>img]:-ml-1 [&>img]:border-[#1e382d]">
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
        <span className="text-[9px] text-[#93a89a]">© 2026 TaskFlow, Inc.</span>
      </section>
      <section className="grid place-items-center p-8.5 max-[650px]:min-h-[100dvh] max-[650px]:px-6 max-[650px]:py-6.25">
        <form
          className="w-full max-w-87.5 max-[650px]:max-w-95"
          onSubmit={submit}
          noValidate
        >
          <div className="mb-11.25 hidden items-center gap-2 font-['Manrope',sans-serif] text-[17px] font-extrabold text-[#283b30] max-[650px]:flex">
            <BrandMark /> taskflow
          </div>
          <span className="mb-2.25 block text-[9px] font-bold tracking-[1px] text-[#73917c]">
            WELCOME BACK
          </span>
          <h2 className="m-0 font-['Manrope',sans-serif] text-[22px] font-bold text-[#24342c] max-[650px]:text-[21px]">
            Sign in to your workspace
          </h2>
          <p className="mt-1.75 mb-6.75 text-[11px] text-[#819087]">
            Your team's next great thing is waiting.
          </p>
          <label
            className="mt-3.75 mb-1.75 flex items-center justify-between text-[10px] font-semibold text-[#425349]"
            htmlFor="email"
          >
            Email address
          </label>
          <input
            className="h-10 w-full rounded-[5px] border border-[#e1e8e1] bg-white px-2.75 text-[11px] text-[#26372d] outline-none placeholder:text-[#a5aea7] focus:border-[#80ab8b] focus:shadow-[0_0_0_3px_#80ab8b1e]"
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <label
            className="mt-3.75 mb-1.75 flex items-center justify-between text-[10px] font-semibold text-[#425349]"
            htmlFor="password"
          >
            Password{" "}
            <button
              type="button"
              className="border-0 bg-transparent p-0 text-[9px] font-semibold text-[#458260]"
            >
              Forgot password?
            </button>
          </label>
          <div className="flex h-10 w-full items-center rounded-[5px] border border-[#e1e8e1] bg-white focus-within:border-[#80ab8b] focus-within:shadow-[0_0_0_3px_#80ab8b1e]">
            <input
              className="h-full w-full border-0 bg-transparent px-2.75 text-[11px] text-[#26372d] outline-none placeholder:text-[#a5aea7]"
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              className="h-full border-0 bg-transparent px-2.75 text-[9px] font-semibold text-[#5b8568]"
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <label className="mt-3.5 mb-4.75 flex items-center gap-1.75 text-[10px] text-[#647269]">
            <input
              className="m-0 h-3.25 w-3.25 accent-[#43825e]"
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />{" "}
            Remember me
          </label>
          {error && (
            <p
              className="-mt-2.25 mb-3 text-[10px] text-[#b45f4d]"
              role="alert"
            >
              {error}
            </p>
          )}
          <Button className="!min-h-10.25 w-full" disabled={loading}>
            {loading ? (
              <>
                <span className="h-3.25 w-3.25 animate-[spin_0.7s_linear_infinite] rounded-full border-2 border-[#ffffff75] border-t-white" />{" "}
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          <p className="mt-3 mb-0 text-center text-[9px] text-[#87948a]">
            Demo workspace · Use any valid email and a 6+ character password.
          </p>
          <p className="mt-8 mb-0 text-center text-[9px] text-[#859188] max-[650px]:mt-7">
            Having trouble?{" "}
            <a
              className="font-semibold text-[#43825e]"
              href="mailto:support@taskflow.team"
            >
              Contact support
            </a>
          </p>
        </form>
      </section>
    </main>
  );
}

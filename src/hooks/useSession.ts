import { useState } from "react";

export function isAuthenticated() {
  return localStorage.getItem("taskflow-session") === "active";
}

export function startSession(email: string, remember: boolean) {
  localStorage.setItem("taskflow-session", "active");
  if (remember) localStorage.setItem("taskflow-user", email);
  else localStorage.removeItem("taskflow-user");
}

export function endSession() {
  localStorage.removeItem("taskflow-session");
}

export function getSessionEmail() {
  return localStorage.getItem("taskflow-user") ?? "alex@taskflow.team";
}

export function useSession() {
  const [authenticated] = useState(isAuthenticated);
  const [email] = useState(getSessionEmail);
  return { authenticated, email, signIn: startSession, signOut: endSession };
}

"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Workout } from "@/app/types/workout";

type Toast = { id: number; message: string };

type FitlogContextValue = {
  plan: Workout[];
  saved: Workout[];
  done: number[];
  addToPlan: (workout: Workout) => void;
  saveWorkout: (workout: Workout) => void;
  removeFromPlan: (id: number) => void;
  removeFromSaved: (id: number) => void;
  markDone: (id: number) => void;
  isInPlan: (id: number) => boolean;
  isSaved: (id: number) => boolean;
  showToast: (message: string) => void;
  toasts: Toast[];
};

const FitlogContext = createContext<FitlogContextValue | null>(null);
const PLAN_KEY = "fitlog-plan";
const SAVED_KEY = "fitlog-saved";
const DONE_KEY = "fitlog-done";

export function FitlogProvider({ children }: { children: React.ReactNode }) {
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      setPlan(JSON.parse(localStorage.getItem(PLAN_KEY) || "[]"));
      setSaved(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"));
      setDone(JSON.parse(localStorage.getItem(DONE_KEY) || "[]"));
    } catch {
      // Ignore malformed local storage and start clean.
    }
  }, []);

  useEffect(() => localStorage.setItem(PLAN_KEY, JSON.stringify(plan)), [plan]);
  useEffect(() => localStorage.setItem(SAVED_KEY, JSON.stringify(saved)), [saved]);
  useEffect(() => localStorage.setItem(DONE_KEY, JSON.stringify(done)), [done]);

  const showToast = (message: string) => {
    const id = Date.now() + Math.random();
    setToasts((current) => [...current, { id, message }]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 2400);
  };

  const addToPlan = (workout: Workout) => {
    if (plan.some((item) => item.id === workout.id)) {
      showToast("Already in today's plan");
      return;
    }
    if (plan.length >= 5) {
      showToast("Today's plan is full (5 lifts max)");
      return;
    }
    setPlan((current) => [...current, workout]);
    showToast("Added to today's plan");
  };

  const saveWorkout = (workout: Workout) => {
    if (saved.some((item) => item.id === workout.id)) {
      showToast("Already saved");
      return;
    }
    setSaved((current) => [...current, workout]);
    showToast("Saved for later");
  };

  const removeFromPlan = (id: number) => {
    setPlan((current) => current.filter((item) => item.id !== id));
    setDone((current) => current.filter((item) => item !== id));
    showToast("Removed from today's plan");
  };

  const removeFromSaved = (id: number) => {
    setSaved((current) => current.filter((item) => item.id !== id));
    showToast("Removed from saved");
  };

  const markDone = (id: number) => {
    setDone((current) => (current.includes(id) ? current : [...current, id]));
    showToast("Workout marked as done");
  };

  const value = useMemo(
    () => ({
      plan,
      saved,
      done,
      addToPlan,
      saveWorkout,
      removeFromPlan,
      removeFromSaved,
      markDone,
      isInPlan: (id: number) => plan.some((item) => item.id === id),
      isSaved: (id: number) => saved.some((item) => item.id === id),
      showToast,
      toasts,
    }),
    [plan, saved, done, toasts]
  );

  return <FitlogContext.Provider value={value}>{children}</FitlogContext.Provider>;
}

export function useFitlog() {
  const context = useContext(FitlogContext);
  if (!context) throw new Error("useFitlog must be used inside FitlogProvider");
  return context;
}

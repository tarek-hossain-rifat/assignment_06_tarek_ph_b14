"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Workout } from "@/app/types/workout";

type Toast = {
  id: number;
  message: string;
};

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

export function FitlogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Keep the initial state identical on server and client
  const [plan, setPlan] = useState<Workout[]>([]);
  const [saved, setSaved] = useState<Workout[]>([]);
  const [done, setDone] = useState<number[]>([]);

  const [hydrated, setHydrated] = useState(false);

  // Custom toast state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load localStorage data after hydration
  useEffect(() => {
    try {
      const storedPlan = localStorage.getItem(PLAN_KEY);
      const storedSaved = localStorage.getItem(SAVED_KEY);
      const storedDone = localStorage.getItem(DONE_KEY);

      if (storedPlan) {
        const parsedPlan: unknown = JSON.parse(storedPlan);

        if (Array.isArray(parsedPlan)) {
          setPlan(parsedPlan as Workout[]);
        }
      }

      if (storedSaved) {
        const parsedSaved: unknown = JSON.parse(storedSaved);

        if (Array.isArray(parsedSaved)) {
          setSaved(parsedSaved as Workout[]);
        }
      }

      if (storedDone) {
        const parsedDone: unknown = JSON.parse(storedDone);

        if (Array.isArray(parsedDone)) {
          setDone(parsedDone as number[]);
        }
      }
    } catch {
      console.log("Could not load FitLog data from localStorage");
    } finally {
      setHydrated(true);
    }
  }, []);

  // Save plan
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(PLAN_KEY, JSON.stringify(plan));
  }, [plan, hydrated]);

  // Save saved workouts
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }, [saved, hydrated]);

  // Save completed workouts
  useEffect(() => {
    if (!hydrated) return;

    localStorage.setItem(DONE_KEY, JSON.stringify(done));
  }, [done, hydrated]);

  // Show toast
  const showToast = (message: string) => {
    const id = Date.now() + Math.random();

    setToasts((current) => [
      ...current,
      {
        id,
        message,
      },
    ]);

    window.setTimeout(() => {
      setToasts((current) =>
        current.filter((toast) => toast.id !== id),
      );
    }, 2400);
  };

  // Add workout to today's plan
  const addToPlan = (workout: Workout) => {
    if (plan.some((item) => item.id === workout.id)) {
      showToast("Already added to today's plan");
      return;
    }

    if (plan.length >= 5) {
      showToast("Today's plan is full (5 lifts max)");
      return;
    }

    setPlan((current) => [...current, workout]);

    showToast("Added to today's plan");
  };

  // Save workout
  const saveWorkout = (workout: Workout) => {
    if (saved.some((item) => item.id === workout.id)) {
      showToast("Already saved for later");
      return;
    }

    setSaved((current) => [...current, workout]);

    showToast("Saved for later");
  };

  // Remove workout from today's plan
  const removeFromPlan = (id: number) => {
    setPlan((current) =>
      current.filter((item) => item.id !== id),
    );

    setDone((current) =>
      current.filter((item) => item !== id),
    );

    showToast("Removed from today's plan");
  };

  // Remove workout from saved
  const removeFromSaved = (id: number) => {
    setSaved((current) =>
      current.filter((item) => item.id !== id),
    );

    showToast("Removed from saved");
  };

  // Mark workout as done
  const markDone = (id: number) => {
    setDone((current) =>
      current.includes(id) ? current : [...current, id],
    );

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

      isInPlan: (id: number) =>
        plan.some((item) => item.id === id),

      isSaved: (id: number) =>
        saved.some((item) => item.id === id),

      showToast,
      toasts,
    }),
    [plan, saved, done, toasts],
  );

  return (
    <FitlogContext.Provider value={value}>
      {children}
    </FitlogContext.Provider>
  );
}

export function useFitlog() {
  const context = useContext(FitlogContext);

  if (!context) {
    throw new Error(
      "useFitlog must be used inside FitlogProvider",
    );
  }

  return context;
}
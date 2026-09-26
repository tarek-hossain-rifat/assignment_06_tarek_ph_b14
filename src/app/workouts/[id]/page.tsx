import { notFound } from "next/navigation";
import { getWorkout } from "@/app/lib/api";
import WorkoutDetailsClient from "@/app/components/WorkoutDetailsClient";

export default async function WorkoutDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workout = await getWorkout(id);
  if (!workout) notFound();
  return <WorkoutDetailsClient workout={workout} />;
}

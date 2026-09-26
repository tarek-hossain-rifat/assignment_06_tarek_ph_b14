import Image from "next/image";
import Link from "next/link";
import { Clock3, Flame, Star } from "lucide-react";
import type { Workout } from "@/app/types/workout";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link href={`/workouts/${workout.id}`} className="group block overflow-hidden rounded-xl border border-[#272c35] bg-[#15181e] transition hover:-translate-y-1 hover:border-[#c8ff00]/40">
      <div className="relative aspect-[1.9/1] overflow-hidden">
        <Image src={workout.image} alt={workout.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-4">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {workout.muscleGroups.map((group) => <span key={group} className="rounded-full bg-[#c8ff00] px-2.5 py-1 text-[9px] font-black uppercase text-black">{group}</span>)}
        </div>
        <h3 className="font-display text-base font-black uppercase text-white">{workout.name}</h3>
        <p className="mt-1 truncate text-[10px] text-zinc-500">{workout.equipment}</p>
        <div className="mt-3 flex items-center gap-3 border-t border-[#252a32] pt-3 text-[10px] text-zinc-400">
          <span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{workout.duration} min</span>
          <span className="inline-flex items-center gap-1"><Flame className="h-3 w-3" />{workout.caloriesBurned} kcal</span>
          <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{workout.rating}</span>
        </div>
      </div>
    </Link>
  );
}

import MyPlanClient from "@/app/components/MyPlanClient";

export default async function MyPlanPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const params = await searchParams;
  const tab = params.tab === "saved" ? "saved" : "plan";
  return <MyPlanClient initialTab={tab} />;
}

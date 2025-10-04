import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <div className="m-10 pl-30 pr-30">
      <Skeleton num={1} />
    </div>
  );
}

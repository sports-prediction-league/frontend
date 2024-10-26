import { cn } from "src/lib/utils";

export default function MaxWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full mx-auto max-x-[1360px] md:max-x-[1382px] px-0 md:px-8",
        className
      )}>
      {children}
    </div>
  );
}

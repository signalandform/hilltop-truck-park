type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Badge({ children, className = "" }: Props) {
  return (
    <span
      className={`inline-block text-[10px] font-semibold uppercase tracking-wider text-htp-navy bg-htp-navy/10 px-2.5 py-1 rounded-full ${className}`.trim()}
    >
      {children}
    </span>
  );
}

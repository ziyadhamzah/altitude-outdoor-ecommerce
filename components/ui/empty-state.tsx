import Link from 'next/link';

type EmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  action?: { label: string; href: string };
  className?: string;
};

export const EmptyState = ({
  eyebrow,
  title,
  description,
  action,
  className,
}: EmptyStateProps) => (
  <div className={className}>
    <p className="alt-eyebrow alt-eyebrow-bronze">{eyebrow}</p>
    <h2 className="mt-5 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1] tracking-[-0.03em]">{title}</h2>
    <p className="mt-4 max-w-sm text-sm text-muted">{description}</p>
    {action ? (
      <Link href={action.href} className="btn btn-dark mt-8">
        {action.label}
      </Link>
    ) : null}
  </div>
);

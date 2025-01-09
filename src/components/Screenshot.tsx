
import { clsx } from 'clsx'
import Image from 'next/image'
export function Screenshot({
  src,
  className,
}: {
  src: string
  className?: string
}) {
  return (
    <div
      className={clsx(
        className,
        'relative aspect-[var(--width)/var(--height)] [--radius:theme(borderRadius.xl)]',
      )}
    >
      <div className="absolute -inset-[var(--padding)] rounded-[calc(var(--radius)+var(--padding))] shadow-sm ring-1 ring-black/5 [--padding:theme(spacing.2)]" />
      <Image
        alt=""
        src={src}
        className="h-full w-full object-cover object-top rounded-[var(--radius)] shadow-2xl ring-1 ring-black/10"
      />
    </div>
  )
}

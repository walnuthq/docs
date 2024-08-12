import Image, { type ImageProps } from 'next/image'

import logoWalnut from '@/images/logos/walnut.svg'
import logoWalnutWhite from '@/images/logos/walnut_white.svg'
import { useTheme } from 'next-themes'

export function Logo({ src, alt, ...props }: Partial<ImageProps>) {
  let { resolvedTheme } = useTheme()
	return <Image src={resolvedTheme === 'dark'? logoWalnutWhite : logoWalnut} alt="Walnut logo" unoptimized  className="h-8 w-auto " />
}

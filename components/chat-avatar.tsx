"use client"

import { useMemo } from "react"
import { Avatar, Style } from "@dicebear/core"
import gaze from "@dicebear/styles/gaze.json" with { type: "json" }
import Image from "next/image"

const gazeStyle = new Style(gaze)

type ChatAvatarProps = {
  seed: string
  animated?: boolean
  className?: string
}

export function ChatAvatar({
  seed,
  animated = false,
  className,
}: ChatAvatarProps) {
  const src = useMemo(
    () =>
      new Avatar(gazeStyle, {
        seed,
        size: 32,
        ...(animated ? { tags: ["animation"] } : {}),
      }).toDataUri(),
    [seed, animated]
  )

  return (
    <Image
      src={src}
      alt="Chat avatar"
      width={32}
      height={32}
      className={className}
      unoptimized
    />
  )
}

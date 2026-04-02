"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value?: number[]
  defaultValue?: number[]
  min?: number
  max?: number
  step?: number
  onValueChange?: (value: number | readonly number[]) => void
  className?: string
}

function Slider({
  className,
  value,
  defaultValue,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  ...props
}: SliderProps) {
  const currentValue = value?.[0] ?? defaultValue?.[0] ?? min
  const percentage = ((currentValue - min) / (max - min)) * 100

  return (
    <div className={cn("relative flex w-full touch-none items-center select-none", className)} data-slot="slider">
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="absolute h-full bg-primary"
          style={{ width: `${percentage}%` }}
          data-slot="slider-range"
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={currentValue}
        onChange={(e) => {
          const v = Number(e.target.value)
          onValueChange?.(v)
        }}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        {...props}
      />
      <div
        className="absolute block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] hover:ring-3 focus-visible:ring-3"
        style={{ left: `calc(${percentage}% - 6px)` }}
        data-slot="slider-thumb"
      />
    </div>
  )
}

export { Slider }

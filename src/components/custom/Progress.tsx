import React from 'react'

//ui
import { Progress as ProgressCon } from '../ui/progress'
//props
interface ProgressProps {
    value: number | null | undefined
    className?: string
    max?: number | undefined
}
const Progress = ({value, className,max}:ProgressProps) => {
  return (
    <ProgressCon max={max} value={value} className={className} />
  )
}

export default Progress
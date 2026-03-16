'use client'

import { createContext, useContext } from 'react'
import type { FluidSimulationOGL } from '@/components/fluid/FluidSimulationOGL'

export const FluidContext = createContext<FluidSimulationOGL | null>(null)
export const useFluid = () => useContext(FluidContext)

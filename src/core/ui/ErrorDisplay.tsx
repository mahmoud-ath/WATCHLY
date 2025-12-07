'use client'

import { AlertCircle } from 'lucide-react'

export const ErrorDisplay = ({ message }: { message: string }) => {
  return (
    <div className="glass border border-red-500/30 rounded-2xl p-8 text-center animate-in fade-in duration-300">
      <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-red-500/30">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-xl font-semibold text-text-primary mb-2">Something went wrong</h3>
      <p className="text-text-secondary">{message}</p>
    </div>
  )
}

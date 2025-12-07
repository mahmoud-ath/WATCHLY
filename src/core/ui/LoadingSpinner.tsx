'use client'

export const LoadingSpinner = ({ message = 'Loading...' }: { message?: string }) => {
  return (
    <div className="flex items-center justify-center gap-3 p-8">
      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      <span className="text-text-secondary">{message}</span>
    </div>
  )
}

'use client'

export const Button = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}: { 
  children: React.ReactNode
  onClick: () => void
  variant?: 'primary' | 'secondary'
}) => {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
  const variantClasses = variant === 'primary' 
    ? "bg-primary text-white"
    : "glass border border-border/30 text-text-secondary hover:text-text-primary"
  
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses}`}>
      {children}
    </button>
  )
}

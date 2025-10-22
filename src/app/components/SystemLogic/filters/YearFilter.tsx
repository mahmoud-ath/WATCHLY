// components/filters/YearFilter.tsx
'use client'

interface YearFilterProps {
  years: string[]
  selectedYear: string
  onYearChange: (year: string) => void
}

export const YearFilter = ({ years, selectedYear, onYearChange }: YearFilterProps) => {
  return (
    <div className="glass rounded-2xl p-5 border border-white/10">
      <h2 className="font-semibold mb-4 text-white flex items-center space-x-2">
        <span className="text-lg">📅</span>
        <span>Release Year</span>
      </h2>
      <div className="space-y-3">
        {years.map((year) => (
          <label key={year} className="flex items-center space-x-3 cursor-pointer group">
            <input 
              type="radio" 
              name="year"
              checked={selectedYear === year}
              onChange={() => onYearChange(year)}
              className="accent-primary transform scale-110" 
            />
            <span className={`text-sm transition-all duration-200 ${
              selectedYear === year 
                ? 'text-white font-semibold' 
                : 'text-gray-300 group-hover:text-white'
            }`}>
              {year}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
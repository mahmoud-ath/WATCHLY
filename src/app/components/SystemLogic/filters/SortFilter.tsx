// components/filters/SortFilter.tsx
'use client'

interface SortFilterProps {
  sortOptions: string[]
  selectedSort: string
  onSortChange: (sort: string) => void
}

export const SortFilter = ({ sortOptions, selectedSort, onSortChange }: SortFilterProps) => {
  return (
    <div className="glass rounded-2xl p-5 border border-white/10">
      <h2 className="font-semibold mb-4 text-white flex items-center space-x-2">
        <span className="text-lg">📊</span>
        <span>Sort By</span>
      </h2>
      <div className="space-y-3">
        {sortOptions.map((sort) => (
          <label key={sort} className="flex items-center space-x-3 cursor-pointer group">
            <input 
              type="radio" 
              name="sort"
              checked={selectedSort === sort}
              onChange={() => onSortChange(sort)}
              className="accent-primary transform scale-110" 
            />
            <span className={`text-sm transition-all duration-200 ${
              selectedSort === sort 
                ? 'text-white font-semibold' 
                : 'text-gray-300 group-hover:text-white'
            }`}>
              {sort}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
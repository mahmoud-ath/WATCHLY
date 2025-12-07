# WATCHLY - Workflow Analysis & Redundancy Report
*Generated: December 7, 2025*

---

## Table of Contents
1. [Home Page Workflow](#1-home-page-workflow)
2. [Favorites Page Workflow](#2-favorites-page-workflow)
3. [Common Flows](#3-common-flows)
4. [Redundancy Analysis](#4-redundancy-analysis)
5. [Optimization Recommendations](#5-optimization-recommendations)

---

## 1. HOME PAGE WORKFLOW

### 1.1 Component Hierarchy
```
app/home/page.tsx (Entry Point)
    ↓
useHomeLogic() Hook [Business Logic Layer]
    ├── useMovieSearch() [Movie data management]
    ├── useFavorites() [Favorites management]
    ├── useMovieFilters() [Filter state]
    └── useDebounce() [Search optimization]
    ↓
Navbar (Search + Category Switcher)
    ↓
MoviesSection (Display Layer)
    ├── FilterNavbar [Genre/Year/Rating filters]
    ├── MovieGrid [Movie cards display]
    └── MovieDetailsPopup [Modal for details]
```

### 1.2 Detailed User Journey Flow

#### **A. Initial Page Load**
```mermaid
User visits /home
    ↓
useHomeLogic initializes
    ├── selectedCategory: 'trending'
    ├── searchQuery: ''
    └── selectedMovie: null
    ↓
useMovieSearch() activates
    ↓
fetchMovies() called
    ├── Checks: debouncedSearchQuery === '' ?
    ├── YES → getMoviesByCategory('popular')
    └── Fetches from TMDB API
    ↓
filterMovies() applies filters
    ├── genres: []
    ├── rating: ''
    └── year: ''
    ↓
setState updates
    ├── movies: TMDBMovie[]
    ├── filteredMovies: TMDBMovie[]
    └── loading: false
    ↓
Render MovieGrid with cards
    ↓
User sees: 20 movies from 'popular' category
```

#### **B. Search Flow**
```mermaid
User types in Navbar search input
    ↓
handleSearch(query) called
    ├── setSearchQuery(query)
    └── setSelectedCategory('search')
    ↓
useDebounce() delays by 500ms
    ↓
debouncedSearchQuery updates
    ↓
useEffect triggers fetchMovies()
    ↓
searchMovies(query, page) API call
    ↓
Results filtered by active filters
    ├── Check genres match
    ├── Check rating threshold
    └── Check year match
    ↓
Display filtered results in MovieGrid
    ↓
User sees: Search results (max 20 pages)
```

**Key State Changes:**
- `searchQuery`: '' → 'avatar'
- `selectedCategory`: 'trending' → 'search'
- `movies`: [previous] → [search results]
- `filteredMovies`: [previous] → [filtered search results]

#### **C. Category Switch Flow**
```mermaid
User clicks category button (e.g., "Top Rated")
    ↓
CategorySwitcher calls onCategoryChange('top_rated')
    ↓
handleSelectCategory() in useHomeLogic
    ├── setSelectedCategory('top_rated')
    └── setSearchQuery('') [CLEARS SEARCH]
    ↓
useEffect detects category change
    └── setSelectedMovie(null) [CLOSES POPUP]
    ↓
useMovieSearch fetches new category
    ↓
getMoviesByCategory('top_rated', 1)
    ↓
Results filtered and displayed
    ↓
User sees: Top rated movies
```

**Key State Changes:**
- `selectedCategory`: 'popular' → 'top_rated'
- `searchQuery`: 'anything' → ''
- `movies`: [old movies] → [new category movies]
- `selectedMovie`: Movie → null

#### **D. Apply Filters Flow**
```mermaid
User selects filters in FilterNavbar
    ├── Genre: "Action"
    ├── Year: "2024"
    └── Rating: "7+"
    ↓
onFilterChange() called for each filter
    ↓
handleFilterUpdate() in useHomeLogic
    ├── updateFilters({ ...filters, [type]: value })
    └── Triggers useMovieSearch filter state
    ↓
useMovieSearch detects filter change
    ↓
Existing movies re-filtered locally
    ├── filterMovies(movies, newFilters)
    └── NO NEW API CALL (uses cached movies)
    ↓
filteredMovies updated
    ↓
MovieGrid re-renders with fewer movies
    ↓
User sees: Filtered subset of current movies
```

**Key State Changes:**
- `filters.genres`: [] → ['Action']
- `filters.year`: '' → '2024'
- `filters.rating`: '' → '7'
- `movies`: [unchanged]
- `filteredMovies`: [20 movies] → [5 matching movies]

#### **E. Movie Click → Details Popup Flow**
```mermaid
User clicks MovieCard
    ↓
onMovieClick(movie) in MovieGrid
    ↓
setSelectedMovie(movie) in useHomeLogic
    ↓
MoviesSection detects selectedMovie !== null
    ↓
Renders MovieDetailsPopup
    ├── isOpen={true}
    ├── movie={selectedMovie}
    └── Triggers similar movies fetch
    ↓
MovieDetailsPopup useEffect runs
    ↓
fetchSimilarMovies() API call
    ├── GET /movie/{id}/similar
    └── Returns 6 similar movies
    ↓
User sees:
    ├── Movie details overlay
    ├── Poster, title, overview
    ├── Vote average, release date
    ├── Favorite button (heart icon)
    └── Similar movies grid (6 cards)
```

**Key State Changes:**
- `selectedMovie`: null → TMDBMovie object
- `isPopupOpen`: (implicit true via selectedMovie)
- MovieDetailsPopup internal state:
  - `similarMovies`: [] → [6 movies]
  - `isLoadingSimilar`: false → true → false

#### **F. Add to Favorites Flow (from Home)**
```mermaid
User clicks heart icon on MovieCard
    ↓
MovieCard calls onAddToFavorites(movie)
    ↓
toggleFavorite(movie) in useHomeLogic
    ↓
Check: isFavorite(movieId) ?
    ├── YES → removeFromFavorites()
    └── NO → Path below
    ↓
Transform TMDBMovie → DisplayMovie
    ├── Map TMDB fields to OMDB format
    ├── imdbID: movie.id.toString()
    ├── Title: movie.title
    ├── Year: extract from release_date
    ├── Plot: movie.overview
    ├── Poster: construct full URL
    └── [20+ field mappings]
    ↓
addToFavorites(displayMovie) in useFavorites
    ↓
Check: Already exists?
    ├── YES → toast.error("Already in favorites")
    └── NO → Path below
    ↓
Add timestamp: addedAt = new Date().toISOString()
    ↓
Update localStorage
    ├── Key: 'favorites'
    └── Value: [...prev, movieWithTimestamp]
    ↓
toast.success("Movie added to favorites!")
    ↓
showFavoriteAdded(movie.title) callback
    ↓
User sees:
    ├── Toast notification (3s)
    ├── Heart icon filled
    └── Movie in favorites (accessible via /favorite-movie)
```

**Key State Changes:**
- `useFavorites.favorites`: [n movies] → [n+1 movies]
- localStorage: Updated with new movie
- `MovieCard.favorite`: false → true
- Toast: Hidden → Visible → Hidden

---

## 2. FAVORITES PAGE WORKFLOW

### 2.1 Component Hierarchy
```
app/favorite-movie/page.tsx (Entry Point)
    ↓
useFavoritesLogic() Hook [Business Logic Layer]
    ├── useFavorites() [Data from localStorage]
    ├── useFavoriteSearch() [Local filtering]
    └── useRouter() [Navigation]
    ↓
Navbar (No search - disabled)
    ↓
Conditional Rendering:
    ├── IF favorites.length === 0
    │   └── FavoritesEmpty
    │       └── "Browse Movies" button
    └── ELSE
        ├── FavoritesToolbar [Bulk actions]
        ├── FavoritesGrid [Movie cards with selection]
        └── ConfirmationModal [Delete confirmation]
```

### 2.2 Detailed User Journey Flow

#### **A. Initial Page Load**
```mermaid
User visits /favorite-movie
    ↓
useFavoritesLogic initializes
    ├── selectedMovie: null
    ├── selectedMovies: new Set()
    ├── showBulkActions: false
    └── modalState: { isOpen: false }
    ↓
useFavorites() loads from localStorage
    ↓
Read key: 'favorites'
    ├── Parse JSON array
    └── Return FavoriteMovie[]
    ↓
useFavoriteSearch(favorites) activates
    ├── searchQuery: ''
    └── filteredFavorites: all favorites
    ↓
Check: favorites.length === 0 ?
    ├── YES → Render FavoritesEmpty
    └── NO → Render FavoritesToolbar + Grid
    ↓
User sees:
    - Total count: "12 movies in your collection"
    - All favorite movies in grid
    - Each with checkbox for selection
```

**Key State Values:**
- `favorites`: FavoriteMovie[] (from localStorage)
- `filteredFavorites`: Same as favorites (no search)
- `favoritesLoading`: false
- `selectedMovies.size`: 0

#### **B. Remove Single Favorite Flow**
```mermaid
User clicks trash icon on MovieCard
    ↓
handleRemoveFromFavorites(movieId, event)
    ├── event.stopPropagation() [Prevents card click]
    └── Find movie in favorites array
    ↓
showConfirmationModal() called
    ├── title: "Remove from Favorites"
    ├── message: "Are you sure you want to remove '{title}'?"
    ├── type: 'single'
    └── onConfirm: () => removeFromFavorites(movieId)
    ↓
ConfirmationModal opens
    ├── Shows movie title
    └── Two buttons: "Cancel" | "Remove"
    ↓
User clicks "Remove"
    ↓
removeFromFavorites(movieId) in useFavorites
    ↓
Filter favorites array
    ├── prev.filter(fav => fav.imdbID !== movieId)
    └── Update localStorage
    ↓
toast.success("Movie removed from favorites!")
    ↓
showRemoveToast(movie.title) callback
    ↓
Modal closes
    ↓
User sees:
    ├── Movie disappears from grid
    ├── Count updates: "12" → "11"
    └── Toast notification
```

**Key State Changes:**
- `favorites`: [12 movies] → [11 movies]
- `modalState.isOpen`: false → true → false
- localStorage: Updated (1 movie removed)
- Grid re-renders without removed movie

#### **C. Bulk Selection Flow**
```mermaid
User clicks checkbox on MovieCard
    ↓
toggleMovieSelection(movieId) called
    ↓
Update Set:
    ├── Has movieId? → Remove from set
    └── Doesn't have? → Add to set
    ↓
setSelectedMovies(new Set(updatedSet))
    ↓
Check: selectedMovies.size > 0 ?
    ├── YES → setShowBulkActions(true)
    └── NO → setShowBulkActions(false)
    ↓
User sees:
    ├── Checkbox checked/unchecked
    ├── Card gets selected styling
    └── Toolbar shows bulk actions
        ├── "Select All" button
        ├── "Remove Selected (3)" button
        └── "Clear Selection" button
```

**Key State Changes:**
- `selectedMovies`: Set() → Set(movieId1, movieId2, movieId3)
- `selectedMovies.size`: 0 → 3
- `showBulkActions`: false → true
- FavoritesToolbar: Hidden → Visible

#### **D. Select All Flow**
```mermaid
User clicks "Select All" button
    ↓
selectAllMovies() in useFavoritesLogic
    ↓
Create Set with all movie IDs
    ├── new Set(filteredFavorites.map(m => m.imdbID))
    └── Uses filteredFavorites (respects search)
    ↓
setSelectedMovies(allIds)
    ↓
setShowBulkActions(true)
    ↓
User sees:
    ├── All checkboxes checked
    ├── All cards have selected styling
    └── Toolbar: "Remove Selected (12)"
```

**Key State Changes:**
- `selectedMovies`: Set(3 items) → Set(12 items)
- `selectedMovies.size`: 3 → 12
- All MovieCards: `isSelected`: false → true

#### **E. Bulk Remove Flow**
```mermaid
User clicks "Remove Selected (5)"
    ↓
handleBulkRemove() called
    ↓
showConfirmationModal() with:
    ├── title: "Remove Multiple Favorites"
    ├── message: "Remove 5 movies from favorites?"
    ├── type: 'bulk'
    └── onConfirm: removeMultipleFavorites([ids])
    ↓
User clicks "Remove"
    ↓
removeMultipleFavorites(movieIds[]) in useFavorites
    ↓
Filter favorites:
    ├── prev.filter(fav => !movieIds.includes(fav.imdbID))
    └── Update localStorage
    ↓
toast.success("5 movies removed from favorites!")
    ↓
showBulkRemoveToast(5) callback
    ↓
clearSelection() called
    ├── setSelectedMovies(new Set())
    └── setShowBulkActions(false)
    ↓
User sees:
    ├── 5 movies disappear from grid
    ├── Count: "12" → "7"
    ├── All selections cleared
    ├── Bulk actions toolbar hidden
    └── Toast notification
```

**Key State Changes:**
- `favorites`: [12] → [7]
- `selectedMovies`: Set(5) → Set()
- `showBulkActions`: true → false
- localStorage: Updated (5 movies removed)

#### **F. Clear All Flow**
```mermaid
User clicks "Clear All" in FavoritesToolbar
    ↓
handleClearAll() called
    ↓
showConfirmationModal() with:
    ├── title: "Clear All Favorites"
    ├── message: "Remove all 12 movies?"
    ├── type: 'clearAll'
    └── onConfirm: clearAllFavorites()
    ↓
User clicks "Clear All"
    ↓
clearAllFavorites() in useFavorites
    ↓
setFavorites([]) [Empty array]
    ↓
localStorage.setItem('favorites', '[]')
    ↓
toast.success("All favorites cleared!")
    ↓
showClearAllToast(12) callback
    ↓
Modal closes
    ↓
Page re-renders
    ↓
favorites.length === 0 → Render FavoritesEmpty
    ↓
User sees:
    ├── Empty state with illustration
    ├── "No favorites yet" message
    └── "Browse Movies" button
```

**Key State Changes:**
- `favorites`: [12] → []
- `selectedMovies`: Set() (already cleared)
- localStorage: '[]'
- View: FavoritesGrid → FavoritesEmpty

#### **G. Search in Favorites Flow**
```mermaid
User types in Navbar search (if enabled)
    ↓
handleSearch(query) called
    ↓
useFavoriteSearch updates
    ↓
setSearchQuery(query)
    ↓
useEffect triggers filtering
    ↓
Filter favorites locally:
    ├── Check Title includes query
    ├── Check Plot includes query
    ├── Check Year includes query
    └── Check Genre includes query (if available)
    ↓
setFilteredFavorites(matches)
    ↓
User sees:
    ├── Fewer movies in grid
    ├── Only matching favorites shown
    └── No API calls (local filtering)
```

**Note:** Currently, Navbar has `showSearch={false}` on favorites page, so search is disabled. This is a design choice.

---

## 3. COMMON FLOWS

### 3.1 Add to Favorites (Shared Logic)

**Used In:**
- Home Page (MovieCard, MovieDetailsPopup)
- Favorites Page (indirectly - already favorited)

**Common Flow:**
```mermaid
Component calls addToFavorites(movie)
    ↓
useFavorites() hook
    ↓
Check: Already exists?
    ├── Compare: fav.imdbID === movie.imdbID
    └── YES → toast.error() + return
    ↓
Add timestamp:
    ├── addedAt: new Date().toISOString()
    └── Creates FavoriteMovie type
    ↓
Update state: setFavorites([...prev, movieWithTimestamp])
    ↓
Update localStorage:
    ├── Key: 'favorites'
    └── Value: JSON.stringify(updated array)
    ↓
toast.success() with custom styling
    ↓
RETURN updated favorites
```

**Consistency Issue Found:**
- Home page: Transforms TMDBMovie → DisplayMovie (20+ fields)
- Favorites: Already DisplayMovie (no transformation)
- **Redundancy**: Transformation logic duplicated in useHomeLogic

### 3.2 Remove from Favorites (Shared Logic)

**Used In:**
- Home Page (MovieCard, MovieDetailsPopup)
- Favorites Page (MovieCard, Bulk Remove, Clear All)

**Common Flow:**
```mermaid
Component calls removeFromFavorites(movieId)
    ↓
useFavorites() hook
    ↓
Find movie: favorites.find(fav => fav.imdbID === movieId)
    ↓
Filter: prev.filter(fav => fav.imdbID !== movieId)
    ↓
Update state: setFavorites(filtered)
    ↓
Update localStorage:
    ├── Key: 'favorites'
    └── Value: JSON.stringify(filtered array)
    ↓
toast.success("Movie removed!")
    ↓
RETURN updated favorites
```

**Variants:**
1. **Single Remove**: `removeFromFavorites(id)`
2. **Bulk Remove**: `removeMultipleFavorites(ids[])`
3. **Clear All**: `clearAllFavorites()`

All use the same localStorage update pattern.

### 3.3 Movie Details Popup (Shared Component)

**Used In:**
- Home Page (MoviesSection)
- NOT used in Favorites Page (missing feature)

**Flow:**
```mermaid
User clicks movie card
    ↓
onMovieClick(movie) called
    ↓
Page sets: setSelectedMovie(movie)
    ↓
MovieDetailsPopup renders with:
    ├── isOpen={true}
    ├── movie={selectedMovie}
    └── Callbacks: onAddToFavorites, onRemoveFromFavorites
    ↓
useEffect triggers:
    ↓
fetchSimilarMovies() API call
    ├── GET /movie/{id}/similar
    ├── Returns 6 similar movies
    └── setSimilarMovies(results)
    ↓
User sees:
    ├── Backdrop overlay
    ├── Popup card with details
    ├── Favorite button (heart)
    ├── TMDB link
    └── Similar movies grid (6 cards)
    ↓
User clicks similar movie
    ↓
onMovieClick(similarMovie) called
    ↓
Popup updates with new movie
    ↓
Fetches similar movies for new movie
```

**Redundancy Found:**
- MovieDetailsPopup has its own favorite button
- Duplicates logic from MovieCard favorite button
- Same TMDBMovie → DisplayMovie transformation

### 3.4 Movie Card Display (Shared Component)

**Used In:**
- Home Page (MovieGrid)
- Favorites Page (FavoritesGrid)

**Variants:**
1. **Home Page MovieCard** (`variant='default'`)
   - Shows TMDBMovie
   - Has favorite button (heart)
   - Has share button
   - No selection mode
   - Click → Opens MovieDetailsPopup

2. **Favorites Page MovieCard** (`variant='favorites'`)
   - Shows DisplayMovie
   - Has selection checkbox
   - Has remove button (trash)
   - Has share button
   - Selection mode enabled
   - Click → Opens popup (currently not working)

**Common Logic:**
- Image loading and fallback
- Star rating display
- Year extraction
- Favorite state checking
- Share functionality

---

## 4. REDUNDANCY ANALYSIS

### 4.1 Critical Redundancies (High Priority)

#### **1. TMDBMovie → DisplayMovie Transformation**

**Location 1:** `useHomeLogic.ts` (lines 40-67)
```typescript
const displayMovie: DisplayMovie = {
  imdbID: movieId,
  Title: movie.title || '',
  Year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
  // ... 20+ field mappings
}
addToFavorites(displayMovie)
```

**Location 2:** `MovieDetailsPopup.tsx` (lines 115-142)
```typescript
const displayMovie: DisplayMovie = {
  imdbID: movie.id.toString(),
  Title: movie.title || movie.original_title || 'Unknown',
  Year: movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A',
  // ... 20+ field mappings (DUPLICATE)
}
addToFavorites(displayMovie)
```

**Impact:** 
- Code duplication: ~50 lines
- Maintenance burden: Changes need to be made in 2 places
- Inconsistency risk: Fields might differ between locations

**Recommendation:**
```typescript
// Create: src/shared/utils/movieTransformers.ts
export const transformTMDBToDisplay = (movie: TMDBMovie): DisplayMovie => {
  return {
    imdbID: movie.id.toString(),
    Title: movie.title || movie.original_title || '',
    Year: movie.release_date 
      ? new Date(movie.release_date).getFullYear().toString() 
      : 'N/A',
    // ... centralized mapping
  }
}

// Usage in both files:
const displayMovie = transformTMDBToDisplay(movie)
addToFavorites(displayMovie)
```

---

#### **2. Favorite Toggle Logic Duplication**

**Location 1:** `useHomeLogic.ts` `toggleFavorite()` (lines 32-72)
- Checks if favorite
- Adds or removes
- Shows toast notification
- Callback notification

**Location 2:** `MovieDetailsPopup.tsx` `handleFavoriteToggle()` (lines 104-150)
- Checks if favorite
- Adds or removes
- Shows toast notification (via useFavorites)
- Optional callback

**Impact:**
- Logic duplication: ~40 lines
- Inconsistent behavior potential
- Both do transformation independently

**Recommendation:**
```typescript
// Create: src/shared/hooks/useFavoriteToggle.ts
export const useFavoriteToggle = () => {
  const { favorites, addToFavorites, removeFromFavorites } = useFavorites()
  
  const toggleFavorite = useCallback((movie: TMDBMovie, callbacks?: {
    onAdd?: (title: string) => void
    onRemove?: (title: string) => void
  }) => {
    const movieId = movie.id.toString()
    const isFav = favorites.some(fav => fav.imdbID === movieId)
    
    if (isFav) {
      removeFromFavorites(movieId)
      callbacks?.onRemove?.(movie.title || 'Movie')
    } else {
      const displayMovie = transformTMDBToDisplay(movie)
      addToFavorites(displayMovie)
      callbacks?.onAdd?.(movie.title || 'Movie')
    }
  }, [favorites, addToFavorites, removeFromFavorites])
  
  return { toggleFavorite }
}

// Usage in both places:
const { toggleFavorite } = useFavoriteToggle()
toggleFavorite(movie, { onAdd: showFavoriteAdded, onRemove: showFavoriteRemoved })
```

---

#### **3. Similar Movies Fetching (Isolated Logic)**

**Location:** `MovieDetailsPopup.tsx` only

**Issue:**
- API call logic embedded in component
- No reusability for other features
- No caching mechanism
- Fetches every time popup opens

**Recommendation:**
```typescript
// Create: src/shared/hooks/useSimilarMovies.ts
export const useSimilarMovies = (movieId: number | null) => {
  const [similarMovies, setSimilarMovies] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!movieId) return
    
    const fetchSimilar = async () => {
      setLoading(true)
      try {
        const response = await getSimilarMovies(movieId)
        setSimilarMovies(response.results.slice(0, 6))
      } catch (err) {
        setError('Failed to fetch similar movies')
      } finally {
        setLoading(false)
      }
    }
    
    fetchSimilar()
  }, [movieId])
  
  return { similarMovies, loading, error }
}

// Usage:
const { similarMovies, loading } = useSimilarMovies(movie?.id)
```

---

### 4.2 Medium Priority Redundancies

#### **4. Toast Notification Patterns**

**Found in 6+ files:**
- `useFavorites.ts` (4 places)
- `useFavoritesLogic.ts` (3 callbacks)
- `useHomeLogic.ts` (2 callbacks)
- `utils/toast.ts` (3 functions)

**Duplication:**
```typescript
// Pattern 1: In useFavorites
toast.success(`"${movie.Title}" added to favorites!`, {
  icon: '❤️',
  style: {
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    border: '1px solid var(--accent)',
  },
  duration: 3000,
})

// Pattern 2: In utils
export const showFavoriteAdded = (title: string) => {
  toast.success(`"${title}" added to favorites!`, {
    icon: '❤️',
    duration: 3000,
  })
}
```

**Recommendation:**
```typescript
// Centralize in: src/shared/utils/toastNotifications.ts
export const showFavoriteToast = {
  added: (title: string) => toast.success(`"${title}" added to favorites!`, TOAST_STYLES.success),
  removed: (title: string) => toast.success(`"${title}" removed!`, TOAST_STYLES.info),
  bulkRemoved: (count: number) => toast.success(`${count} movies removed!`, TOAST_STYLES.info),
  clearAll: () => toast.success('All favorites cleared!', TOAST_STYLES.warning),
  alreadyExists: (title: string) => toast.error(`"${title}" is already in favorites!`, TOAST_STYLES.error),
}

const TOAST_STYLES = {
  success: {
    icon: '❤️',
    style: { background: 'var(--surface)', color: 'var(--text-primary)' },
    duration: 3000,
  },
  // ... other styles
}
```

---

#### **5. Empty State Components**

**Location 1:** `FavoritesEmpty.tsx`
- Has custom styling
- Has "Browse Movies" button
- Specific to favorites

**Location 2:** `EmptyState.tsx` (in core/ui)
- Generic empty state
- Accepts message and action
- Used in MoviesSection

**Redundancy:**
- Two separate empty state components
- Could be unified with variants

**Recommendation:**
```typescript
// Enhance EmptyState.tsx with variants
<EmptyState
  variant="favorites"
  message="No favorites yet"
  actionLabel="Browse Movies"
  onAction={() => router.push('/home')}
/>

<EmptyState
  variant="search"
  message="No results found"
  actionLabel="Clear Filters"
  onAction={onClearFilters}
/>
```

---

#### **6. Movie Grid Loading States**

**Location 1:** `MovieGrid.tsx`
- Shows LoadingSpinner when loading
- Shows empty state when no movies
- Shows "Load More" button

**Location 2:** `FavoritesGrid.tsx`
- Shows LoadingSpinner when loading
- Shows different layout for favorites
- No "Load More" (all loaded at once)

**Common Logic:**
- Both show loading spinner
- Both handle empty arrays
- Both map over movies array

**Could be unified but reasonable to keep separate due to different data types (TMDBMovie vs DisplayMovie)**

---

### 4.3 Minor Redundancies (Low Priority)

#### **7. localStorage Access Pattern**

**Found in:**
- `useLocalStorage.ts` (generic hook)
- `useFavorites.ts` (uses useLocalStorage)

**Pattern:**
```typescript
// Both do:
const [value, setValue] = useLocalStorage<T>('key', defaultValue)
```

**Good Abstraction:** Already well-abstracted with `useLocalStorage` hook.

**No Action Needed.**

---

#### **8. Movie ID String Conversion**

**Found in 20+ places:**
```typescript
movie.id.toString()  // TMDB movies
fav.imdbID          // Display movies
```

**Minor inconsistency:** 
- TMDBMovie uses `number id`
- DisplayMovie uses `string imdbID`

**Recommendation:** Add type guard utility:
```typescript
export const getMovieId = (movie: TMDBMovie | DisplayMovie): string => {
  return 'id' in movie ? movie.id.toString() : movie.imdbID
}
```

---

#### **9. Year Extraction Pattern**

**Found in 5+ places:**
```typescript
// Pattern 1
movie.release_date ? new Date(movie.release_date).getFullYear().toString() : 'N/A'

// Pattern 2
movie.Year // Already extracted (DisplayMovie)
```

**Recommendation:**
```typescript
// In movieUtils.ts
export const extractYear = (movie: TMDBMovie | DisplayMovie): string => {
  if ('Year' in movie) return movie.Year
  if ('release_date' in movie && movie.release_date) {
    return new Date(movie.release_date).getFullYear().toString()
  }
  return 'N/A'
}
```

---

## 5. OPTIMIZATION RECOMMENDATIONS

### 5.1 Immediate Actions (High ROI)

#### **Priority 1: Extract Transformation Logic**
**Files to Create:**
```
src/shared/utils/movieTransformers.ts
  ├── transformTMDBToDisplay(movie: TMDBMovie): DisplayMovie
  ├── extractMovieId(movie: TMDBMovie | DisplayMovie): string
  └── extractYear(movie: TMDBMovie | DisplayMovie): string
```

**Files to Modify:**
- `useHomeLogic.ts` (remove 28 lines, add 1 import)
- `MovieDetailsPopup.tsx` (remove 28 lines, add 1 import)

**Estimated Time:** 30 minutes  
**Impact:** Reduces 56 lines of duplicate code

---

#### **Priority 2: Create Unified Favorite Toggle Hook**
**Files to Create:**
```
src/shared/hooks/useFavoriteToggle.ts
  └── toggleFavorite(movie: TMDBMovie, callbacks?: {...})
```

**Files to Modify:**
- `useHomeLogic.ts` (remove 40 lines, add 1 import + 1 call)
- `MovieDetailsPopup.tsx` (remove 46 lines, add 1 import + 1 call)

**Estimated Time:** 45 minutes  
**Impact:** Reduces 86 lines of duplicate code, ensures consistency

---

#### **Priority 3: Extract Similar Movies Hook**
**Files to Create:**
```
src/shared/hooks/useSimilarMovies.ts
  └── useSimilarMovies(movieId: number | null)
```

**Files to Modify:**
- `MovieDetailsPopup.tsx` (remove 40 lines, add 1 import + 1 call)

**Estimated Time:** 30 minutes  
**Impact:** Reusable for future features (e.g., recommendations page)

---

#### **Priority 4: Centralize Toast Notifications**
**Files to Create:**
```
src/shared/utils/toastNotifications.ts
  ├── showFavoriteToast.added()
  ├── showFavoriteToast.removed()
  ├── showFavoriteToast.bulkRemoved()
  └── showFavoriteToast.clearAll()
```

**Files to Modify:**
- `useFavorites.ts` (simplify 4 toast calls)
- `useFavoritesLogic.ts` (simplify 3 callbacks)
- `utils/toast.ts` (consolidate into new file)

**Estimated Time:** 20 minutes  
**Impact:** Single source of truth for notifications

---

### 5.2 Architectural Improvements

#### **Separation of Concerns:**

**Current Structure:**
```
Page Component
    ↓
Business Logic Hook (useHomeLogic / useFavoritesLogic)
    ↓
Data Hooks (useFavorites, useMovieSearch)
    ↓
Services (TMDB API calls)
```

**Recommendation:** Already well-structured ✅

---

#### **Missing Abstractions:**

1. **Movie Actions Hub**
```typescript
// src/shared/hooks/useMovieActions.ts
export const useMovieActions = () => {
  const { toggleFavorite } = useFavoriteToggle()
  const { shareMovie } = useShareMovie()
  const { rateMovie } = useMovieRating() // Future feature
  
  return {
    toggleFavorite,
    shareMovie,
    rateMovie,
  }
}
```

2. **Movie Details Aggregator**
```typescript
// src/shared/hooks/useMovieDetails.ts
export const useMovieDetails = (movieId: number) => {
  const basicDetails = useMovieData(movieId)
  const similarMovies = useSimilarMovies(movieId)
  const credits = useMovieCredits(movieId) // Future
  const reviews = useMovieReviews(movieId) // Future
  
  return {
    ...basicDetails,
    similarMovies,
    credits,
    reviews,
  }
}
```

---

### 5.3 Performance Optimizations

#### **Current Issues:**

1. **No Memoization in MovieCard**
   - MovieCard re-renders on every parent update
   - Solution: Wrap with `React.memo`

2. **Expensive Filter Operations**
   - `filterMovies()` runs on every render
   - Solution: Use `useMemo` for filtered results

3. **Duplicate Similar Movies Fetches**
   - Fetches every time popup opens for same movie
   - Solution: Add caching layer

#### **Recommendations:**

```typescript
// 1. Memoize MovieCard
export const MovieCard = React.memo(({ movie, onClick, ...props }) => {
  // component logic
}, (prevProps, nextProps) => {
  return prevProps.movie.id === nextProps.movie.id &&
         prevProps.isSelected === nextProps.isSelected
})

// 2. Memoize filtered movies
const filteredMovies = useMemo(() => {
  return filterMovies(movies, filters)
}, [movies, filters])

// 3. Cache similar movies
const similarMoviesCache = useRef<Map<number, TMDBMovie[]>>(new Map())
```

---

## 6. SUMMARY & ACTION PLAN

### 6.1 Redundancy Summary

| Type | Count | Lines Duplicated | Priority |
|------|-------|------------------|----------|
| Transformation Logic | 2 | 56 lines | 🔴 HIGH |
| Favorite Toggle | 2 | 86 lines | 🔴 HIGH |
| Toast Notifications | 6+ | ~40 lines | 🟡 MEDIUM |
| Similar Movies Fetch | 1 | 40 lines (isolated) | 🟡 MEDIUM |
| Empty States | 2 | 30 lines | 🟢 LOW |
| Year Extraction | 5+ | 10 lines | 🟢 LOW |

**Total Duplicate Code:** ~262 lines  
**Potential Reduction:** ~200 lines (76% savings)

---

### 6.2 Sprint 1 Action Plan (Quick Wins)

**Duration:** 2.5 hours  
**Impact:** High

- [ ] **Task 1:** Create `movieTransformers.ts` utility (30 min)
- [ ] **Task 2:** Create `useFavoriteToggle` hook (45 min)
- [ ] **Task 3:** Create `useSimilarMovies` hook (30 min)
- [ ] **Task 4:** Centralize toast notifications (20 min)
- [ ] **Task 5:** Update all imports and remove duplicates (25 min)

**Expected Results:**
- ✅ ~200 lines removed
- ✅ Single source of truth for core logic
- ✅ Easier to maintain and test
- ✅ Consistent behavior across features

---

### 6.3 Sprint 2 Action Plan (Performance)

**Duration:** 2 hours  
**Impact:** Medium-High

- [ ] **Task 1:** Add React.memo to MovieCard (15 min)
- [ ] **Task 2:** Add useMemo to filtered results (20 min)
- [ ] **Task 3:** Implement similar movies caching (30 min)
- [ ] **Task 4:** Add loading skeletons (45 min)
- [ ] **Task 5:** Optimize image loading (10 min)

**Expected Results:**
- ✅ 30-50% reduction in re-renders
- ✅ Faster perceived performance
- ✅ Better UX with loading states

---

### 6.4 Known Issues to Address

1. **Favorites Page has no search** (Navbar has `showSearch={false}`)
   - User can't filter favorites by title
   - Search functionality exists in `useFavoriteSearch` but not exposed

2. **MovieDetailsPopup not used on Favorites Page**
   - Users can't see similar movies from favorites
   - Movie click does nothing (popup not implemented)

3. **No pagination on Favorites Page**
   - All favorites load at once
   - Could be slow with 100+ favorites

4. **Duplicate Navbar on Favorites Page**
   - Line 53: `<Navbar showSearch={false} />`
   - Page already has Navbar from layout?
   - Verify if this is intentional

---

## 7. CONCLUSION

### Key Findings:

✅ **Well-Structured:**
- Clean separation of concerns (Hooks → Services → Components)
- Good use of custom hooks for logic reuse
- Consistent naming conventions

❌ **Redundancies Found:**
- TMDBMovie transformation duplicated (2 places, 56 lines)
- Favorite toggle logic duplicated (2 places, 86 lines)
- Toast notifications scattered (6+ places, 40 lines)
- Similar movies fetch isolated (could be reused)

🔄 **Opportunities:**
- Extract 200+ lines of duplicate code
- Create 3-4 reusable utilities
- Improve performance with memoization
- Add missing features (favorites search, details popup)

### Overall Assessment:
**Grade: B+ (Good, with room for optimization)**

The codebase is well-organized and functional, but contains duplicate logic that should be extracted for maintainability. The recommended refactoring would take ~4.5 hours total and significantly improve code quality.

---

*End of Analysis*

# WATCHLY - Comprehensive Project TODO List
*Generated: December 7, 2025*
*Last Component Consolidation: Completed*
*Gradients Removal: Completed*

---

## 🔴 CRITICAL PRIORITY (Security & Stability)

### Security Issues
- [ ] **URGENT: Move API Key to Environment Variable**
  - API key is exposed in `.env.local` and could be committed
  - Action: Add `.env.local` to `.gitignore`
  - Action: Use `NEXT_PUBLIC_TMDB_API_KEY` properly
  - Action: Consider backend proxy for API calls
  - **Impact**: HIGH - API key exposure risk

- [ ] **Add Rate Limiting for TMDB API**
  - Currently no rate limit handling
  - Location: `src/shared/services/tmdb.ts`
  - Action: Implement exponential backoff
  - Action: Add request queue management
  - **Impact**: MEDIUM - Prevents API quota exhaustion

- [ ] **Implement Error Boundaries**
  - No error boundaries in place
  - Create: `src/core/components/ErrorBoundary.tsx`
  - Add to: All page layouts
  - **Impact**: HIGH - Better error handling UX

---

## 🟠 HIGH PRIORITY (Code Quality & Performance)

### Performance Optimizations

- [ ] **Add React.memo to Pure Components**
  - Components to memoize:
    - `MovieCard` (partially done)
    - `FilterNavbar`
    - `GenreFilter`
    - `CategorySwitcher`
    - `MovieGrid` items
    - `FavoritesGrid` items
  - **Estimated Time**: 30 minutes
  - **Impact**: Reduces unnecessary re-renders

- [ ] **Optimize Image Loading**
  - Replace regular `<img>` with Next.js `<Image>`
  - Add blur placeholders
  - Implement lazy loading for off-screen images
  - Locations:
    - `MovieCard.tsx` - Already using Image, add blur
    - `MovieDetailsPopup.tsx` - Add blur placeholder
  - **Estimated Time**: 45 minutes

- [ ] **Add Virtual Scrolling for Large Lists**
  - Install `react-virtual` or `react-window`
  - Implement in `MovieGrid.tsx`
  - Implement in `FavoritesGrid.tsx`
  - **Estimated Time**: 2 hours
  - **Impact**: HUGE performance gain for large lists

- [ ] **Implement Code Splitting**
  - Use dynamic imports for:
    - `MovieDetailsPopup` (lazy load on demand)
    - Game components (lazy load on route)
    - `SharePopup` (lazy load on open)
  - **Estimated Time**: 1 hour
  - **Impact**: Reduces initial bundle size

### Console Cleanup

- [ ] **Remove/Replace Console.log & Console.error**
  - Found 12 instances
  - Replace with proper error logging service
  - Locations:
    - `src/shared/services/tmdb.ts` (1)
    - `src/shared/hooks/useMovieSearch.ts` (4)
    - `src/shared/hooks/useMovieFilters.ts` (1)
    - `src/shared/hooks/useLocalStorage.ts` (2)
    - `src/shared/hooks/useFavorites.ts` (4)
    - `src/core/components/movies/MovieDetailsPopup.tsx` (1)
  - **Estimated Time**: 30 minutes

### TypeScript & Linting

- [ ] **Fix ESLint Warnings (8 total)**
  - `app/favorite-movie/page.tsx`: Remove unused variables (3)
  - `app/layout.tsx`: Remove unused `Analytics` import
  - `core/components/favorites/FavoritesEmpty.tsx`: Remove unused icons (2)
  - `core/components/favorites/FavoritesToolbar.tsx`: Remove unused `Square` import
  - `core/components/home/MoviesSection.tsx`: Remove unused `favorites` variable
  - **Estimated Time**: 15 minutes

- [ ] **Remove Unused Constants from Theme Config**
  - File: `src/shared/constants/index.ts`
  - Remove gradient properties from THEMES object (lines 212, 218, 224)
  - **Estimated Time**: 5 minutes

---

## 🟡 MEDIUM PRIORITY (Features & UX)

### Accessibility Improvements

- [ ] **Add ARIA Labels Throughout**
  - Missing on interactive elements:
    - All buttons need `aria-label`
    - Search inputs need `aria-describedby`
    - Filter dropdowns need `aria-expanded`
    - Modal needs `aria-modal="true"`
  - **Estimated Time**: 1.5 hours
  - **Impact**: Essential for screen readers

- [ ] **Keyboard Navigation**
  - Add keyboard shortcuts:
    - `Escape` to close modals (partially done)
    - `Enter` to submit search
    - Arrow keys for movie grid navigation
    - `/` to focus search
  - **Estimated Time**: 2 hours

- [ ] **Focus Management**
  - Trap focus in modals
  - Restore focus after modal close
  - Add focus indicators (`:focus-visible`)
  - **Estimated Time**: 1 hour

### Missing Features

- [ ] **Add Loading Skeletons**
  - Replace basic loading spinners with skeleton screens
  - Create: `LoadingSkeleton.tsx`
  - Implement in:
    - Movie cards loading
    - Favorites page loading
    - Search results loading
  - **Estimated Time**: 1.5 hours
  - **Impact**: Better perceived performance

- [ ] **Offline Support (PWA)**
  - Add service worker
  - Cache static assets
  - Add offline fallback page
  - Update `next.config.ts` for PWA
  - **Estimated Time**: 3 hours

- [ ] **Add Pagination Controls**
  - Currently only has "Load More" button
  - Add page numbers
  - Add "Go to page" input
  - Location: `MovieGrid.tsx`
  - **Estimated Time**: 1 hour

- [ ] **Search History**
  - Save recent searches to localStorage
  - Display recent searches dropdown
  - Add "Clear history" option
  - Location: `Navbar.tsx` search input
  - **Estimated Time**: 1.5 hours

- [ ] **Movie Sorting Options**
  - Add sort by: Rating, Year, Title, Popularity
  - Add ascending/descending toggle
  - Implement in home and favorites pages
  - **Estimated Time**: 2 hours

### UI/UX Polish

- [ ] **Add Animations**
  - Install `framer-motion`
  - Add page transitions
  - Add card hover animations
  - Add modal entrance/exit animations
  - **Estimated Time**: 2 hours

- [ ] **Improve Empty States**
  - Add illustrations to empty states
  - Better copy for different scenarios
  - Add helpful CTAs
  - **Estimated Time**: 1 hour

- [ ] **Add Toast Notifications for All Actions**
  - Already using react-hot-toast
  - Add for:
    - Search errors
    - API failures
    - Category switches
    - Filter applications
  - **Estimated Time**: 30 minutes

---

## 🟢 LOW PRIORITY (Nice to Have)

### Testing

- [ ] **Set Up Testing Infrastructure**
  - Install: `@testing-library/react`, `@testing-library/jest-dom`, `jest`
  - Create: `jest.config.js`
  - Create: `setupTests.ts`
  - **Estimated Time**: 1 hour

- [ ] **Write Unit Tests**
  - Priority components:
    - `useFavorites` hook (80% logic coverage)
    - `useHomeLogic` hook
    - `movieUtils` helper functions
    - `transformers` utility
  - Target: 60% coverage
  - **Estimated Time**: 4 hours

- [ ] **Write E2E Tests**
  - Install Playwright or Cypress
  - Test critical flows:
    - Search movies
    - Add to favorites
    - Play trivia game
    - Share functionality
  - **Estimated Time**: 6 hours

### Documentation

- [ ] **Update README.md**
  - Current README is default Next.js boilerplate
  - Add:
    - Project description
    - Features list
    - Installation instructions
    - Environment variables guide
    - Development workflow
    - Deployment guide
    - Contributing guidelines
  - **Estimated Time**: 2 hours

- [ ] **Add JSDoc Comments**
  - Priority files:
    - All custom hooks (partially done)
    - Utility functions
    - Complex components
  - **Estimated Time**: 2 hours

- [ ] **Create Component Storybook**
  - Install Storybook
  - Create stories for:
    - `Button`
    - `MovieCard`
    - `LoadingSpinner`
    - `EmptyState`
  - **Estimated Time**: 4 hours

### Code Organization

- [ ] **Extract Magic Numbers to Constants**
  - Timeout values (15s, 500ms, etc.)
  - API endpoints
  - Image dimensions
  - Z-index values
  - **Estimated Time**: 30 minutes

- [ ] **Create Centralized Error Messages**
  - Create: `src/shared/constants/messages.ts`
  - Move all hardcoded strings
  - **Estimated Time**: 45 minutes

- [ ] **Consolidate CSS Files**
  - Currently: `landing.css`, `favorite.css`, `game.css`, `main.css`
  - Consider migrating to Tailwind utilities
  - Or consolidate into `globals.css`
  - **Estimated Time**: 2 hours

### Infrastructure

- [ ] **Set Up CI/CD Pipeline**
  - GitHub Actions workflow
  - Run tests on PR
  - Auto-deploy to Vercel
  - **Estimated Time**: 1 hour

- [ ] **Add Pre-commit Hooks**
  - Install Husky
  - Run ESLint before commit
  - Run Prettier before commit
  - Run type checking
  - **Estimated Time**: 30 minutes

- [ ] **Set Up Error Monitoring**
  - Add Sentry or similar
  - Track JavaScript errors
  - Track API failures
  - **Estimated Time**: 1 hour

- [ ] **Add Analytics**
  - Vercel Analytics already imported but unused
  - Add: `<Analytics />` to root layout
  - Track custom events:
    - Movie clicks
    - Search queries
    - Favorite actions
  - **Estimated Time**: 30 minutes

### Performance Monitoring

- [ ] **Add Performance Monitoring**
  - Use Vercel Speed Insights
  - Track Core Web Vitals
  - Monitor bundle sizes
  - **Estimated Time**: 30 minutes

- [ ] **Optimize Bundle Size**
  - Analyze with `@next/bundle-analyzer`
  - Remove unused dependencies
  - Tree-shake large libraries
  - Current bundle: ~500KB (unoptimized)
  - Target: < 300KB
  - **Estimated Time**: 2 hours

---

## 🔵 FUTURE ENHANCEMENTS

### Advanced Features

- [ ] **User Authentication**
  - Add login/signup
  - Sync favorites across devices
  - Use NextAuth.js
  - **Estimated Time**: 8 hours

- [ ] **Social Features**
  - Share favorite lists
  - Movie recommendations from friends
  - Comments on movies
  - **Estimated Time**: 12 hours

- [ ] **Advanced Search**
  - Search by actor
  - Search by director
  - Search by plot keywords
  - Advanced filters UI
  - **Estimated Time**: 4 hours

- [ ] **Movie Lists/Collections**
  - Create custom lists
  - "Watchlist" feature
  - "Watched" tracking
  - Export lists
  - **Estimated Time**: 6 hours

- [ ] **Movie Trailers**
  - Integrate YouTube API
  - Play trailers in modal
  - **Estimated Time**: 2 hours

- [ ] **Movie Reviews**
  - User reviews and ratings
  - Import TMDB reviews
  - **Estimated Time**: 4 hours

### Game Enhancements

- [ ] **Trivia Leaderboard**
  - Local high scores
  - Global leaderboard (requires backend)
  - **Estimated Time**: 3 hours

- [ ] **More Game Modes**
  - Timed challenges
  - Multiplayer mode
  - Daily challenges
  - **Estimated Time**: 6 hours

- [ ] **Achievement System**
  - Unlock badges
  - Track statistics
  - **Estimated Time**: 4 hours

---

## 📊 SUMMARY

### By Priority:
- **Critical**: 3 items (~5 hours)
- **High**: 12 items (~12 hours)
- **Medium**: 14 items (~20 hours)
- **Low**: 15 items (~30 hours)
- **Future**: 11 items (~50+ hours)

### Quick Wins (< 30 minutes each):
1. Fix ESLint warnings
2. Remove unused gradient constants
3. Remove console.logs
4. Add Analytics component
5. Extract magic numbers
6. Add pre-commit hooks

### High Impact (Priority Order):
1. Security: Move API key & add error boundaries
2. Performance: Add React.memo & virtual scrolling
3. Accessibility: Add ARIA labels
4. UX: Add loading skeletons
5. Testing: Set up basic test infrastructure

### Current Status:
✅ Component consolidation complete
✅ Gradient styles removed
✅ Core features working
✅ Responsive design implemented
✅ Custom hooks architecture solid

### Next Sprint Recommendation:
Focus on **Critical** and **High Priority** items first (estimated 17 hours total).
This will ensure security, improve performance, and clean up code quality issues.

---

*Note: Time estimates are approximate and based on medium developer experience level.*

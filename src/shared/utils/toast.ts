/**
 * Centralized Toast Utilities
 * Single source of truth for all toast notifications
 */

import toast from 'react-hot-toast'

const TOAST_STYLE = {
  background: 'var(--surface)',
  color: 'var(--text-primary)',
}

// ============================================================
// Home Page Toasts
// ============================================================

export const showFavoriteAdded = (movieTitle: string) => {
  toast.success(`${movieTitle} added to favojjnrites!`, {
    style: TOAST_STYLE,
    duration: 2000,
  })
}

export const showFavoriteRemoved = (movieTitle: string) => {
  toast.success(`${movieTitle} removed from favorites!`, {
    style: TOAST_STYLE,
    duration: 2000,
  })
}

// ============================================================
// Favorites Page Toasts
// ============================================================

export const showRemoveToast = (movieTitle: string) => {
  toast.success(`"${movieTitle}" removed from favorites`, {
    style: TOAST_STYLE,
    duration: 3000,
    icon: '🗑️'
  })
}

export const showBulkRemoveToast = (count: number) => {
  toast.success(`${count} movies removed from favorites`, {
    style: TOAST_STYLE,
    duration: 3000,
    icon: '🗑️'
  })
}

export const showClearAllToast = (count: number) => {
  toast.success(`All ${count} favorites removed`, {
    style: TOAST_STYLE,
    duration: 4000,
    icon: '🗑️'
  })
}

// ============================================================
// Game Page Toasts
// ============================================================

export function showGameStarted() {
  toast.success('Game started! Good luck!', {
    style: TOAST_STYLE,
    duration: 2000,
  })
}

export function showGameEnded() {
  toast.success('Game finished! Check your results!', {
    style: TOAST_STYLE,
    duration: 2000,
  })
}

// ============================================================
// General Toasts
// ============================================================

export const showError = (message: string) => {
  toast.error(message, {
    style: TOAST_STYLE,
    duration: 3000,
  })
}

export const showInfo = (message: string) => {
  toast(message, {
    style: TOAST_STYLE,
    icon: 'ℹ️',
    duration: 2000,
  })
}

export const showLoading = (message: string) => {
  return toast.loading(message, {
    style: TOAST_STYLE,
  })
}

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId)
}

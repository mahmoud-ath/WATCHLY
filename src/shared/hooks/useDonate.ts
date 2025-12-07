/**
 * useDonate Hook
 * Manages donation functionality
 */

import { EXTERNAL_LINKS } from '../constants'

export const useDonate = () => {
  const handleDonate = () => {
    window.open(EXTERNAL_LINKS.DONATE, '_blank')
  }

  return { handleDonate }
}

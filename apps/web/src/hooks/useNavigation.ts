import { useRouter } from 'next/navigation'

/**
 * Custom hook for navigation that properly handles browser back/forward buttons
 * Use this instead of router.push() for programmatic navigation
 */
export function useNavigation() {
  const router = useRouter()

  /**
   * Navigate to a new page with proper browser history handling
   * @param href - The URL to navigate to
   * @param options - Navigation options
   */
  const navigate = (href: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      // Use router.replace for redirects (no back button)
      router.replace(href)
    } else {
      // Use window.location for proper browser history
      window.location.href = href
    }
  }

  /**
   * Navigate back in browser history
   */
  const goBack = () => {
    window.history.back()
  }

  /**
   * Navigate forward in browser history
   */
  const goForward = () => {
    window.history.forward()
  }

  return {
    navigate,
    goBack,
    goForward,
    router // Still expose router for other uses
  }
} 
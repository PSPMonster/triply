import { createContext, useContext, useState, useCallback } from 'react';

/**
 * Global Loader Context
 * 
 * Provides centralized control over the global loading state
 * Can be triggered from anywhere in the app
 */
const LoaderContext = createContext(null);

/**
 * LoaderProvider - Wrap your app with this provider
 * 
 * Usage in main.jsx:
 * ```javascript
 * <LoaderProvider>
 *   <App />
 * </LoaderProvider>
 * ```
 */
export const LoaderProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');
  const [variant, setVariant] = useState('default');

  /**
   * Show the global loader
   * @param {string} msg - Loading message to display
   * @param {string} variantType - "default" | "planning" | "searching" | "generating"
   */
  const showLoader = useCallback((msg = 'Loading...', variantType = 'default') => {
    setMessage(msg);
    setVariant(variantType);
    setIsLoading(true);
  }, []);

  /**
   * Hide the global loader
   */
  const hideLoader = useCallback(() => {
    setIsLoading(false);
  }, []);

  /**
   * Update only the message while loading
   * @param {string} msg - New message to display
   */
  const updateMessage = useCallback((msg) => {
    setMessage(msg);
  }, []);

  const value = {
    isLoading,
    message,
    variant,
    showLoader,
    hideLoader,
    updateMessage,
  };

  return (
    <LoaderContext.Provider value={value}>
      {children}
    </LoaderContext.Provider>
  );
};

/**
 * Hook to access loader functions
 * 
 * Usage:
 * ```javascript
 * import { useLoader } from '@/hooks/useLoaderStore';
 * 
 * function MyComponent() {
 *   const { showLoader, hideLoader } = useLoader();
 *   
 *   const handleSubmit = async () => {
 *     showLoader('Searching destinations...', 'searching');
 *     await fetchData();
 *     hideLoader();
 *   };
 * }
 * ```
 */
export const useLoader = () => {
  const context = useContext(LoaderContext);
  
  if (!context) {
    throw new Error('useLoader must be used within LoaderProvider');
  }

  /**
   * Wrap an async function with loader
   * @param {Function} asyncFn - Async function to execute
   * @param {string} msg - Loading message
   * @param {string} variantType - Loader variant
   * @returns {Promise} Result of the async function
   */
  const withLoader = useCallback(async (asyncFn, msg, variantType) => {
    try {
      context.showLoader(msg, variantType);
      const result = await asyncFn();
      return result;
    } finally {
      context.hideLoader();
    }
  }, [context]);

  return {
    ...context,
    withLoader,
  };
};

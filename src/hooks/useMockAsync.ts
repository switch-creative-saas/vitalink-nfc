import { useState, useCallback } from 'react';

export function useMockAsync() {
  const [isLoading, setIsLoading] = useState(false);

  const runMock = useCallback(async (minDelay = 300, maxDelay = 600) => {
    setIsLoading(true);
    const delay = Math.random() * (maxDelay - minDelay) + minDelay;
    await new Promise((resolve) => setTimeout(resolve, delay));
    setIsLoading(false);
  }, []);

  return { isLoading, runMock };
}

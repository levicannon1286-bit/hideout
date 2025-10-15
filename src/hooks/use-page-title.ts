import { useEffect } from 'react';

export const usePageTitle = (title: string) => {
  useEffect(() => {
    const baseTitle = 'Hideout';
    const fullTitle = title ? `${baseTitle} - ${title}` : baseTitle;
    
    document.title = fullTitle;
    
    return () => {
      document.title = baseTitle;
    };
  }, [title]);
};

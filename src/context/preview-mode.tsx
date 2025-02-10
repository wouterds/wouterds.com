import { TriangleAlertIcon } from 'lucide-react';
import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';

interface PreviewModeContextType {
  isPreviewMode: boolean;
  setPreviewMode: (enabled: boolean) => void;
}

const PreviewModeContext = createContext<PreviewModeContextType | undefined>(undefined);

interface PreviewModeProviderProps {
  children: ReactNode;
  isPreviewMode?: boolean;
}

export const PreviewModeProvider = ({
  children,
  isPreviewMode: initialPreviewMode = false,
}: PreviewModeProviderProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPreviewMode, setIsPreviewMode] = useState(initialPreviewMode);

  useEffect(() => {
    // Check for preview param
    const previewParam = searchParams.get('preview');
    if (previewParam !== null) {
      const enabled = previewParam === 'true';
      setIsPreviewMode(enabled);

      // Store in session cookie
      if (enabled) {
        document.cookie = 'preview-mode=true;path=/';
      } else {
        document.cookie = 'preview-mode=false;path=/';
      }

      // Clean up URL by removing the preview parameter
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('preview');
      setSearchParams(newParams, { replace: true });
    } else {
      // Check for existing cookie
      const hasPreviewCookie = document.cookie
        .split(';')
        .some((item) => item.trim().startsWith('preview-mode=true'));
      setIsPreviewMode(hasPreviewCookie);
    }
  }, [searchParams, setSearchParams]);

  const setPreviewMode = (enabled: boolean) => {
    setIsPreviewMode(enabled);
    if (enabled) {
      document.cookie = 'preview-mode=true;path=/';
    } else {
      document.cookie = 'preview-mode=false;path=/';
    }
  };

  return (
    <PreviewModeContext.Provider value={{ isPreviewMode, setPreviewMode }}>
      {isPreviewMode && (
        <p className="flex items-center gap-2.5 text-sm text-white py-2 px-6 sm:px-8 bg-rose-500 transition w-full">
          <TriangleAlertIcon className="size-5" />
          <span>preview mode</span>
        </p>
      )}
      {children}
    </PreviewModeContext.Provider>
  );
};

export const usePreviewMode = () => {
  return useContext(PreviewModeContext);
};

import { createContext, useContext } from 'react';

// Optional host-provided handler for the built-in "Back to Dashboard" link in
// GradebookHeader. When set, it wins over URL navigation, letting slot hosts
// return to their own local view (e.g. the CCX Coach Student Grades tab).
export const GradebookNavigationContext = createContext<{ onBack?: () => void }>({
  onBack: undefined,
});

export const useGradebookNavigation = () => useContext(GradebookNavigationContext);

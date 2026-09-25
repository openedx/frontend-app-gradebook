import { createContext, useContext } from 'react';

// Widget contract: hosts (route or dashboard slot) supply courseId here so the
// data hooks don't depend on the enclosing router's `:courseId` param.
export const CourseIdContext = createContext<string>('');
export const useCourseId = (): string => useContext(CourseIdContext);

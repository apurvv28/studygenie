import { format } from 'date-fns';

export const isValidEntryTime = (): boolean => {
  const now = new Date();
  const hours = now.getHours();
  return hours >= 21 || hours < 0; // Between 9 PM and 12 AM
};

export const formatDate = (date: Date): string => {
  return format(date, 'MMMM dd, yyyy');
};

export const getStorageKey = (): string => {
  return `gratitude-${format(new Date(), 'yyyy-MM-dd')}`;
};
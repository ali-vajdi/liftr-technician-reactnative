/**
 * Utility functions for number formatting in Persian/Farsi
 */

/**
 * Converts English/Arabic numerals (0-9) to Persian numerals (۰-۹)
 * @param value - The number or string to convert
 * @returns String with Persian numerals
 */
export const toPersianDigits = (value: string | number): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  let result = '';
  
  for (let i = 0; i < stringValue.length; i++) {
    const char = stringValue[i];
    const digitIndex = englishDigits.indexOf(char);
    
    if (digitIndex !== -1) {
      result += persianDigits[digitIndex];
    } else {
      result += char;
    }
  }
  
  return result;
};

/**
 * Formats a number with Persian numerals and optional thousand separators
 * @param value - The number to format
 * @param options - Formatting options
 * @returns Formatted string with Persian numerals
 */
export const formatPersianNumber = (
  value: number | string,
  options?: {
    useSeparator?: boolean;
    decimals?: number;
  }
): string => {
  const { useSeparator = false, decimals } = options || {};
  
  if (value === null || value === undefined) {
    return '';
  }
  
  let numValue: number;
  if (typeof value === 'string') {
    numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return toPersianDigits(value);
    }
  } else {
    numValue = value;
  }
  
  let formatted: string;
  
  if (decimals !== undefined) {
    formatted = numValue.toFixed(decimals);
  } else {
    formatted = String(numValue);
  }
  
  // Add thousand separators if requested
  if (useSeparator) {
    const parts = formatted.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '،');
    formatted = parts.join('.');
  }
  
  return toPersianDigits(formatted);
};

/**
 * Formats a phone number with Persian numerals
 * @param phoneNumber - The phone number to format
 * @returns Formatted phone number with Persian numerals
 */
export const formatPersianPhoneNumber = (phoneNumber: string): string => {
  return toPersianDigits(phoneNumber);
};

/**
 * Converts Persian/Arabic numerals to English numerals
 * @param value - The string with Persian/Arabic numerals
 * @returns String with English numerals
 */
export const toEnglishDigits = (value: string): string => {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  let result = '';
  
  for (let i = 0; i < stringValue.length; i++) {
    const char = stringValue[i];
    const persianIndex = persianDigits.indexOf(char);
    const arabicIndex = arabicDigits.indexOf(char);
    
    if (persianIndex !== -1) {
      result += englishDigits[persianIndex];
    } else if (arabicIndex !== -1) {
      result += englishDigits[arabicIndex];
    } else {
      result += char;
    }
  }
  
  return result;
};


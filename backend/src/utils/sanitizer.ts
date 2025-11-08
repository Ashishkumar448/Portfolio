import DOMPurify from 'isomorphic-dompurify';
import validator from 'validator';

export const sanitizeInput = {
  string: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return DOMPurify.sanitize(validator.escape(value.trim()));
  },

  html: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return DOMPurify.sanitize(value.trim(), {
      ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img', 'blockquote', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class']
    });
  },

  email: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return validator.normalizeEmail(value.trim()) || '';
  },

  url: (value: string): string => {
    if (!value || typeof value !== 'string') return '';
    return validator.isURL(value.trim()) ? value.trim() : '';
  },

  array: (value: any[]): string[] => {
    if (!Array.isArray(value)) return [];
    return value.map(item => sanitizeInput.string(item)).filter(Boolean);
  },

  boolean: (value: any): boolean => {
    return Boolean(value);
  },

  number: (value: any): number => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  }
};
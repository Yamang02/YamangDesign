/**
 * E05: Text Styles 정의
 */
import type { TextStyle, TextStyleName } from './types';

export const textStyles: Record<TextStyleName, TextStyle> = {
  'display-lg': {
    fontSize: '4xl',
    lineHeight: 'tight',
    fontWeight: 'bold',
    letterSpacing: 'tight',
  },
  'display-md': {
    fontSize: '3xl',
    lineHeight: 'tight',
    fontWeight: 'bold',
    letterSpacing: 'tight',
  },
  'heading-1': {
    fontSize: '2xl',
    lineHeight: 'snug',
    fontWeight: 'semibold',
  },
  'heading-2': {
    fontSize: 'xl',
    lineHeight: 'snug',
    fontWeight: 'semibold',
  },
  'heading-3': {
    fontSize: 'lg',
    lineHeight: 'snug',
    fontWeight: 'medium',
  },
  'body-lg': {
    fontSize: 'lg',
    lineHeight: 'relaxed',
    fontWeight: 'normal',
  },
  'body-md': {
    fontSize: 'md',
    lineHeight: 'normal',
    fontWeight: 'normal',
  },
  'body-sm': {
    fontSize: 'sm',
    lineHeight: 'normal',
    fontWeight: 'normal',
  },
  caption: {
    fontSize: 'xs',
    lineHeight: 'normal',
    fontWeight: 'normal',
  },
  label: {
    fontSize: 'sm',
    lineHeight: 'none',
    fontWeight: 'medium',
  },
  code: {
    fontSize: 'sm',
    lineHeight: 'normal',
    fontWeight: 'normal',
    fontFamily: 'mono',
  },
};

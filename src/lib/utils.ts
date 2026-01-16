import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMac() {
  return navigator.platform.includes('Mac')
}

export function getShortcutKey(key: string) {
  if (`${key}`.toLowerCase() === 'mod') {
    return isMac() ? '⌘' : 'Ctrl'
  }
  else if (`${key}`.toLowerCase() === 'alt') {
    return isMac() ? '⌥' : 'Alt'
  }
  else if (`${key}`.toLowerCase() === 'shift') {
    return isMac() ? '⇧' : 'Shift'
  }
  else {
    return key
  }
}

export function getShortcutKeys(keys: string[]) {
  return keys.map(getShortcutKey).join(' ')
}

// Simple theme toggle functionality that works with CSS variables
export function initializeTheme() {
  if (typeof window === 'undefined') return;
  
  // Check for saved theme preference or default to 'light' mode
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  // Apply the theme
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
  
  return theme;
}

export function toggleTheme() {
  if (typeof window === 'undefined') return;
  
  const isDark = document.documentElement.classList.contains('dark');
  const newTheme = isDark ? 'light' : 'dark';
  
  document.documentElement.classList.toggle('dark', newTheme === 'dark');
  localStorage.setItem('theme', newTheme);
  
  return newTheme;
}

export function getCurrentTheme() {
  if (typeof window === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

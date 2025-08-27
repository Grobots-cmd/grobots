// Simple theme manager for handling light/dark theme switching

class ThemeManager {
  constructor() {
    this.currentTheme = 'dark'; // Default to dark theme
    this.initializeTheme();
  }

  initializeTheme() {
    if (typeof window !== 'undefined') {
      // Check localStorage for saved theme
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        this.currentTheme = savedTheme;
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.currentTheme = prefersDark ? 'dark' : 'light';
      }
      this.applyTheme();
    }
  }

  getCurrentTheme() {
    return this.currentTheme;
  }

  toggleTheme() {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.saveTheme();
    return this.currentTheme;
  }

  setTheme(theme) {
    if (theme === 'light' || theme === 'dark') {
      this.currentTheme = theme;
      this.applyTheme();
      this.saveTheme();
    }
  }

  applyTheme() {
    if (typeof window !== 'undefined') {
      const html = document.documentElement;
      if (this.currentTheme === 'dark') {
        html.classList.add('dark');
      } else {
        html.classList.remove('dark');
      }
    }
  }

  saveTheme() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', this.currentTheme);
    }
  }
}

// Create a singleton instance
const themeManager = new ThemeManager();

export default themeManager;

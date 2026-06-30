/* theme.js */
(function () {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set theme based on saved preference or system default
    const initialTheme = savedTheme ? savedTheme : (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // SVG Icons
    const sunIcon = `<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>`;
    const moonIcon = `<path d="M9.37 5.51c-.18.64-.27 1.31-.27 2 0 4.41 3.59 8 8 8 .69 0 1.36-.09 2-.27 1.53-3.75-.15-7.99-3.73-9.58-1.53-.68-3.32-.82-4.9-.37-1.58.45-2.88 1.58-3.56 3.16.27-.33.56-.63.86-.94z"/>`;

    // Apply proper icon on load
    function updateIcon(theme) {
        if (themeIcon) {
            themeIcon.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
        }
    }

    const currentTheme = document.documentElement.getAttribute('data-theme');
    updateIcon(currentTheme);

    // Toggle theme on button click
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon(newTheme);
        });
    }
});

/* ========================================
   Translation System for HARA BEAUTY
   ======================================== */

(function() {
    'use strict';
    
    // Get current language from localStorage or default to Korean
    let currentLang = localStorage.getItem('selectedLanguage') || 'ko';
    
    // Flag mapping
    const flagMap = {
        'ko': '🇰🇷',
        'en': '🇺🇸',
        'zh': '🇨🇳',
        'ja': '🇯🇵'
    };
    
    // Language names mapping
    const langNames = {
        'ko': '한국어',
        'en': 'English',
        'zh': '中文',
        'ja': '日本語'
    };
    
    // Initialize translation system
    function initTranslation() {
        // Set initial language
        setLanguage(currentLang);
        
        // Language selector (unified for all devices)
        const currentLangBtn = document.getElementById('currentLangBtn');
        const langDropdown = document.getElementById('langDropdown');
        const langOptions = document.querySelectorAll('.lang-option');
        
        if (currentLangBtn) {
            currentLangBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                langDropdown.classList.toggle('active');
            });
        }
        
        langOptions.forEach(option => {
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                const lang = this.getAttribute('data-lang');
                setLanguage(lang);
                langDropdown.classList.remove('active');
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (currentLangBtn && langDropdown && 
                !currentLangBtn.contains(e.target) && !langDropdown.contains(e.target)) {
                langDropdown.classList.remove('active');
            }
        });
    }
    
    // Set active language
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('selectedLanguage', lang);
        
        // Update all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = translations[lang] && translations[lang][key];
            
            if (translation) {
                // Check if element is input/textarea or has HTML content
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.value = translation;
                } else if (element.innerHTML.includes('<br>') || translation.includes('<br>')) {
                    element.innerHTML = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });
        
        // Update current flag
        const currentFlag = document.getElementById('currentFlag');
        if (currentFlag) {
            currentFlag.textContent = flagMap[lang];
        }
        
        // Update dropdown active state
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            if (option.getAttribute('data-lang') === lang) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.setAttribute('lang', lang);
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTranslation);
    } else {
        initTranslation();
    }
    
    // Expose setLanguage function globally if needed
    window.setLanguage = setLanguage;
    window.getCurrentLanguage = function() {
        return currentLang;
    };
    
})();

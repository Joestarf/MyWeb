// js/theme-manager.js
// 主题管理器 - 统一管理所有页面的视觉效果

class ThemeManager {
    constructor() {
        this.themes = {
            // 角色主题
            'hitori': {
                name: '后藤一里',
                color: '255,182,193',
                opacity: 0.6,
                count: 88,
                cursorColor: '#FFB6C1'
            },
            'nijika': {
                name: '伊地知虹夏', 
                color: '255,250,205',
                opacity: 0.7,
                count: 92,
                cursorColor: '#FFFACD'
            },
            'ryo': {
                name: '山田凉',
                color: '173,216,230',
                opacity: 0.5, 
                count: 85,
                cursorColor: '#ADD8E6'
            },
            'kita': {
                name: '喜多郁代',
                color: '255,107,107',
                opacity: 0.65,
                count: 95,
                cursorColor: '#FF6B6B'
            },
            // 补充主题
            'band': {
                name: '乐队主题',
                color: '147,112,219',
                opacity: 0.55,
                count: 90,
                cursorColor: '#9370DB'
            },
            'music': {
                name: '音乐主题',
                color: '102,205,170',
                opacity: 0.6,
                count: 87,
                cursorColor: '#66CDAA'
            }
        };
        
        this.pageThemes = {
            'index.html': 'hitori',
            'about.html': 'nijika', 
            'characters.html': 'ryo',
            'music.html': 'kita',
            'production.html': 'band',
            'gallery.html': 'music'
        };
    }
    
    // 根据当前页面应用主题
    applyPageTheme() {
        const currentPage = this.getCurrentPage();
        const themeKey = this.pageThemes[currentPage];
        
        if (themeKey && this.themes[themeKey]) {
            this.applyTheme(themeKey);
            console.log(`已应用 ${this.themes[themeKey].name} 主题`);
        } else {
            // 默认主题
            this.applyTheme('hitori');
            console.log('应用默认主题');
        }
    }
    
    // 应用指定主题
    applyTheme(themeKey) {
        const theme = this.themes[themeKey];
        if (!theme) return;
        
        // 应用线条特效
        if (window.lineEffects) {
            window.lineEffects.updateOptions({
                color: theme.color,
                opacity: theme.opacity,
                count: theme.count
            });
        }
        
        // 应用光标特效
        if (window.cursorEffects) {
            window.cursorEffects.updateOptions({
                cursorColor: theme.cursorColor,
                dotColor: theme.cursorColor,
                clickColors: this.generateClickColors(theme.color)
            });
        }
        
        // 保存当前主题
        this.currentTheme = themeKey;
    }
    
    // 生成点击颜色数组
    generateClickColors(rgbColor) {
        const colors = [
            `rgb(${rgbColor})`,
            '#FFB6C1', '#FFFACD', '#ADD8E6', '#FF6B6B',
            '#9370DB', '#66CDAA'
        ];
        return colors;
    }
    
    // 获取当前页面文件名
    getCurrentPage() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }
    
    // 获取所有主题
    getThemes() {
        return this.themes;
    }
    
    // 获取页面主题映射
    getPageThemes() {
        return this.pageThemes;
    }
    
    // 添加新主题
    addTheme(key, themeData) {
        this.themes[key] = themeData;
    }
    
    // 设置页面主题
    setPageTheme(page, themeKey) {
        this.pageThemes[page] = themeKey;
    }
}

// 创建全局实例
window.themeManager = new ThemeManager();

// 自动应用主题
if (document.body.hasAttribute('data-auto-theme')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeManager.applyPageTheme();
    });
}
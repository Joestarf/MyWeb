// js/cursor-effects.js
// 光标特效组件 - 可复用

class CursorEffects {
    constructor(options = {}) {
        this.options = {
            cursorColor: '#fff',
            dotColor: '#fff',
            clickColors: ['#FFB6C1', '#FFFACD', '#ADD8E6', '#FF6B6B', '#9b59b6'],
            enableHoverEffects: true,
            ...options
        };
        
        this.cursor = null;
        this.cursorDot = null;
        this.clickEffects = null;
        this.isInitialized = false;
    }
    
    // 初始化光标特效
    init() {
        if (this.isInitialized) return;
        
        this.createCursorElements();
        this.bindEvents();
        this.isInitialized = true;
        
        console.log('光标特效已启用');
    }
    
    // 创建光标元素
    createCursorElements() {
        // 创建主光标
        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursor.style.borderColor = this.options.cursorColor;
        document.body.appendChild(this.cursor);
        
        // 创建光标点
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';
        this.cursorDot.style.background = this.options.dotColor;
        document.body.appendChild(this.cursorDot);
        
        // 创建点击效果容器
        this.clickEffects = document.createElement('div');
        this.clickEffects.id = 'click-effects';
        document.body.appendChild(this.clickEffects);
        
        // 隐藏默认光标
        document.body.classList.add('cursor-effects-enabled');
    }
    
    // 绑定事件
    bindEvents() {
        // 光标移动跟踪
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // 点击特效
        document.addEventListener('click', (e) => this.handleClick(e));
        
        // 鼠标悬停效果
        if (this.options.enableHoverEffects) {
            this.bindHoverEffects();
        }
    }
    
    // 处理鼠标移动
    handleMouseMove(e) {
        // 主光标延迟跟随
        setTimeout(() => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
        }, 50);
        
        // 光标点实时跟随
        this.cursorDot.style.left = e.clientX + 'px';
        this.cursorDot.style.top = e.clientY + 'px';
    }
    
    // 处理点击事件
    handleClick(e) {
        this.createClickEffect(e.clientX, e.clientY);
    }
    
    // 创建点击效果
    createClickEffect(x, y) {
        const effect = document.createElement('div');
        effect.className = 'click-effect';
        effect.style.left = (x - 10) + 'px';
        effect.style.top = (y - 10) + 'px';
        
        // 随机选择颜色
        const randomColor = this.options.clickColors[
            Math.floor(Math.random() * this.options.clickColors.length)
        ];
        effect.style.borderColor = randomColor;
        
        this.clickEffects.appendChild(effect);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 600);
    }
    
    // 绑定悬停效果
    bindHoverEffects() {
        const interactiveElements = document.querySelectorAll(
            '.card, .character-card, .btn, a, button, [data-cursor-hover]'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => this.handleHoverEnter(element));
            element.addEventListener('mouseleave', () => this.handleHoverLeave());
        });
    }
    
    // 处理悬停进入
    handleHoverEnter(element) {
        this.cursor.style.transform = 'scale(1.5)';
        
        // 获取元素自定义颜色或使用默认
        const customColor = element.getAttribute('data-cursor-color');
        if (customColor) {
            this.cursor.style.borderColor = customColor;
        } else {
            this.cursor.style.borderColor = this.getAutoColor(element);
        }
    }
    
    // 处理悬停离开
    handleHoverLeave() {
        this.cursor.style.transform = 'scale(1)';
        this.cursor.style.borderColor = this.options.cursorColor;
    }
    
    // 自动获取元素颜色
    getAutoColor(element) {
        // 根据元素类名或位置自动分配颜色
        if (element.classList.contains('card')) {
            const cardIndex = Array.from(document.querySelectorAll('.card')).indexOf(element);
            const colors = ['#FFB6C1', '#FFFACD', '#ADD8E6', '#FF6B6B', '#9b59b6'];
            return colors[cardIndex % colors.length];
        }
        return '#FF6B6B'; // 默认悬停颜色
    }
    
    // 销毁光标特效
    destroy() {
        if (this.cursor) this.cursor.remove();
        if (this.cursorDot) this.cursorDot.remove();
        if (this.clickEffects) this.clickEffects.remove();
        
        document.body.classList.remove('cursor-effects-enabled');
        this.isInitialized = false;
        
        console.log('光标特效已禁用');
    }
    
    // 更新配置
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
    }
}

// 创建全局实例
window.cursorEffects = new CursorEffects();

// 自动初始化（如果设置了自动启用）
if (document.body.hasAttribute('data-auto-cursor-effects')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.cursorEffects.init();
    });
}
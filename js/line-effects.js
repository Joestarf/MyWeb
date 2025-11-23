// js/line-effects.js
// 线条跟随特效组件 - 可复用

class LineEffects {
    constructor(options = {}) {
        this.options = {
            color: '100,149,237', // RGB颜色值
            opacity: 0.7,         // 透明度
            count: 99,            // 线条数量
            zIndex: -1,         // 层级
            ...options
        };
        
        this.canvas = null;
        this.script = null;
        this.isInitialized = false;
    }
    
    // 初始化线条特效
    init() {
        if (this.isInitialized) return;
        
        this.loadCanvasNest();
        this.isInitialized = true;
        
        console.log('线条跟随特效已启用');
    }
    
    // 加载Canvas Nest特效
    loadCanvasNest() {
        // 动态创建script标签
        this.script = document.createElement('script');
        this.script.type = 'text/javascript';
        this.script.setAttribute('color', this.options.color);
        this.script.setAttribute('opacity', this.options.opacity.toString());
        this.script.setAttribute('count', this.options.count.toString());
        this.script.setAttribute('zIndex', this.options.zIndex.toString());
        this.script.src = 'https://cdn.jsdelivr.net/npm/canvas-nest.js@1/dist/canvas-nest.js';
        
        // 添加到页面
        document.body.appendChild(this.script);
        
        // 等待脚本加载完成后设置canvas样式
        this.script.onload = () => {
            this.setupCanvasStyle();
        };
        
        // 添加body类名
        document.body.classList.add('line-effects-enabled');
    }
    
    // 设置Canvas样式
    setupCanvasStyle() {
        // 等待Canvas创建
        setTimeout(() => {
            const canvas = document.querySelector('canvas[data-generated-by="canvas-nest"]');
            if (canvas) {
                canvas.classList.add('line-effects-canvas');
                console.log('Canvas Nest特效加载成功');
            } else {
                console.warn('Canvas Nest特效未找到canvas元素');
            }
        }, 1000);
    }
    
    // 更新配置（需要重新初始化）
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        
        // 如果已经初始化，重新加载
        if (this.isInitialized) {
            this.destroy();
            this.init();
        }
    }
    
    // 销毁线条特效
    destroy() {
        if (this.script) {
            this.script.remove();
        }
        
        // 移除所有canvas-nest创建的canvas
        const canvases = document.querySelectorAll('canvas[data-generated-by="canvas-nest"]');
        canvases.forEach(canvas => canvas.remove());
        
        document.body.classList.remove('line-effects-enabled');
        this.isInitialized = false;
        
        console.log('线条跟随特效已禁用');
    }
    
    // 获取当前状态
    getStatus() {
        return {
            initialized: this.isInitialized,
            options: this.options
        };
    }
}

// 创建全局实例
window.lineEffects = new LineEffects();

// 自动初始化（如果设置了自动启用）
if (document.body.hasAttribute('data-auto-line-effects')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.lineEffects.init();
    });
}
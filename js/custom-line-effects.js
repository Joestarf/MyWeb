// js/custom-line-effects.js
// 自定义线条跟随特效 - 不依赖外部库

class CustomLineEffects {
    constructor(options = {}) {
        this.options = {
            color: '100,149,237',
            opacity: 0.7,
            count: 50,
            zIndex: 9997,
            lineDistance: 150,    // 连线距离
            lineWidth: 1,         // 线宽
            particleSpeed: 2,     // 粒子速度
            ...options
        };
        
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.animationId = null;
        this.isInitialized = false;
    }
    
    // 初始化自定义线条特效
    init() {
        if (this.isInitialized) return;
        
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
        this.isInitialized = true;
        
        console.log('自定义线条跟随特效已启用');
    }
    
    // 创建Canvas元素
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'custom-line-effects-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: ${this.options.zIndex};
            pointer-events: none;
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // 设置Canvas尺寸
        this.resizeCanvas();
        
        document.body.classList.add('line-effects-enabled');
    }
    
    // 调整Canvas尺寸
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    // 创建粒子
    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.options.count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                speedX: (Math.random() - 0.5) * this.options.particleSpeed,
                speedY: (Math.random() - 0.5) * this.options.particleSpeed,
                radius: Math.random() * 1.5 + 0.5
            });
        }
    }
    
    // 绑定事件
    bindEvents() {
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }
    
    // 处理鼠标移动
    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
    }
    
    // 动画循环
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 更新和绘制粒子
        this.updateParticles();
        this.drawParticles();
        this.drawLines();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // 更新粒子位置
    updateParticles() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            
            // 边界检查
            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX = -particle.speedX;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY = -particle.speedY;
            }
        });
    }
    
    // 绘制粒子
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(${this.options.color}, ${this.options.opacity})`;
            this.ctx.fill();
        });
    }
    
    // 绘制连线
    drawLines() {
        const rgb = this.options.color.split(',').map(num => parseInt(num.trim()));
        
        for (let i = 0; i < this.particles.length; i++) {
            // 粒子之间的连线
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.options.lineDistance) {
                    const opacity = 1 - distance / this.options.lineDistance;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity * this.options.opacity})`;
                    this.ctx.lineWidth = this.options.lineWidth;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
            
            // 鼠标与粒子的连线
            const dx = this.particles[i].x - this.mouse.x;
            const dy = this.particles[i].y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < this.options.lineDistance * 1.5) {
                const opacity = 1 - distance / (this.options.lineDistance * 1.5);
                this.ctx.beginPath();
                this.ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity * this.options.opacity})`;
                this.ctx.lineWidth = this.options.lineWidth;
                this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                this.ctx.lineTo(this.mouse.x, this.mouse.y);
                this.ctx.stroke();
            }
        }
    }
    
    // 更新配置
    updateOptions(newOptions) {
        this.options = { ...this.options, ...newOptions };
        
        // 如果已经初始化，重新创建粒子
        if (this.isInitialized) {
            this.createParticles();
        }
    }
    
    // 销毁特效
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.canvas) {
            this.canvas.remove();
        }
        
        document.body.classList.remove('line-effects-enabled');
        this.isInitialized = false;
        
        console.log('自定义线条跟随特效已禁用');
    }
    
    // 获取当前状态
    getStatus() {
        return {
            initialized: this.isInitialized,
            options: this.options,
            particlesCount: this.particles.length
        };
    }
}

// 创建全局实例
window.customLineEffects = new CustomLineEffects();

// 自动初始化（如果设置了自动启用）
if (document.body.hasAttribute('data-auto-custom-line-effects')) {
    document.addEventListener('DOMContentLoaded', () => {
        window.customLineEffects.init();
    });
}
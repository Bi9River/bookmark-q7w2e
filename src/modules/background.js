// 背景主题数组
const backgrounds = [
  { name: '深邃紫色', gradient: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)' },
  { name: '暗夜蓝紫', gradient: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
  { name: '深海蓝绿', gradient: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)' },
  { name: '墨绿森林', gradient: 'linear-gradient(135deg, #0f4c75 0%, #3282b8 100%)' },
  { name: '暗紫红色', gradient: 'linear-gradient(135deg, #360033 0%, #0b8793 100%)' },
  { name: '深蓝渐变', gradient: 'linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)' },
  { name: '炭黑蓝色', gradient: 'linear-gradient(135deg, #232526 0%, #414345 100%)' },
  { name: '深紫靛蓝', gradient: 'linear-gradient(135deg, #667db6 0%, #0082c8 0%, #0082c8 0%, #667db6 100%)' },
  { name: '暗绿青色', gradient: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)' },
  { name: '深灰蓝色', gradient: 'linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)' },
  { name: '午夜蓝色', gradient: 'linear-gradient(135deg, #0c0c0c 0%, #2d5016 50%, #0c0c0c 100%)' },
  { name: '深橄榄绿', gradient: 'linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)' }
];

let currentBgIndex = 0;
let backgroundSelector = null;

// 创建背景选择器UI
function createBackgroundSelector() {
  const selector = document.createElement('div');
  selector.id = 'bg-selector';
  selector.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    z-index: 10000;
    display: none;
    max-width: 500px;
    width: 90%;
    max-height: 70vh;
    overflow-y: auto;
  `;
  
  selector.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; color: #333; font-size: 1.5rem;">选择背景主题</h3>
      <button id="close-selector" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
    </div>
    <div id="bg-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;"></div>
    <div style="margin-top: 1.5rem; text-align: center;">
      <button id="random-bg" style="background: #666; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">🎲 随机背景</button>
      <button id="cycle-bg" style="background: #007bff; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer;">🔄 循环切换</button>
    </div>
  `;
  
  // 创建背景选项
  const optionsContainer = selector.querySelector('#bg-options');
  backgrounds.forEach((bg, index) => {
    const option = document.createElement('div');
    option.style.cssText = `
      background: ${bg.gradient};
      height: 80px;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
      border: 3px solid transparent;
      display: flex;
      align-items: end;
      padding: 0.5rem;
    `;
    
    option.innerHTML = `
      <span style="background: rgba(0,0,0,0.7); color: white; padding: 0.25rem 0.5rem; border-radius: 5px; font-size: 0.8rem;">${bg.name}</span>
    `;
    
    option.addEventListener('click', () => selectBackground(index));
    option.addEventListener('mouseenter', () => {
      option.style.transform = 'scale(1.05)';
      option.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
    });
    option.addEventListener('mouseleave', () => {
      option.style.transform = 'scale(1)';
      option.style.boxShadow = 'none';
    });
    
    optionsContainer.appendChild(option);
  });
  
  // 绑定事件
  selector.querySelector('#close-selector').addEventListener('click', hideBackgroundSelector);
  selector.querySelector('#random-bg').addEventListener('click', () => {
    randomBackground();
    hideBackgroundSelector();
  });
  selector.querySelector('#cycle-bg').addEventListener('click', () => {
    changeBackground();
    hideBackgroundSelector();
  });
  
  document.body.appendChild(selector);
  return selector;
}

// 显示背景选择器
function showBackgroundSelector() {
  if (!backgroundSelector) {
    backgroundSelector = createBackgroundSelector();
  }
  
  backgroundSelector.style.display = 'block';
  updateSelectedBackground();
  
  // 添加遮罩
  const overlay = document.createElement('div');
  overlay.id = 'bg-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
  `;
  overlay.addEventListener('click', hideBackgroundSelector);
  document.body.appendChild(overlay);
  
  // 阻止页面滚动
  document.body.style.overflow = 'hidden';
}

// 隐藏背景选择器
function hideBackgroundSelector() {
  if (backgroundSelector) {
    backgroundSelector.style.display = 'none';
  }
  
  const overlay = document.getElementById('bg-overlay');
  if (overlay) {
    overlay.remove();
  }
  
  // 恢复页面滚动
  document.body.style.overflow = 'auto';
}

// 更新选中的背景高亮
function updateSelectedBackground() {
  const options = backgroundSelector.querySelectorAll('#bg-options > div');
  options.forEach((option, index) => {
    if (index === currentBgIndex) {
      option.style.border = '3px solid #007bff';
      option.style.boxShadow = '0 0 0 2px rgba(0,123,255,0.25)';
    } else {
      option.style.border = '3px solid transparent';
      option.style.boxShadow = 'none';
    }
  });
}

// 选择背景
function selectBackground(index) {
  currentBgIndex = index;
  document.body.style.background = backgrounds[currentBgIndex].gradient;
  localStorage.setItem('shiqi-bg-index', currentBgIndex);
  updateSelectedBackground();
  
  // 添加这一行：自动调整文字颜色
  adjustTextColor(backgrounds[currentBgIndex].gradient);
  
  // 添加切换动画效果
  document.body.style.transform = 'scale(1.02)';
  setTimeout(() => {
    document.body.style.transform = 'scale(1)';
  }, 200);
}

// 循环切换背景
function changeBackground() {
  currentBgIndex = (currentBgIndex + 1) % backgrounds.length;
  selectBackground(currentBgIndex);
}

// 随机背景
function randomBackground() {
  const randomIndex = Math.floor(Math.random() * backgrounds.length);
  selectBackground(randomIndex);
}

// 恢复保存的背景
function restoreSavedBackground() {
  const savedBg = localStorage.getItem('shiqi-bg-index');
  if (savedBg !== null) {
    currentBgIndex = parseInt(savedBg);
    document.body.style.background = backgrounds[currentBgIndex].gradient;
  }
}

// 初始化背景功能
export function initBackgroundChanger() {
  // 页面加载时恢复背景
  restoreSavedBackground();
  
  // 绑定按钮事件
  const bgBtn = document.getElementById('bg-btn');
  if (bgBtn) {
    // 左键点击显示选择器
    bgBtn.addEventListener('click', showBackgroundSelector);
    
    // 右键点击随机背景
    bgBtn.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      randomBackground();
    });
  }
  
  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      changeBackground();
    }
    if (e.ctrlKey && e.shiftKey && e.key === 'B') {
      e.preventDefault();
      showBackgroundSelector();
    }
    if (e.key === 'Escape' && backgroundSelector && backgroundSelector.style.display === 'block') {
      hideBackgroundSelector();
    }
  });
}

// 自动调整文字颜色
function adjustTextColor(gradient) {
  // 提取渐变中的主要颜色
  const colorMatch = gradient.match(/#[0-9a-fA-F]{6}/g);
  if (!colorMatch) return;
  
  // 计算第一个颜色的亮度
  const hex = colorMatch[0];
  const r = parseInt(hex.substr(1, 2), 16);
  const g = parseInt(hex.substr(3, 2), 16);
  const b = parseInt(hex.substr(5, 2), 16);
  
  // 计算相对亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // 设置CSS变量
  if (brightness > 150) {
    // 浅色背景，使用深色文字
    document.documentElement.style.setProperty('--text-color', '#333333');
    document.documentElement.style.setProperty('--text-color-secondary', '#666666');
    document.documentElement.style.setProperty('--glass-bg', 'rgba(255,255,255,0.9)');
    document.documentElement.style.setProperty('--glass-border', 'rgba(0,0,0,0.1)');
  } else {
    // 深色背景，使用浅色文字
    document.documentElement.style.setProperty('--text-color', '#ffffff');
    document.documentElement.style.setProperty('--text-color-secondary', 'rgba(255,255,255,0.8)');
    document.documentElement.style.setProperty('--glass-bg', 'rgba(255,255,255,0.1)');
    document.documentElement.style.setProperty('--glass-border', 'rgba(255,255,255,0.2)');
  }
}
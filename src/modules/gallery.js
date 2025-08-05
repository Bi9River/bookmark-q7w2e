// 照片配置 - 自动检测图片
const photoConfig = {
  folder: '/photos/',
  // 检测模式配置
  patterns: [
    // DSC 相机照片格式：DSC01576.JPG, DSC01590.JPG...
    { 
      prefix: 'DSC', 
      start: 1, 
      end: 99999, // 大范围检测
      padZeros: 5, // 补零到5位数：DSC01576
      extensions: ['JPG', 'jpg', 'JPEG', 'jpeg', 'PNG', 'png', 'WEBP', 'webp'] 
    },
    // 通用数字格式：photo1.jpg, img1.jpg...
    { 
      prefix: 'photo', 
      start: 1, 
      end: 100, 
      extensions: ['jpg', 'jpeg', 'png', 'webp'] 
    },
    { 
      prefix: 'img', 
      start: 1, 
      end: 100, 
      extensions: ['jpg', 'jpeg', 'png', 'webp'] 
    },
    // 你已有的具体文件（如果你知道确切的文件名）
    { 
      names: [
        'DSC01576.JPG',
        'DSC01590.JPG', 
        'DSC02613.JPG',
        'DSC03261.JPG'
      ]
    }
  ],
  detectedImages: [],
  interval: 15000,
  opacity: 0.9
};

// 全局变量声明 - 确保在文件顶部声明
let currentPhotoIndex = 0;
let isGalleryActive = false;
let slideInterval = null;
let backgroundOverlay = null;

// 检测图片是否存在
async function imageExists(filename) {
  return new Promise((resolve) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      resolve(false);
    }, 2000); // 缩短超时时间到2秒
    
    img.onload = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve(false);
    };
    img.src = photoConfig.folder + filename;
  });
}

// 生成补零数字字符串
function padNumber(num, length) {
  return num.toString().padStart(length, '0');
}

// 自动检测图片文件
async function detectImages() {
  const detectedImages = [];
  let totalChecked = 0;
  
  console.log('照片墙: 开始检测图片...');
  
  for (const pattern of photoConfig.patterns) {
    // 检测数字序列模式
    if (pattern.prefix && pattern.start && pattern.end) {
      console.log(`检测 ${pattern.prefix} 格式图片...`);
      
      // 优化：先检测已知存在的文件范围
      const sampleRanges = [
        { start: 1570, end: 1580 },    // DSC01576 附近
        { start: 1585, end: 1595 },    // DSC01590 附近  
        { start: 2610, end: 2620 },    // DSC02613 附近
        { start: 3260, end: 3270 },    // DSC03261 附近
        { start: pattern.start, end: Math.min(pattern.start + 50, pattern.end) } // 前50个
      ];
      
      for (const range of sampleRanges) {
        for (let i = range.start; i <= range.end; i++) {
          for (const ext of pattern.extensions) {
            const number = pattern.padZeros ? padNumber(i, pattern.padZeros) : i.toString();
            const filename = `${pattern.prefix}${number}.${ext}`;
            totalChecked++;
            
            if (await imageExists(filename)) {
              detectedImages.push(filename);
              console.log(`照片墙: 找到图片 ${filename}`);
            }
          }
        }
      }
    }
    
    // 检测明确指定的文件名
    if (pattern.names) {
      console.log('检测指定文件名...');
      for (const name of pattern.names) {
        totalChecked++;
        
        if (await imageExists(name)) {
          detectedImages.push(name);
          console.log(`照片墙: 找到图片 ${name}`);
        }
      }
    }
  }
  
  // 去重
  const uniqueImages = [...new Set(detectedImages)];
  photoConfig.detectedImages = uniqueImages;
  
  console.log(`照片墙: 检测完成，共检查 ${totalChecked} 个文件，找到 ${uniqueImages.length} 张图片`);
  console.log('找到的图片:', uniqueImages);
  
  return uniqueImages;
}

// 创建动态背景覆盖层
function createBackgroundOverlay() {
  if (backgroundOverlay) return;
  
  backgroundOverlay = document.createElement('div');
  backgroundOverlay.id = 'photo-background';
  backgroundOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0;
    transition: all 2s ease-in-out;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
  `;
  
  document.body.appendChild(backgroundOverlay);
}

// 更新背景图片
function updateBackgroundPhoto() {
  if (!backgroundOverlay || photoConfig.detectedImages.length === 0) return;
  
  const imagePath = photoConfig.folder + photoConfig.detectedImages[currentPhotoIndex];
  
  // 预加载图片
  const img = new Image();
  img.onload = () => {
    backgroundOverlay.style.backgroundImage = `url('${imagePath}')`;
    backgroundOverlay.style.opacity = isGalleryActive ? photoConfig.opacity : 0;
  };
  img.onerror = () => {
    console.warn(`照片墙: 无法加载图片 ${imagePath}`);
    // 跳到下一张
    if (photoConfig.detectedImages.length > 1) {
      nextPhoto();
    }
  };
  img.src = imagePath;
}

// 下一张照片
function nextPhoto() {
  if (photoConfig.detectedImages.length === 0) return;
  
  currentPhotoIndex = (currentPhotoIndex + 1) % photoConfig.detectedImages.length;
  updateBackgroundPhoto();
  updatePhotoInfo();
}

// 上一张照片
function previousPhoto() {
  if (photoConfig.detectedImages.length === 0) return;
  
  currentPhotoIndex = (currentPhotoIndex - 1 + photoConfig.detectedImages.length) % photoConfig.detectedImages.length;
  updateBackgroundPhoto();
  updatePhotoInfo();
}

// 随机照片
function randomPhoto() {
  if (photoConfig.detectedImages.length === 0) return;
  
  const randomIndex = Math.floor(Math.random() * photoConfig.detectedImages.length);
  currentPhotoIndex = randomIndex;
  updateBackgroundPhoto();
  updatePhotoInfo();
}

// 开始幻灯片播放
function startSlideshow() {
  stopSlideshow(); // 确保没有重复的定时器
  slideInterval = setInterval(nextPhoto, photoConfig.interval);
}

// 停止幻灯片播放
function stopSlideshow() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

// 开始/停止照片墙
function togglePhotoGallery() {
  if (photoConfig.detectedImages.length === 0) {
    showToast('没有找到照片文件，请先添加图片到 public/photos/ 目录');
    return;
  }
  
  isGalleryActive = !isGalleryActive;
  
  const photoBtn = document.getElementById('photo-btn');
  
  if (isGalleryActive) {
    // 启动照片墙
    createBackgroundOverlay();
    updateBackgroundPhoto();
    startSlideshow();
    showPhotoControls();
    
    // 更新按钮状态
    if (photoBtn) {
      photoBtn.textContent = '📸 关闭照片墙';
      photoBtn.style.background = 'rgba(255,255,255,0.4)';
      photoBtn.style.boxShadow = '0 0 10px rgba(255,255,255,0.3)';
    }
    
    // 添加键盘控制
    document.addEventListener('keydown', handleGalleryKeyboard);
    
    showToast(`照片墙已启动 (${photoConfig.detectedImages.length}张照片) - 空格键切换`);
    
  } else {
    // 关闭照片墙
    if (backgroundOverlay) {
      backgroundOverlay.style.opacity = '0';
    }
    stopSlideshow();
    hidePhotoControls();
    
    // 恢复按钮状态
    if (photoBtn) {
      photoBtn.textContent = '📸 照片墙';
      photoBtn.style.background = 'rgba(255,255,255,0.2)';
      photoBtn.style.boxShadow = 'none';
    }
    
    // 移除键盘控制
    document.removeEventListener('keydown', handleGalleryKeyboard);
    
    showToast('照片墙已关闭');
  }
}

// 显示照片控制面板
function showPhotoControls() {
  let controls = document.getElementById('photo-controls');
  
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'photo-controls';
    controls.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(15px);
      border-radius: 20px;
      padding: 1.5rem;
      color: white;
      font-size: 0.9rem;
      z-index: 1000;
      display: none;
      min-width: 280px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.1);
    `;
    
    controls.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
  <span id="photo-info" style="font-weight: 600;">照片 1/${photoConfig.detectedImages.length}</span>
  <div style="display: flex; gap: 0.5rem;">
    <button id="pause-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">⏸️ 暂停</button>
    <button id="minimize-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">➖</button>
  </div>
</div>
<div id="controls-content">
  <!-- 原来的控制内容保持不变 -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1rem;">
        <button id="prev-photo" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.6rem; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">⏮️</button>
        <button id="next-photo" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.6rem; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">⏭️</button>
        <button id="random-photo" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.6rem; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">🎲</button>
        <button id="opacity-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; padding: 0.6rem; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">🔆</button>
      </div>
      <div style="margin-bottom: 1rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
          <span style="font-size: 0.8rem;">透明度</span>
          <span id="opacity-value" style="font-size: 0.8rem;">${Math.round(photoConfig.opacity * 100)}%</span>
        </div>
        <input type="range" id="opacity-slider" min="0.1" max="0.8" step="0.1" value="${photoConfig.opacity}" 
               style="width: 100%; accent-color: white;">
      </div>
      <div style="font-size: 0.75rem; opacity: 0.7; line-height: 1.3;">
        <div>空格/→: 下一张 | ←: 上一张</div>
        <div>P: 暂停/继续 | R: 随机</div>
      </div>
    `;
    
    // 绑定控制按钮事件
    controls.querySelector('#prev-photo').addEventListener('click', previousPhoto);
    controls.querySelector('#next-photo').addEventListener('click', nextPhoto);
    controls.querySelector('#random-photo').addEventListener('click', randomPhoto);
    controls.querySelector('#pause-btn').addEventListener('click', togglePause);
    controls.querySelector('#opacity-btn').addEventListener('click', cycleOpacity);
    controls.querySelector('#minimize-btn').addEventListener('click', minimizeControls);

    // 透明度滑块
    const opacitySlider = controls.querySelector('#opacity-slider');
    opacitySlider.addEventListener('input', (e) => {
      photoConfig.opacity = parseFloat(e.target.value);
      updateBackgroundPhoto();
      updateOpacityDisplay();
    });
    
    // 按钮悬停效果
    const buttons = controls.querySelectorAll('button');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        btn.style.background = 'rgba(255,255,255,0.4)';
        btn.style.transform = 'scale(1.05)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.background = 'rgba(255,255,255,0.2)';
        btn.style.transform = 'scale(1)';
      });
    });
    
    document.body.appendChild(controls);
  }
  
  controls.style.display = 'block';
  updatePhotoInfo();
  updateOpacityDisplay();
}

// 隐藏照片控制面板
function hidePhotoControls() {
  const controls = document.getElementById('photo-controls');
  if (controls) {
    controls.style.display = 'none';
  }
}

// 更新照片信息
function updatePhotoInfo() {
  const info = document.getElementById('photo-info');
  if (info && photoConfig.detectedImages.length > 0) {
    const currentImage = photoConfig.detectedImages[currentPhotoIndex];
    info.textContent = `${currentImage} (${currentPhotoIndex + 1}/${photoConfig.detectedImages.length})`;
  }
}

// 更新透明度显示
function updateOpacityDisplay() {
  const opacityValue = document.getElementById('opacity-value');
  const opacitySlider = document.getElementById('opacity-slider');
  
  if (opacityValue) {
    opacityValue.textContent = `${Math.round(photoConfig.opacity * 100)}%`;
  }
  if (opacitySlider) {
    opacitySlider.value = photoConfig.opacity;
  }
}

// 循环切换透明度
function cycleOpacity() {
  const opacities = [0.2, 0.3, 0.4, 0.5, 0.6];
  const currentIndex = opacities.indexOf(photoConfig.opacity);
  const nextIndex = (currentIndex + 1) % opacities.length;
  
  photoConfig.opacity = opacities[nextIndex];
  updateBackgroundPhoto();
  updateOpacityDisplay();
  
  showToast(`透明度: ${Math.round(photoConfig.opacity * 100)}%`);
}

// 暂停/继续
function togglePause() {
  const pauseBtn = document.getElementById('pause-btn');
  
  if (slideInterval) {
    stopSlideshow();
    if (pauseBtn) {
      pauseBtn.textContent = '▶️ 继续';
      pauseBtn.style.background = 'rgba(76, 175, 80, 0.3)';
    }
    showToast('照片墙已暂停');
  } else {
    startSlideshow();
    if (pauseBtn) {
      pauseBtn.textContent = '⏸️ 暂停';
      pauseBtn.style.background = 'rgba(255,255,255,0.2)';
    }
    showToast('照片墙继续播放');
  }
}

// 处理键盘事件
function handleGalleryKeyboard(e) {
  if (!isGalleryActive) return;
  
  switch(e.key) {
    case ' ':
    case 'ArrowRight':
      e.preventDefault();
      nextPhoto();
      break;
    case 'ArrowLeft':
      e.preventDefault();
      previousPhoto();
      break;
    case 'p':
    case 'P':
      e.preventDefault();
      togglePause();
      break;
    case 'r':
    case 'R':
      e.preventDefault();
      randomPhoto();
      break;
    case 'o':
    case 'O':
      e.preventDefault();
      cycleOpacity();
      break;
  }
}

// 简单的提示功能
function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.9);
    color: white;
    padding: 1rem 2rem;
    border-radius: 30px;
    z-index: 10000;
    font-size: 0.9rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.2);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    animation: toastAnimation 3s ease;
  `;
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes toastAnimation {
      0% { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(0.8); }
      15%, 85% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(0.8); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
    style.remove();
  }, 3000);
}

// 初始化照片墙功能
export async function initPhotoGallery() {
  const photoBtn = document.getElementById('photo-btn');
  
  if (photoBtn) {
    photoBtn.addEventListener('click', togglePhotoGallery);
  }
  
  // 自动检测图片
  try {
    await detectImages();
    
    if (photoConfig.detectedImages.length === 0) {
      console.warn('照片墙: 没有检测到图片文件');
      console.log('请按以下步骤添加图片：');
      console.log('1. 在项目根目录创建 public/photos/ 文件夹');
      console.log('2. 添加图片文件，支持的命名格式：');
      console.log('   - DSC01576.JPG, DSC01590.JPG 等相机格式');
      console.log('   - photo1.jpg, photo2.jpg 等通用格式');
      console.log('3. 支持的格式: .jpg, .jpeg, .png, .webp');
      
      // 显示提示给用户
      if (photoBtn) {
        photoBtn.style.opacity = '0.5';
        photoBtn.title = '没有找到照片文件，请先添加图片到 public/photos/ 目录';
      }
    } else {
      console.log(`照片墙: 准备就绪，共 ${photoConfig.detectedImages.length} 张图片`);
      if (photoBtn) {
        photoBtn.title = `点击启动照片墙 (${photoConfig.detectedImages.length}张图片)`;
      }
    }
  } catch (error) {
    console.error('照片墙初始化失败:', error);
  }
}

// 最小化控制面板
function minimizeControls() {
  const controls = document.getElementById('photo-controls');
  const content = document.getElementById('controls-content');
  const minimizeBtn = document.getElementById('minimize-btn');
  
  if (content.style.display === 'none') {
    // 展开
    content.style.display = 'block';
    minimizeBtn.textContent = '➖';
    minimizeBtn.title = '最小化控制面板';
    controls.style.minWidth = '280px';
  } else {
    // 最小化
    content.style.display = 'none';
    minimizeBtn.textContent = '➕';
    minimizeBtn.title = '展开控制面板';
    controls.style.minWidth = 'auto';
  }
}
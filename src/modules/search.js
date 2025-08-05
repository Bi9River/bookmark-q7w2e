// 搜索功能
function searchBookmarks(query) {
  const categories = document.querySelectorAll('.category');
  const searchQuery = query.toLowerCase().trim();
  
  categories.forEach(category => {
    const links = category.querySelectorAll('.bookmark-list a');
    let hasVisibleLinks = false;
    
    // 检查每个链接
    links.forEach(link => {
      const linkText = link.textContent.toLowerCase();
      const linkUrl = link.href.toLowerCase();
      
      // 搜索名称和URL
      const isMatch = linkText.includes(searchQuery) || linkUrl.includes(searchQuery);
      
      if (isMatch || searchQuery === '') {
        link.parentElement.style.display = 'block';
        hasVisibleLinks = true;
        
        // 高亮匹配的文本
        if (searchQuery !== '') {
          highlightText(link, searchQuery);
        } else {
          removeHighlight(link);
        }
      } else {
        link.parentElement.style.display = 'none';
      }
    });
    
    // 显示/隐藏整个分类
    if (hasVisibleLinks || searchQuery === '') {
      category.style.display = 'block';
      // 添加淡入动画
      category.style.opacity = '0';
      setTimeout(() => {
        category.style.opacity = '1';
      }, 50);
    } else {
      category.style.display = 'none';
    }
  });
  
  // 显示搜索结果统计
  updateSearchStats(query);
}

// 高亮匹配文本
function highlightText(element, searchQuery) {
  const originalText = element.getAttribute('data-original-text') || element.textContent;
  element.setAttribute('data-original-text', originalText);
  
  const regex = new RegExp(`(${escapeRegExp(searchQuery)})`, 'gi');
  const highlightedText = originalText.replace(regex, '<mark style="background: yellow; color: black; padding: 2px 4px; border-radius: 3px;">$1</mark>');
  element.innerHTML = highlightedText;
}

// 移除高亮
function removeHighlight(element) {
  const originalText = element.getAttribute('data-original-text');
  if (originalText) {
    element.textContent = originalText;
    element.removeAttribute('data-original-text');
  }
}

// 转义正则表达式特殊字符
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// 更新搜索统计
function updateSearchStats(query) {
  const visibleLinks = document.querySelectorAll('.bookmark-list a[style*="display: block"], .bookmark-list a:not([style*="display: none"])');
  const totalLinks = document.querySelectorAll('.bookmark-list a');
  
  // 在搜索框下方显示统计信息
  let statsElement = document.getElementById('search-stats');
  if (!statsElement) {
    statsElement = document.createElement('div');
    statsElement.id = 'search-stats';
    statsElement.style.cssText = `
      text-align: center;
      color: rgba(255,255,255,0.8);
      margin-top: 0.5rem;
      font-size: 0.9rem;
      min-height: 20px;
    `;
    document.querySelector('.search-container').appendChild(statsElement);
  }
  
  if (query.trim()) {
    const visibleCount = Array.from(visibleLinks).filter(link => 
      link.parentElement.style.display !== 'none'
    ).length;
    statsElement.textContent = `找到 ${visibleCount} 个匹配结果（共 ${totalLinks.length} 个书签）`;
  } else {
    statsElement.textContent = '';
  }
}

// 清空搜索
function clearSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.value = '';
    searchBookmarks('');
  }
}

// 初始化搜索功能
export function initSearch() {
  const searchInput = document.getElementById('search-input');
  
  if (searchInput) {
    // 实时搜索
    searchInput.addEventListener('input', (e) => {
      searchBookmarks(e.target.value);
    });
    
    // 搜索框快捷键
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        clearSearch();
        searchInput.blur();
      }
      if (e.key === 'Enter') {
        // 如果只有一个结果，直接打开
        const visibleLinks = document.querySelectorAll('.bookmark-list a[style*="display: block"], .bookmark-list a:not([style*="display: none"])');
        const visibleCount = Array.from(visibleLinks).filter(link => 
          link.parentElement.style.display !== 'none'
        ).length;
        
        if (visibleCount === 1) {
          const link = Array.from(visibleLinks).find(link => 
            link.parentElement.style.display !== 'none'
          );
          if (link) {
            window.open(link.href, '_blank');
          }
        }
      }
    });
  }
  
  // 全局快捷键 Ctrl+F 聚焦搜索框
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });
}

// 导出清空搜索功能供其他模块使用
export { clearSearch };
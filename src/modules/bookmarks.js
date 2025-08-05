// 书签数据（从 JSON 文件加载）
let bookmarksData = [];

// 从 JSON 文件加载书签数据
async function loadBookmarks() {
  try {
    const response = await fetch('/bookmarks.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    bookmarksData = data.categories;
    console.log('书签数据加载成功:', bookmarksData.length, '个分类');
    return bookmarksData;
  } catch (error) {
    console.error('加载书签数据失败:', error);
    // 使用备用数据
    bookmarksData = getFallbackData();
    return bookmarksData;
  }
}

// 备用数据（如果 JSON 加载失败）
function getFallbackData() {
  return [
    {
      title: '🤖 AI Assistants',
      links: [
        { name: 'ChatGPT', url: 'https://chat.openai.com' },
        { name: 'Claude', url: 'https://claude.ai' }
      ]
    }
  ];
}

// 生成书签HTML
function generateBookmarksHTML() {
  if (!bookmarksData || bookmarksData.length === 0) {
    return '<div style="text-align: center; color: var(--text-color); padding: 2rem;">正在加载书签...</div>';
  }
  
  return bookmarksData.map(category => `
    <div class="category" data-category="${category.title}">
      <h2>${category.title}</h2>
      <ul class="bookmark-list">
        ${category.links.map(link => `
          <li>
            <a href="${link.url}" target="_blank" rel="noopener noreferrer">
              <div class="bookmark-title">${link.name}</div>
              <div class="bookmark-url">${link.url.replace('https://', '').replace('http://', '')}</div>
            </a>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

// 初始化书签
export async function initBookmarks() {
  const bookmarksContainer = document.getElementById('bookmarks');
  
  if (bookmarksContainer) {
    // 显示加载状态
    bookmarksContainer.innerHTML = '<div style="text-align: center; color: var(--text-color); padding: 2rem;">正在加载书签...</div>';
    
    // 加载数据
    await loadBookmarks();
    
    // 渲染书签
    bookmarksContainer.innerHTML = generateBookmarksHTML();
  }
}

// 导出书签数据（供其他模块使用）
export { bookmarksData };
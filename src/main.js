import './style.css'

// 创建主要内容
document.querySelector('#app').innerHTML = `
  <div class="container">
    <div class="header">
      <h1>Welcome, Shiqi!</h1>
      <div class="controls">
        <button class="btn" id="bg-btn">🎨 换背景</button>
        <button class="btn" id="photo-btn">📸 照片墙</button>
      </div>
    </div>

    <div class="search-container">
      <input type="text" class="search-box" placeholder="搜索书签..." id="search-input">
    </div>

    <div class="bookmarks" id="bookmarks">
      <!-- 书签内容将通过 JavaScript 生成 -->
    </div>
  </div>

  <!-- 照片墙 -->
  <div class="photo-gallery" id="photoGallery">
    <button class="close-btn" id="close-btn">&times;</button>
    <img src="" alt="Beautiful landscape" id="galleryImage">
  </div>
`

// 导入功能模块
import { initBackgroundChanger } from './modules/background.js'
import { initPhotoGallery } from './modules/gallery.js'
import { initBookmarks } from './modules/bookmarks.js'
import { initSearch } from './modules/search.js'

// 初始化所有功能
initBackgroundChanger()
initPhotoGallery()
initBookmarks()
initSearch()
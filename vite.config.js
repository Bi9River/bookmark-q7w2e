import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

// 自动生成照片列表的插件
function generatePhotoList() {
  return {
    name: 'generate-photo-list',
    buildStart() {
      const photosDir = path.join(__dirname, 'public/photos')
      
      if (fs.existsSync(photosDir)) {
        const files = fs.readdirSync(photosDir)
        const imageFiles = files.filter(file => 
          /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
        )
        
        // 生成照片列表文件
        const photoListContent = `export const photoList = ${JSON.stringify(imageFiles, null, 2)};`
        
        fs.writeFileSync(
          path.join(__dirname, 'src/generated-photo-list.js'),
          photoListContent
        )
        
        console.log(`生成照片列表: ${imageFiles.length} 张图片`)
      }
    }
  }
}

export default defineConfig({
  plugins: [generatePhotoList()]
})
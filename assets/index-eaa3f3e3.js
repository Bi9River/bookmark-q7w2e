(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const i of r)if(i.type==="childList")for(const s of i.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const i={};return r.integrity&&(i.integrity=r.integrity),r.referrerPolicy&&(i.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?i.credentials="include":r.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function n(r){if(r.ep)return;r.ep=!0;const i=o(r);fetch(r.href,i)}})();const p=[{name:"深邃紫色",gradient:"linear-gradient(135deg, #2d1b69 0%, #11998e 100%)"},{name:"暗夜蓝紫",gradient:"linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)"},{name:"深海蓝绿",gradient:"linear-gradient(135deg, #134e5e 0%, #71b280 100%)"},{name:"墨绿森林",gradient:"linear-gradient(135deg, #0f4c75 0%, #3282b8 100%)"},{name:"暗紫红色",gradient:"linear-gradient(135deg, #360033 0%, #0b8793 100%)"},{name:"深蓝渐变",gradient:"linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)"},{name:"炭黑蓝色",gradient:"linear-gradient(135deg, #232526 0%, #414345 100%)"},{name:"深紫靛蓝",gradient:"linear-gradient(135deg, #667db6 0%, #0082c8 0%, #0082c8 0%, #667db6 100%)"},{name:"暗绿青色",gradient:"linear-gradient(135deg, #2b5876 0%, #4e4376 100%)"},{name:"深灰蓝色",gradient:"linear-gradient(135deg, #2c3e50 0%, #4a6741 100%)"},{name:"午夜蓝色",gradient:"linear-gradient(135deg, #0c0c0c 0%, #2d5016 50%, #0c0c0c 100%)"},{name:"深橄榄绿",gradient:"linear-gradient(135deg, #1f4037 0%, #99f2c8 100%)"}];let d=0,u=null;function O(){const e=document.createElement("div");e.id="bg-selector",e.style.cssText=`
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
  `,e.innerHTML=`
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
      <h3 style="margin: 0; color: #333; font-size: 1.5rem;">选择背景主题</h3>
      <button id="close-selector" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">&times;</button>
    </div>
    <div id="bg-options" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;"></div>
    <div style="margin-top: 1.5rem; text-align: center;">
      <button id="random-bg" style="background: #666; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer; margin-right: 1rem;">🎲 随机背景</button>
      <button id="cycle-bg" style="background: #007bff; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 10px; cursor: pointer;">🔄 循环切换</button>
    </div>
  `;const t=e.querySelector("#bg-options");return p.forEach((o,n)=>{const r=document.createElement("div");r.style.cssText=`
      background: ${o.gradient};
      height: 80px;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
      border: 3px solid transparent;
      display: flex;
      align-items: end;
      padding: 0.5rem;
    `,r.innerHTML=`
      <span style="background: rgba(0,0,0,0.7); color: white; padding: 0.25rem 0.5rem; border-radius: 5px; font-size: 0.8rem;">${o.name}</span>
    `,r.addEventListener("click",()=>S(n)),r.addEventListener("mouseenter",()=>{r.style.transform="scale(1.05)",r.style.boxShadow="0 5px 15px rgba(0,0,0,0.3)"}),r.addEventListener("mouseleave",()=>{r.style.transform="scale(1)",r.style.boxShadow="none"}),t.appendChild(r)}),e.querySelector("#close-selector").addEventListener("click",b),e.querySelector("#random-bg").addEventListener("click",()=>{q(),b()}),e.querySelector("#cycle-bg").addEventListener("click",()=>{T(),b()}),document.body.appendChild(e),e}function L(){u||(u=O()),u.style.display="block",P();const e=document.createElement("div");e.id="bg-overlay",e.style.cssText=`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
  `,e.addEventListener("click",b),document.body.appendChild(e),document.body.style.overflow="hidden"}function b(){u&&(u.style.display="none");const e=document.getElementById("bg-overlay");e&&e.remove(),document.body.style.overflow="auto"}function P(){u.querySelectorAll("#bg-options > div").forEach((t,o)=>{o===d?(t.style.border="3px solid #007bff",t.style.boxShadow="0 0 0 2px rgba(0,123,255,0.25)"):(t.style.border="3px solid transparent",t.style.boxShadow="none")})}function S(e){d=e,document.body.style.background=p[d].gradient,localStorage.setItem("shiqi-bg-index",d),P(),K(p[d].gradient),document.body.style.transform="scale(1.02)",setTimeout(()=>{document.body.style.transform="scale(1)"},200)}function T(){d=(d+1)%p.length,S(d)}function q(){const e=Math.floor(Math.random()*p.length);S(e)}function H(){const e=localStorage.getItem("shiqi-bg-index");e!==null&&(d=parseInt(e),document.body.style.background=p[d].gradient)}function J(){H();const e=document.getElementById("bg-btn");e&&(e.addEventListener("click",L),e.addEventListener("contextmenu",t=>{t.preventDefault(),q()})),document.addEventListener("keydown",t=>{t.ctrlKey&&t.key==="b"&&(t.preventDefault(),T()),t.ctrlKey&&t.shiftKey&&t.key==="B"&&(t.preventDefault(),L()),t.key==="Escape"&&u&&u.style.display==="block"&&b()})}function K(e){const t=e.match(/#[0-9a-fA-F]{6}/g);if(!t)return;const o=t[0],n=parseInt(o.substr(1,2),16),r=parseInt(o.substr(3,2),16),i=parseInt(o.substr(5,2),16);(n*299+r*587+i*114)/1e3>150?(document.documentElement.style.setProperty("--text-color","#333333"),document.documentElement.style.setProperty("--text-color-secondary","#666666"),document.documentElement.style.setProperty("--glass-bg","rgba(255,255,255,0.9)"),document.documentElement.style.setProperty("--glass-border","rgba(0,0,0,0.1)")):(document.documentElement.style.setProperty("--text-color","#ffffff"),document.documentElement.style.setProperty("--text-color-secondary","rgba(255,255,255,0.8)"),document.documentElement.style.setProperty("--glass-bg","rgba(255,255,255,0.1)"),document.documentElement.style.setProperty("--glass-border","rgba(255,255,255,0.2)"))}const a={folder:"/bookmark-q7w2e/photos/",patterns:[{names:["DSC01576.JPG","DSC01590.JPG","DSC02613.JPG","DSC03261.JPG"]}],detectedImages:[],interval:15e3,opacity:.9};let m=0,f=!1,h=null,l=null;async function B(e){return new Promise(t=>{const o=new Image,n=setTimeout(()=>{t(!1)},2e3);o.onload=()=>{clearTimeout(n),t(!0)},o.onerror=()=>{clearTimeout(n),t(!1)},o.src=a.folder+e})}function R(e,t){return e.toString().padStart(t,"0")}async function F(){const e=[];let t=0;console.log("照片墙: 开始检测图片...");for(const n of a.patterns){if(n.prefix&&n.start&&n.end){console.log(`检测 ${n.prefix} 格式图片...`);const r=[{start:1570,end:1580},{start:1585,end:1595},{start:2610,end:2620},{start:3260,end:3270},{start:n.start,end:Math.min(n.start+50,n.end)}];for(const i of r)for(let s=i.start;s<=i.end;s++)for(const E of n.extensions){const w=n.padZeros?R(s,n.padZeros):s.toString(),x=`${n.prefix}${w}.${E}`;t++,await B(x)&&(e.push(x),console.log(`照片墙: 找到图片 ${x}`))}}if(n.names){console.log("检测指定文件名...");for(const r of n.names)t++,await B(r)&&(e.push(r),console.log(`照片墙: 找到图片 ${r}`))}}const o=[...new Set(e)];return a.detectedImages=o,console.log(`照片墙: 检测完成，共检查 ${t} 个文件，找到 ${o.length} 张图片`),console.log("找到的图片:",o),o}function N(){l||(l=document.createElement("div"),l.id="photo-background",l.style.cssText=`
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
  `,document.body.appendChild(l))}function y(){if(!l||a.detectedImages.length===0)return;const e=a.folder+a.detectedImages[m],t=new Image;t.onload=()=>{l.style.backgroundImage=`url('${e}')`,l.style.opacity=f?a.opacity:0},t.onerror=()=>{console.warn(`照片墙: 无法加载图片 ${e}`),a.detectedImages.length>1&&k()},t.src=e}function k(){a.detectedImages.length!==0&&(m=(m+1)%a.detectedImages.length,y(),v())}function A(){a.detectedImages.length!==0&&(m=(m-1+a.detectedImages.length)%a.detectedImages.length,y(),v())}function z(){if(a.detectedImages.length===0)return;m=Math.floor(Math.random()*a.detectedImages.length),y(),v()}function M(){C(),h=setInterval(k,a.interval)}function C(){h&&(clearInterval(h),h=null)}function X(){if(a.detectedImages.length===0){g("没有找到照片文件，请先添加图片到 public/photos/ 目录");return}f=!f;const e=document.getElementById("photo-btn");f?(N(),y(),M(),W(),e&&(e.textContent="📸 关闭照片墙",e.style.background="rgba(255,255,255,0.4)",e.style.boxShadow="0 0 10px rgba(255,255,255,0.3)"),document.addEventListener("keydown",$),g(`照片墙已启动 (${a.detectedImages.length}张照片) - 空格键切换`)):(l&&(l.style.opacity="0"),C(),Y(),e&&(e.textContent="📸 照片墙",e.style.background="rgba(255,255,255,0.2)",e.style.boxShadow="none"),document.removeEventListener("keydown",$),g("照片墙已关闭"))}function W(){let e=document.getElementById("photo-controls");e||(e=document.createElement("div"),e.id="photo-controls",e.style.cssText=`
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
    `,e.innerHTML=`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
  <span id="photo-info" style="font-weight: 600;">照片 1/${a.detectedImages.length}</span>
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
          <span id="opacity-value" style="font-size: 0.8rem;">${Math.round(a.opacity*100)}%</span>
        </div>
        <input type="range" id="opacity-slider" min="0.1" max="0.8" step="0.1" value="${a.opacity}" 
               style="width: 100%; accent-color: white;">
      </div>
      <div style="font-size: 0.75rem; opacity: 0.7; line-height: 1.3;">
        <div>空格/→: 下一张 | ←: 上一张</div>
        <div>P: 暂停/继续 | R: 随机</div>
      </div>
    `,e.querySelector("#prev-photo").addEventListener("click",A),e.querySelector("#next-photo").addEventListener("click",k),e.querySelector("#random-photo").addEventListener("click",z),e.querySelector("#pause-btn").addEventListener("click",j),e.querySelector("#opacity-btn").addEventListener("click",D),e.querySelector("#minimize-btn").addEventListener("click",Z),e.querySelector("#opacity-slider").addEventListener("input",n=>{a.opacity=parseFloat(n.target.value),y(),I()}),e.querySelectorAll("button").forEach(n=>{n.addEventListener("mouseenter",()=>{n.style.background="rgba(255,255,255,0.4)",n.style.transform="scale(1.05)"}),n.addEventListener("mouseleave",()=>{n.style.background="rgba(255,255,255,0.2)",n.style.transform="scale(1)"})}),document.body.appendChild(e)),e.style.display="block",v(),I()}function Y(){const e=document.getElementById("photo-controls");e&&(e.style.display="none")}function v(){const e=document.getElementById("photo-info");if(e&&a.detectedImages.length>0){const t=a.detectedImages[m];e.textContent=`${t} (${m+1}/${a.detectedImages.length})`}}function I(){const e=document.getElementById("opacity-value"),t=document.getElementById("opacity-slider");e&&(e.textContent=`${Math.round(a.opacity*100)}%`),t&&(t.value=a.opacity)}function D(){const e=[.2,.3,.4,.5,.6],o=(e.indexOf(a.opacity)+1)%e.length;a.opacity=e[o],y(),I(),g(`透明度: ${Math.round(a.opacity*100)}%`)}function j(){const e=document.getElementById("pause-btn");h?(C(),e&&(e.textContent="▶️ 继续",e.style.background="rgba(76, 175, 80, 0.3)"),g("照片墙已暂停")):(M(),e&&(e.textContent="⏸️ 暂停",e.style.background="rgba(255,255,255,0.2)"),g("照片墙继续播放"))}function $(e){if(f)switch(e.key){case" ":case"ArrowRight":e.preventDefault(),k();break;case"ArrowLeft":e.preventDefault(),A();break;case"p":case"P":e.preventDefault(),j();break;case"r":case"R":e.preventDefault(),z();break;case"o":case"O":e.preventDefault(),D();break}}function g(e){const t=document.createElement("div");t.textContent=e,t.style.cssText=`
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
  `;const o=document.createElement("style");o.textContent=`
    @keyframes toastAnimation {
      0% { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(0.8); }
      15%, 85% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
      100% { opacity: 0; transform: translateX(-50%) translateY(-30px) scale(0.8); }
    }
  `,document.head.appendChild(o),document.body.appendChild(t),setTimeout(()=>{t.remove(),o.remove()},3e3)}async function V(){const e=document.getElementById("photo-btn");e&&e.addEventListener("click",X);try{await F(),a.detectedImages.length===0?(console.warn("照片墙: 没有检测到图片文件"),console.log("请按以下步骤添加图片："),console.log("1. 在项目根目录创建 public/photos/ 文件夹"),console.log("2. 添加图片文件，支持的命名格式："),console.log("   - DSC01576.JPG, DSC01590.JPG 等相机格式"),console.log("   - photo1.jpg, photo2.jpg 等通用格式"),console.log("3. 支持的格式: .jpg, .jpeg, .png, .webp"),e&&(e.style.opacity="0.5",e.title="没有找到照片文件，请先添加图片到 public/photos/ 目录")):(console.log(`照片墙: 准备就绪，共 ${a.detectedImages.length} 张图片`),e&&(e.title=`点击启动照片墙 (${a.detectedImages.length}张图片)`))}catch(t){console.error("照片墙初始化失败:",t)}}function Z(){const e=document.getElementById("photo-controls"),t=document.getElementById("controls-content"),o=document.getElementById("minimize-btn");t.style.display==="none"?(t.style.display="block",o.textContent="➖",o.title="最小化控制面板",e.style.minWidth="280px"):(t.style.display="none",o.textContent="➕",o.title="展开控制面板",e.style.minWidth="auto")}let c=[];async function _(){try{const e=await fetch("https://raw.githubusercontent.com/Bi9River/prvbkmkjson/refs/heads/master/bookmarks.json");if(!e.ok)throw new Error(`HTTP error! status: ${e.status}`);return c=(await e.json()).categories,console.log("书签数据加载成功:",c.length,"个分类"),c}catch(e){return console.error("加载书签数据失败:",e),c=Q(),c}}function Q(){return[{title:"🤖 AI Assistants",links:[{name:"ChatGPT",url:"https://chat.openai.com"},{name:"Claude",url:"https://claude.ai"}]}]}function U(){return!c||c.length===0?'<div style="text-align: center; color: var(--text-color); padding: 2rem;">正在加载书签...</div>':c.map(e=>`
    <div class="category" data-category="${e.title}">
      <h2>${e.title}</h2>
      <ul class="bookmark-list">
        ${e.links.map(t=>`
          <li>
            <a href="${t.url}" target="_blank" rel="noopener noreferrer">
              <div class="bookmark-title">${t.name}</div>
              <div class="bookmark-url">${t.url.replace("https://","").replace("http://","")}</div>
            </a>
          </li>
        `).join("")}
      </ul>
    </div>
  `).join("")}async function ee(){const e=document.getElementById("bookmarks");e&&(e.innerHTML='<div style="text-align: center; color: var(--text-color); padding: 2rem;">正在加载书签...</div>',await _(),e.innerHTML=U())}function G(e){const t=document.querySelectorAll(".category"),o=e.toLowerCase().trim();t.forEach(n=>{const r=n.querySelectorAll(".bookmark-list a");let i=!1;r.forEach(s=>{const E=s.textContent.toLowerCase(),w=s.href.toLowerCase();E.includes(o)||w.includes(o)||o===""?(s.parentElement.style.display="block",i=!0,o!==""?te(s,o):ne(s)):s.parentElement.style.display="none"}),i||o===""?(n.style.display="block",n.style.opacity="0",setTimeout(()=>{n.style.opacity="1"},50)):n.style.display="none"}),re(e)}function te(e,t){const o=e.getAttribute("data-original-text")||e.textContent;e.setAttribute("data-original-text",o);const n=new RegExp(`(${oe(t)})`,"gi"),r=o.replace(n,'<mark style="background: yellow; color: black; padding: 2px 4px; border-radius: 3px;">$1</mark>');e.innerHTML=r}function ne(e){const t=e.getAttribute("data-original-text");t&&(e.textContent=t,e.removeAttribute("data-original-text"))}function oe(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function re(e){const t=document.querySelectorAll('.bookmark-list a[style*="display: block"], .bookmark-list a:not([style*="display: none"])'),o=document.querySelectorAll(".bookmark-list a");let n=document.getElementById("search-stats");if(n||(n=document.createElement("div"),n.id="search-stats",n.style.cssText=`
      text-align: center;
      color: rgba(255,255,255,0.8);
      margin-top: 0.5rem;
      font-size: 0.9rem;
      min-height: 20px;
    `,document.querySelector(".search-container").appendChild(n)),e.trim()){const r=Array.from(t).filter(i=>i.parentElement.style.display!=="none").length;n.textContent=`找到 ${r} 个匹配结果（共 ${o.length} 个书签）`}else n.textContent=""}function ae(){const e=document.getElementById("search-input");e&&(e.value="",G(""))}function ie(){const e=document.getElementById("search-input");e&&(e.addEventListener("input",t=>{G(t.target.value)}),e.addEventListener("keydown",t=>{if(t.key==="Escape"&&(ae(),e.blur()),t.key==="Enter"){const o=document.querySelectorAll('.bookmark-list a[style*="display: block"], .bookmark-list a:not([style*="display: none"])');if(Array.from(o).filter(r=>r.parentElement.style.display!=="none").length===1){const r=Array.from(o).find(i=>i.parentElement.style.display!=="none");r&&window.open(r.href,"_blank")}}})),document.addEventListener("keydown",t=>{t.ctrlKey&&t.key==="f"&&(t.preventDefault(),e&&(e.focus(),e.select()))})}document.querySelector("#app").innerHTML=`
  <div class="container">
    <div class="header">
      <h1>Welcome, Shiqi!</h1>
      <div class="controls">
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
`;J();V();ee();ie();

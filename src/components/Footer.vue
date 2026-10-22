<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section brand">
        <h3>審盾橘</h3>
        <p>化粧品廣告審查與 PIF 合規服務。免費工具先檢查，專業人員簽署把關。</p>
      </div>
      <div class="footer-section">
        <h3>服務與方案</h3>
        <router-link to="/services">服務與方案總覽</router-link>
        <router-link to="/pif">PIF 預檢・建檔</router-link>
        <router-link to="/safety-assessment">安全評估簽署</router-link>
      </div>
      <div class="footer-section">
        <h3>免費工具</h3>
        <router-link to="/ai-audit">AI 廣告檢核</router-link>
        <router-link to="/restricted-ingredients">禁限用成分查詢</router-link>
        <router-link to="/ingredients-dictionary">成分字典</router-link>
        <router-link to="/label-generator">標籤產生器</router-link>
        <router-link to="/blog">法規專欄</router-link>
      </div>
      <div class="footer-section">
        <h3>聯絡我們</h3>
        <a href="mailto:adchecktw@gmail.com">adchecktw@gmail.com</a>
        <div class="qrcode-container">
          <p class="qrcode-text">Line 免費諮詢</p>
          <img src="@/assets/line-qrcode.png" alt="Line QR Code" class="qrcode-image" />
        </div>
        <router-link to="/about" class="contact-link">聯絡方式與諮詢準備 →</router-link>
      </div>
    </div>
    <div class="footer-bottom">© {{ year }} 審盾橘 aicheck.com.tw</div>
  </footer>
</template>

<script setup>
const year = new Date().getFullYear()
</script>

<style scoped>
.footer { background: #f8f8f8; padding: 40px 20px 20px; border-top: 1px solid #ddd; color: #333; }
.footer-content { display: grid; grid-template-columns: 1.3fr 1fr 1fr 1fr; gap: 24px; max-width: 1200px; margin: 0 auto; }
.footer-section h3 { color: #ff5733; font-size: 17px; margin: 0 0 12px; }
.footer-section p,
.footer-section a { display: block; font-size: 14px; margin: 6px 0; color: #444; text-decoration: none; line-height: 1.6; }
.footer-section a:hover { color: #ff5733; }
.brand p { color: #666; max-width: 260px; }
.qrcode-container { display: flex; flex-direction: column; align-items: flex-start; margin-top: 8px; }
.qrcode-text { font-size: 13px; color: #ff5733 !important; margin: 0 0 4px !important; font-weight: bold; }
.qrcode-image { width: 80px; height: 80px; object-fit: contain; }
.contact-link { color: #e04e2d !important; font-weight: 600; }
.footer-bottom { max-width: 1200px; margin: 24px auto 0; padding-top: 16px; border-top: 1px solid #e6e6e6; font-size: 12px; color: #999; text-align: center; }

@media (max-width: 900px) {
  .footer-content { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  .footer-content { grid-template-columns: 1fr; text-align: center; }
  .brand p { margin: 0 auto; }
  .qrcode-container { align-items: center; }
}
</style>

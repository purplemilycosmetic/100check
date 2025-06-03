<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>百元快檢</h3>
      </div>
      <div class="footer-section">
        <h3>產品服務</h3>
        <p>服務介紹</p>
        <p>隱私權</p>
      </div>
      <div class="footer-section">
        <h3>聯絡我們</h3>
        <p>0932-911-445</p>
        <p>purplemilycosmetic@gmail.com</p>
      </div>
    </div>
    <div class="footer-bottom">
      </div>
  </footer>
</template>

<style scoped>
.footer {
  background: #f8f8f8;
  padding: 40px 20px;
  border-top: 1px solid #ddd;
  color: #333;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  flex: 1;
  min-width: 200px;
  margin-bottom: 20px;
}

.footer-section h3 {
  color: #ff5733;
  font-size: 18px;
  margin-bottom: 15px;
}

.footer-section p {
  font-size: 14px;
  margin: 5px 0;
}

.footer-bottom {
  text-align: center;
  margin-top: 20px;
  font-size: 12px;
  color: #666;
}

@media (max-width: 768px) {
  .footer-content {
    flex-direction: column;
    text-align: center;
  }

  .footer-section {
    margin-bottom: 30px;
  }
}
</style>
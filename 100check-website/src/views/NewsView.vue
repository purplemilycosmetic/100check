<template>
  <div class="news-page">
    <!-- 標題區塊 -->
    <section class="hero-section">
      <h1>最新消息</h1>
      <p>掌握化妝品法規與安全資訊的最新動態！</p>
    </section>

    <!-- 縮圖區塊 -->
    <section class="news-section">
      <div class="news-grid">
        <div class="news-card" v-for="(news, index) in newsItems" :key="index">
          <router-link :to="'/news/' + news.id" class="news-link">
            <div class="news-thumbnail">
              <img :src="news.thumbnail" :alt="news.title" />
            </div>
            <div class="news-content">
              <h3>{{ news.title }}</h3>
              <p class="news-date">{{ news.date }}</p>
              <p class="news-description">{{ news.description }}</p>
            </div>
          </router-link>
          <button class="share-btn" @click="shareArticle(news)">分享</button>
        </div>
      </div>
    </section>

    <!-- 聯繫區塊 -->
    <section class="contact-section">
      <h2>需要更多資訊？</h2>
      <p>我們的專業團隊隨時為您提供諮詢，協助您了解更多法規與安全資訊。</p>
      <router-link to="/contact" class="primary-btn">聯繫我們</router-link>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      newsItems: [
        {
          id: '1',
          title: '美國法院暫時阻止特朗普全球關稅政策',
          description: '2025年5月29日，美國貿易法院裁定特朗普無權使用緊急權力實施全球關稅，影響化妝品進出口貿易。',
          thumbnail: 'https://via.placeholder.com/300x200?text=News+1',
          date: '2025-05-29',
          url: 'http://yourwebsite.com/news/1'
        },
        {
          id: '2',
          title: 'Nvidia財報亮眼，關稅不確定性未影響表現',
          description: 'Nvidia 2025年第一季度財報超出預期，儘管關稅政策存在不確定性，股價仍上漲6.4%。',
          thumbnail: 'https://via.placeholder.com/300x200?text=News+2',
          date: '2025-05-29',
          url: 'http://yourwebsite.com/news/2'
        },
        {
          id: '3',
          title: 'Meta在印度封鎖穆斯林新聞頁面',
          description: 'Meta應印度政府要求封鎖了一個熱門穆斯林新聞Instagram頁面，引發審查爭議。',
          thumbnail: 'https://via.placeholder.com/300x200?text=News+3',
          date: '2025-05-08',
          url: 'http://yourwebsite.com/news/3'
        }
      ]
    }
  },
  methods: {
    shareArticle(news) {
      const shareData = {
        title: news.title,
        text: news.description,
        url: news.url
      }

      if (navigator.share) {
        navigator.share(shareData)
          .then(() => console.log('文章分享成功'))
          .catch((error) => console.log('分享失敗', error))
      } else {
        // 備用方案：複製連結到剪貼簿
        navigator.clipboard.writeText(news.url)
          .then(() => {
            alert('文章連結已複製到剪貼簿：' + news.url)
          })
          .catch((error) => {
            console.log('複製失敗', error)
            alert('無法複製連結，請手動複製：' + news.url)
          })
      }
    }
  }
}
</script>

<style scoped>
.news-page {
  margin: 60px auto 20px;
  padding: 20px;
  max-width: 1200px;
}

/* 標題區塊 */
.hero-section {
  text-align: center;
  margin-bottom: 40px;
}

.hero-section h1 {
  color: #ff5733;
  font-size: 36px;
  margin-bottom: 20px;
}

.hero-section p {
  font-size: 18px;
  color: #333;
}

/* 縮圖區塊 */
.news-section {
  margin-bottom: 40px;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.news-card {
  background: #f8f8f8;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.news-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.news-thumbnail {
  width: 100%;
  padding-top: 66.67%; /* 3:2 比例 */
  position: relative;
  overflow: hidden;
}

.news-thumbnail img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  padding: 15px;
}

.news-content h3 {
  color: #ff5733;
  font-size: 18px;
  margin-bottom: 10px;
}

.news-date {
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
}

.news-description {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.share-btn {
  position: absolute;
  bottom: 15px;
  right: 15px;
  padding: 8px 16px;
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
}

.share-btn:hover {
  background: #e04e2d;
}

/* 聯繫區塊 */
.contact-section {
  text-align: center;
  padding: 40px 0;
}

.contact-section h2 {
  color: #ff5733;
  font-size: 28px;
  margin-bottom: 20px;
}

.contact-section p {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}

.primary-btn {
  padding: 10px 20px;
  background: #ff5733;
  color: white;
  border: none;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;
}

.primary-btn:hover {
  background: #e04e2d;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .news-grid {
    grid-template-columns: 1fr;
  }

  .news-content h3 {
    font-size: 16px;
  }

  .news-description {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .hero-section h1 {
    font-size: 28px;
  }

  .hero-section p {
    font-size: 16px;
  }

  .contact-section h2 {
    font-size: 24px;
  }
}
</style>
<template>
  <div class="adsense-container">
    <ins class="adsbygoogle"
         style="display:block"
         :data-ad-client="adClient"
         :data-ad-slot="adSlot"
         :data-ad-format="adFormat"
         data-full-width-responsive="true"></ins>
  </div>
</template>

<script>
export default {
  name: 'AdsenseAd',
  props: {
    adClient: { type: String, required: true }, // e.g., 'ca-pub-XXXXXXXXXXXXXXXX'
    adSlot: { type: String, required: true },   // e.g., 'YYYYYYYYYY'
    adFormat: { type: String, default: 'auto' }
  },
  mounted() {
    // 在元件掛載後，手動推送一個廣告請求
    // 這可以確保在路由切換後，新的廣告單元也能被載入
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("Adsense push error: ", e);
    }
  }
}
</script>
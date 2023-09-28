<template>
<tracker-header />
  <div class="about">
    <h1>This is an about page</h1>
    <!-- <el-button>Default</el-button> -->
    
  </div>


<trackerFooter />
</template>


<script>
// import { useRoute } from 'vue-router'

// import sideMenu from '@/components/sideMenu.vue'
import trackerHeader from '@/components/trackerHeader.vue'
import trackerFooter from '@/components/trackerFooter.vue'

// 导入数据
// import countries from '@/data/countries.json'


export default {
  components: { trackerHeader, trackerFooter}
}

</script>
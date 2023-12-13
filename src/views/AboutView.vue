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

import trackerHeader from '@/components/trackerHeader.vue'
import trackerFooter from '@/components/trackerFooter.vue'

export default {
  components: { trackerHeader, trackerFooter}
}

</script>
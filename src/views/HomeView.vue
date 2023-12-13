<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <trackerHeader />
      <el-main>
        <h1 class="home-title">Peace Agreement</h1>
        <h1 class="home-title">Implementation tracker</h1>
        <countrySearchBox />
        <introCards />        
      </el-main>

      <trackerFooter /> 

      <!-- <el-footer>Footer</el-footer> -->
    </el-container>
  </div>

</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import countrySearchBox from '@/components/countrySearchBox.vue'
import introCards from '@/components/introCards.vue'
import trackerHeader from '@/components/trackerHeader.vue'
import trackerFooter from '@/components/trackerFooter.vue'

export default {
  name: 'HomeView',
  components: {
    countrySearchBox, introCards, trackerHeader, trackerFooter
  }
}
</script>

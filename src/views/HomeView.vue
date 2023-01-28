<template>
  <div class="common-layout">
    <el-container direction="vertical">
      <trackerHeader />
      <el-main>
        <h1>Peace Agreement</h1>
        <h1>Implementation tracker</h1>
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

<style>
h1 {
  font-size: 40px;
}

.common-layout .el-header {
  background-color: #FAFAFA;
  padding: 10px 20px;
  height: auto;
}

.common-layout .el-main {
  background-color: white;
}

.common-layout .el-footer {
  background-color: #FAFAFA;
}

.header-links {
  float: right;
}

.pp-logo {
  display: inline-block;
  height: 50px;
}

.header-logo {
  float: left;
}

</style>
<template>
    <el-header>
        <el-row align="middle">
          <el-col :span="12">
            <div class="header-logo">
              <img 
                :src="require('../assets/PeaceRep-Logo-480x151.png')"
                @click="home" 
                class="pp-logo"/>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="header-links">
              <router-link to="/about">About our project</router-link>
              </div>
          </el-col>
        </el-row>
      </el-header>
</template>

<script>
export default ({
    methods: {
        home(){
            this.$router.push('/');
        }
    }
})
</script>


<style scoped>
.el-header {
  background-color: #FAFAFA;
  padding: 10px 20px;
  height: auto;
}
</style>
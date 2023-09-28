<template>
<section class="intro-cards">
  <el-row class="row-bg" justify="center" :gutter="30">
    <el-col
      v-for="o in 2"
      :key="o"
      :span="8"
      
    >
      <el-card :body-style="{ padding: '0px' }" shadow="hover">
        <div class="image-holder">
        <img :src="require('../assets/pax.png')" class="image"/>
        </div>
        <div style="padding: 14px; ">
          <span class="card-title">Introduction to PA-X dataset</span>
        </div>
      </el-card>

    </el-col>
  </el-row>
</section>
</template>
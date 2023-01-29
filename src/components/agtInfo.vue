<template>
    <div class="info-wrapper">
        <p>{{ this.agtDate }}</p>
        <el-link :href="this.toLink">See full text in PA-X</el-link>
        <p>{{ this.toDescription }}</p>
    </div>

    <el-row justify="center" class="metric-wrapper">
        <el-col :span="6">
            <p class="metric-num">{{ this.provisionCounter }}</p>
            <p class="metric-des">agreement provisions <br /> relating to topics</p>
        </el-col>

        <el-col :span="6">
            <p class="metric-num">{{ this.reportCounter }}</p>
            <p class="metric-des">references to <br /> implementation</p>
        </el-col>
    </el-row>
    
</template>


<script>
export default {
    props: ['provisionCounter', 'reportCounter', 'agtDate', 'toLink', 'toDescription']
}
</script>


<style scoped>
.metric-wrapper {
  margin: 20px 400px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.info-wrapper {
    margin: 0px 400px;
}

.metric-num {
    font-size: 30px;
    margin: 0px;
}

.metric-des {
    font-size: 14px;
    margin-top: 0px;
}


</style>
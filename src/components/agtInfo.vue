<template>
    <div class="info-wrapper">
        <div style="display: flex; flex-direction: row;">
            <p>{{ this.agtDate }}</p>
            <el-link :href="this.toLink" :underline="false" target="_blank" style="margin-left: 10px;">See full text in PA-X</el-link>
        </div>
        <p>{{ this.toDescription }}</p>
    </div>

    <el-row justify="start" class="metric-wrapper">
        <el-col :span="4" class="flex-metrics">
            <p class="metric-num">{{ this.provisionCounter }}</p>
            <p class="metric-des">Agreement provisions <br /> relating to topics</p>
        </el-col>

        <el-col :span="4" class="flex-metrics">
            <p class="metric-num">{{ this.reportCounter }}</p>
            <p class="metric-des">Instances of <br /> implementation</p>
        </el-col>

        <el-col :span="4" class="flex-metrics">

            <el-popover
            placement="right-start"
            :width="400"
            trigger="hover"
            >
            <template #reference>
                <div class="flex-metrics mouse-hover">
                    <p class="metric-num"><el-icon><InfoFilled /></el-icon></p>
                    <p class="metric-des">Hover for <br /> more information</p>
                </div>
            </template>
            
            <div v-html="combinedParagraphs" style="white-space:normal; word-break: break-word; word-wrap: break-word;"></div>
           
            </el-popover>
            
        </el-col>
    </el-row>
    
</template>


<script>
export default {
    props: ['provisionCounter', 'reportCounter', 'agtDate', 'toLink', 'toDescription'],

    data() {
        return {
            info1: 'This tracker illustrates a range of topics that have been extracted from in past peace agreements, and any instances of their implementation found in a variety of reports. This data has been constructed using semantic similarity models to trace similar language of the agreement provision in a range of status update reports from reliable sources.',
            info2: "Implementation instances have been labelled with 'positive', 'negative' or 'neutral' to indicate if the implementation language shows positive or negative implementation. Please note that this is generated from Natural Language Processing, and the sentiment is to be used as a proxy indicator to find instances of implementation across a range of reports, and does not necessarily mean that the provision has been implemented or not."
        }
    },

    computed: {
        combinedParagraphs() {
        return `${this.info1}<br/>${this.info2}`;
        }
  }
}
</script>


<style scoped>
p {
    padding: 0px;
    margin: 5px 0px;
}
.metric-wrapper {
  margin: 10px 0px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.info-wrapper {
    margin: 0px 0px;
}

.metric-num {
    font-size: 34px;
    margin: 5px;
}

.metric-des {
    font-size: 14px;
    margin: 5px;
}

/deep/ .info-card .el-card__body {
    padding: 5px;
}

.flex-metrics {
    display: flex; 
    flex-direction: row; 
    align-items: center;
}

.mouse-hover :hover {
    cursor: pointer;
}


</style>
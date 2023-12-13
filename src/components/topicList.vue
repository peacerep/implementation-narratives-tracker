<template>
    <div class="topic-wrapper">

        <el-collapse class="topic-sub-wrapper">
            <el-collapse-item class="topic-title">
            <template #title >
                <div class="title-container">
                    <h3 class="title-line"> {{ this.topicsCount }} Topics found in this agreement:</h3>
                    <p class="title-line">Expand and select to show any implementation intances</p>
                </div>
            </template>
            <el-link
                :underline="false"
                :class="{changeStyle:changeStyleIndex == index}"
                class="topic-link"
                v-for="(topic, index) in agtTopicList" 
                :key="topic"
                @click="emitTopic(topic), changeStyle(index)">
                <el-icon><CaretRight /></el-icon>{{ topic }}
            </el-link>
            </el-collapse-item>
        </el-collapse>

    </div>
</template>

<script>

export default {
    props: ['agtTopicList', 'selTopic'],

    data(){
        return{
            changeStyleIndex: '',
            topicsCount: 0
        }
    },

    methods: {
        emitTopic(topic){
            this.$emit('changeTopic', topic)
        },

        changeStyle(index){
            this.changeStyleIndex = index
            // console.log(this.changeStyleIndex)
        }
    },

    mounted() {
        // console.log("topic list", this.agtTopicList)
        this.topicsCount = this.agtTopicList.size
        // console.log("size", this.topicsCount)

        //if user enter agt page by clicking the topic in counrty page, set the selected topic style here
        let topicIndex = Array.from(this.agtTopicList).indexOf(this.selTopic);
        this.changeStyleIndex = topicIndex;

        // console.log("topic box", this.topicsCount, this.changeStyleIndex)
    }
}

</script>


<style scoped>
::v-deep .el-collapse {
    padding: 0px 10px;
}
::v-deep .el-collapse .el-collapse-item {
  background-color: #F1F1F1
}
::v-deep .el-collapse-item .el-collapse-item__header{
  background-color: #F1F1F1;
  height: fit-content;
}
::v-deep .el-collapse-item .el-collapse-item__wrap {
  background-color: #F1F1F1
}

</style>
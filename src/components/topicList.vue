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
        console.log(this.agtTopicList)
        this.topicsCount = this.agtTopicList.length

        //if user enter agt page by clicking the topic in counrty page, set the selected topic style here
        let topicIndex = this.agtTopicList.indexOf(this.selTopic)
        this.changeStyleIndex = topicIndex
    }
}

</script>


<style scoped>
.topic-wrapper {
    padding: 20px 5%;
    /* background-color: #DDE4E8; */
}

.topic-sub-wrapper {
    text-align: left;
    background-color: #F1F1F1
}

.topic-title {
    background-color: transparent;
    font-weight: medium;
    font-size: 18px;
    margin-top: 0px;
}

/deep/ .el-collapse {
    padding: 0px 10px;
}
/deep/ .el-collapse .el-collapse-item {
  background-color: #F1F1F1
}
/deep/ .el-collapse-item .el-collapse-item__header{
  background-color: #F1F1F1;
  height: fit-content;
}
/deep/ .el-collapse-item .el-collapse-item__wrap {
  background-color: #F1F1F1
}


.changeStyle {
    color: black;
    font-weight: 600;
}

.el-link {
    margin: 5px 0px;
    display: block;
}

.title-line {
    /* white-space: pre-line; */
    padding: 0px;
    margin: 5px 0px 0px 0px;
    height: 30px;
    line-height: 30px;
  }

.title-line:last-child {
    /* white-space: pre-line; */
    height: 20px;
    line-height: 20px;
    margin-bottom: 5px;
}

  .title-container {
    display: flex;
    flex-direction: column;
    /* height: 60px; */
  }
</style>
<template>
    <div class="topic-wrapper">

        <!-- <div class="topic-sub-wrapper">
            <p class="topic-title">Topics Covered</p>
            <el-link
                :underline="false"
                :class="{changeStyle:changeStyleIndex == index}"
                class="topic-link"
                v-for="(topic, index) in agtTopicList" 
                :key="topic"
                @click="emitTopic(topic), changeStyle(index)">
                <el-icon><CaretRight /></el-icon>{{ topic }}
            </el-link>
        </div> -->

        <el-collapse class="topic-sub-wrapper">
            <el-collapse-item title="Select a topic below found in this agreement to show any implementation instances:" class="topic-title">
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
    props: ['agtTopicList'],

    data(){
        return{
            changeStyleIndex: ''
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
  background-color: #F1F1F1
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
</style>
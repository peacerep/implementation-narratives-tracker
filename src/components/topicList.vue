<template>
    <div class="topic-wrapper">
        <el-row justify="center">
            <el-col :span="18">
                <div class="topic-sub-wrapper">
                    <p class="topic-title">Topics Covered</p>
                    <el-link
                        :underline="false"
                        :class="{changeStyle:changeStyleIndex == index}"
                        v-for="(topic, index) in agtTopicList" 
                        :key="topic"
                        @click="emitTopic(topic), changeStyle(index)">
                        <el-icon><CaretRight /></el-icon>{{ topic }}
                    </el-link>
                
                </div>
            </el-col>
        </el-row>
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
            console.log(this.changeStyleIndex)
        }
    }
}

</script>


<style scoped>
.topic-wrapper {
    padding: 20px 100px;
    background-color: #DDE4E8;
}

.topic-sub-wrapper {
    text-align: left;
}

.topic-title {
    font-weight: medium;
    font-size: 18px;
}

.changeStyle {
    color: black;
    font-weight: 600;
}

.el-link {
    margin: 10px 0px;
    display: block;
}
</style>
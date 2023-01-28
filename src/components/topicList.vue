<template>
    <div class="topic-wrapper">
        <el-row justify="center">
            <el-col :span="18">
                <div class="topic-sub-wrapper">
                    <p class="topic-title">Topics Covered</p>
                    <el-link
                        :underline="false"
                        v-for="topic in agtTopicList" :key="topic"
                        @click="emitTopic(topic)">
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

    methods: {
        emitTopic(topic){
            this.$emit('changeTopic', topic)
        }
    }
}

</script>


<style scoped>
.topic-wrapper {
    padding: 20px 400px;
    background-color: #DDE4E8;
}

.topic-sub-wrapper {
    text-align: left;
}

.topic-title {
    font-weight: medium;
    font-size: 18px;
}

.el-link {
    margin: 10px 0px;
    display: block;
}
</style>
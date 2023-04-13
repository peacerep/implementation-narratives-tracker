<template>
    <div class='doc-list' v-for='(agreement, index) in dataListDisplayed' :key='index'>
        <el-link
            :underline="false" 
            class="agt-link" 
            @click="toAgtView(agreement)">{{ agreement.agt }}</el-link>
        <p class="agt-time">Signed date: {{ agreement.date}}</p>

        <el-button text class="topic-button" @click="showTopics(index)">
            <el-icon v-if="openedIndex === index"><ArrowUpBold /></el-icon>
            <el-icon v-else><ArrowDownBold /></el-icon>
            <p style="padding-left: 5px; font-weight: 800;">{{ agreement.topics.length }} topics found</p>
        </el-button>

        <div class="topic-box" v-show="openedIndex === index">
            <el-link class="topic-text" :underline="false"
            v-for="topic in agreement.topics" :key="topic"  
            @click="toAgtView_topic(agreement, topic)">{{ topic }}</el-link>
        </div>
    </div>
</template>

<script>
export default ({

    props: ["dataListDisplayed", "title"],

    data() {
        return {
            country:  this.title,
            openedIndex: -1,
        }
    },

    methods: {
        toAgtView(agreement) {
            this.$router.push({
                name: `agreement`,
                query: {
                    title: `${this.country}`,
                    id: `${agreement.id}`,
                    agtName: `${agreement.agt}`,
                    agtDate: `${agreement.date}`,
                    topic: `${agreement.topics[0]}`
                }
            })
        },

        toAgtView_topic(agreement, topic) {
            this.$router.push({
                name: `agreement`,
                query: {
                    title: `${this.country}`,
                    id: `${agreement.id}`,
                    agtName: `${agreement.agt}`,
                    agtDate: `${agreement.date}`,
                    topic: `${topic}`
                }
            })
        },

        showTopics(index) {
            this.openedIndex = this.openedIndex === index ? -1 : index;
        }
    },

    mounted() {
        console.log(this.dataListDisplayed)
    }
})
</script>

<style scoped>
.agt-time {
    font-size: 1em;
    padding:0px 0px;
    margin:5px 0px;
}

.doc-list {
    margin: 30px 0px;
    padding: 20px;
    border-bottom: 1px solid lightgrey;
}

.title {
    padding: 5px 0px;
}

.agt-link {
    font-size: 1.3em;
    color: black;
    padding:0px 0px;
    margin:0px 0px;
}

.agt-link:hover {
    color: #409eff;
}

.topic-box {
    background-color: aliceblue;
    padding: 10px;
    margin: 0px 0px 10px 0px;
    width: 75%;
}

.topic-text {
    font-size: 14px;
    padding: 0px;
    margin: 5px;
}

.el-button{
    font-size: 14px;
    font-weight: 500;
}

.el-link {
    display: block;
}
</style>
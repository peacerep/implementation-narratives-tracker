<template>
    <div class="title">
        <h2>{{ this.displayedTopic }}</h2>
        <p>{{ this.topicProvisionCounter }} provisions</p>
    </div>

    <div class="tracker">

    <el-row 
        justify="center" 
        class="section-wrapper"
        v-for="provision in this.selectedProvisions"
        :key="provision">

        <el-col :span="10">
            <div class="text-container">
                <h2>Provision {{ provision.number }}</h2>
                <h3>Score: {{ provision.score }}</h3>
                <h4> {{ provision.text }} </h4>
            </div>
        </el-col>

        <hr />

        <el-col :span="10">
            <div 
                class="text-container"
                v-for="report in provision.reports"
                :key="report">
                <h2>implementation {{ report.id }}</h2>
                <p>{{ report.name }}</p>
                <div
                    v-for="segment in report.segments"
                    :key="segment">
                    <p>Score: {{ segment.score }}</p>
                    <p>{{ segment.text }}</p>
                </div>
            </div>
        </el-col>
    </el-row>

</div>

    
</template>

<script>
export default ({
    props: ['displayedTopic', 'topicProvisionCounter', 'selectedProvisions'],

    setup(props) {
        console.log('初始', props.selectedProvisions)
    }
})
</script>


<style scoped>
h1 {
    font-size: 30px;
    margin: 60px 0px 0px 0px;
}

.title {
    text-align: center;
    margin: 40px 300px 10px 300px;
}

.text-container {
    text-align: left;
    margin: 0px 00px;
}

.tracker {
    margin: 0px 100px;
}

.section-wrapper {
    margin: 0px 50px;
}
</style>
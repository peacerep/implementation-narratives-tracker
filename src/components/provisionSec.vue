<template>
    <div class="tracker">
        <div class="title">
            <h2>{{ this.displayedTopic }}</h2>
            
        </div>
        <!-- heading for the provisions/implementation -->
        <el-row justify="center" :gutter="60" class="section-wrapper">
            <el-col :span="12">
                <div class="text-container">
                <h3>Agreement extracts</h3>
                <p class="counters">{{ this.topicProvisionCounter }} records</p>
                </div>
            </el-col>

            <el-col :span="12">
                <div class="text-container">
                <h3>Implementation reports</h3>
                <p class="counters">{{ this.reportCounter }} reports</p>

                <!-- <p>Chronological order:</p> -->
                <el-radio-group 
                    v-model="reverse" 
                    @change="reverseList()"
                    class="radio-group">
                    <el-radio label="true">Latest</el-radio>
                    <el-radio label="false">Oldest</el-radio>
                </el-radio-group>

                </div>
            </el-col>
        </el-row>

    <!-- trying the collapse -->
    <el-row justify="center" :gutter="60" class="section-wrapper">
        <el-col :span="12">
            <div 
                class="text-container"
                v-for="(provision, index) in this.selectedProvisions"
                :key="provision">
                <div
                    class="provision-container"
                    :provision = provision>
                    <p 
                    class="agt-extracts"
                    :class="{changeStyle:changeStyleIndex == index}"
                    @click="showImplementation(provision), changeStyle(index)"> 
                    ...{{ provision.text }}... </p>
                    <el-divider class="provision-divider"/>
                </div>
            </div>
        </el-col>

        <el-col :span="12"
        style="height: 80vh; overflow: auto;">
            <el-timeline :reverse="reverse" class="timeline">
                <el-timeline-item
                    v-for="report in this.displayed"
                    :key="report"
                    :timestamp="report.date"
                    placement="top" 
                    >
                <el-card shadow="hover">
                <h3>{{ report.name }}</h3>
                <p class="repo-source">Source:{{ report.label }}</p>
                <div
                    v-for="segment in report.segments"
                    :key="segment"
                    class="segment-container"
                    >
                    <div >
                    <el-row class="segment-wrapper">
                        <el-col :span="22">
                            <p class="segment-text">{{ segment.text }}</p>
                        </el-col>
                        <el-col :span="2">
                            <div v-if="segment.polarity > 0">
                            <el-tag effect="plain" type="success" size="small" round>
                            positive
                            </el-tag></div>
                        <div v-else-if="segment.polarity < 0">
                            <el-tag effect="plain" type="danger" size="small" round>
                            negative
                            </el-tag></div>
                        <div v-else>
                            <el-tag effect="plain" type="info" size="small" round>
                            neutral
                            </el-tag></div>
                        </el-col>
                    </el-row>
                    
                    </div>
                    </div>
                
                <!-- <el-divider /> -->
                </el-card>
                </el-timeline-item>
            </el-timeline>
        </el-col>
         
    </el-row>
</div>

    
</template>

<script>

export default ({
    props: ['displayedTopic', 'topicProvisionCounter', 'selectedProvisions'],

    data() {
        return {
            reverse: "",
            displayed: [],
            reportDate: "",
            reportCounter: 0,
            provisionClicked: '',
            changeStyleIndex: ''
        }
    },

    methods: {
        showImplementation(provision) {
            this.provisionClicked = provision
            let repoID = provision.number
            let displayedReports = []

            for (let item of this.selectedProvisions) {
                if ( repoID == item.number) {
                    displayedReports = item.reports
                }
            }
            this.displayed = displayedReports
            this.reportCounter = displayedReports.length
        },

        changeStyle(index){
            this.changeStyleIndex = index
        },

        reverseList() {
            if(this.reverse) {
                this.displayed = this.displayed.reverse()
            }
        }
        
    },

    mounted(){
       this.showImplementation(this.selectedProvisions[0])
    },

    beforeUpdate(){
        //update default displayed reports when topic changed
        this.showImplementation(this.selectedProvisions[0])
        this.showImplementation(this.provisionClicked)
        this.changeStyle(0)
    }
})
</script>


<style scoped>
h1 {
    font-size: 30px;
    margin: 60px 0px 0px 0px;
}

h3 {
    padding: 0px;
    margin: 0px;
}
.title {
    text-align: center;
    margin: 40px 200px 50px 200px;
}

.counters {
    padding: 10px 0px;
    margin: 0px;
}

.radio-group {
    padding: 0px 0px 10px 0px;
}

.text-container {
    text-align: left;
    margin: 0px 00px;
}

.provision-divider {
    margin: 5px 0px;
}

.tracker {
    margin: 0px 100px 100px 100px;
}

.section-wrapper {
    margin: 0px 50px;
}

.segment-text {
    margin: 0px 0px 0px 0px;
    padding: 0px;
}

.segment-container {
    margin-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    border-bottom: 1.3px dashed #CFCFCF;
}

.segment-container:nth-last-child(1) {
    border-bottom: none;
}

.segment-divider {
    margin: 10px 0px;
    border-style: dashed;
}


.timeline {
    text-align: left;
    padding: 0px;
    margin: 0px;
}
.agt-extracts {
    color: darkgray;
    font-size: 16px;
    font-weight: 400;
}

.agt-extracts:hover {
    color: grey;
    cursor: pointer;
}
.changeStyle {
    color: black;
    font-weight: 600;
}

.repo-source {
    margin: 0px;
    padding-top: 10px;
}
</style>
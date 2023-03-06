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
            <!-- loop the provisions -->
            <div class="text-container"
                v-for="(provision, index) in this.selectedProvisions"
                :key="provision">
                <div :provision = provision class="provision-container">

                    <div @click="showImplementation(provision), changeStyle(index), showDrawerButton(index)"> 
                        <p class="agt-extracts"
                            :class="{changeStyle:changeStyleIndex == index}">
                        ...{{ provision.text }}... </p>

                        <el-button 
                            round size="small" 
                            v-show="this.buttonVisible == index"
                            @click="openDrawer(provision.number, index)"
                            style="margin-bottom: 10px;">
                            locate in agreement
                        </el-button>
                    </div>

                    <el-divider class="provision-divider"/>
                </div>      
            </div>
        </el-col>

        <el-col :span="12"
        style="height: 80vh; overflow: auto;">
            <el-timeline :reverse="reverse" class="timeline">
                <el-timeline-item
                    v-for="(report, index) in this.displayed"
                    :key="report"
                    :timestamp="report.date"
                    placement="top" 
                    >
                <el-card 
                    shadow="hover"
                    @mouseover="this.reportbuttonVisible = index" @mouseleave="this.reportbuttonVisible = 9999">
                    <h3>{{ report.name }}</h3>
                    <p class="repo-source">Source:{{ report.label }}</p>

                    <el-button 
                        round size="small" 
                        v-show="this.reportbuttonVisible == index"
                        @click="openReportDrawer(report.id)">
                        open full report
                    </el-button>

                    <div
                        v-for="segment in report.segments"
                        :key="segment"
                        class="segment-container"
                        >
                        <div>
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
    
    <!-- Agreement Full Text -->
    <el-drawer
        v-model="docDrawerOpen"
        :direction="direction"
        title="Agreement full text"
        size="45%"
        >
        <docDrawer ref="docDrawer" v-bind="$attrs" :id="this.segement_id" :docDrawerOpen="docDrawerOpen" />
    </el-drawer>

    <!-- Report Full Text -->
    <el-drawer
        v-model="reportDrawerOpen"
        title="Report full text"
        size="45%"
        >
        <reportDrawer :report="this.selectedReport" :reportDrawerOpen="reportDrawerOpen" :allIDs="allIDs" />
    </el-drawer>

</div>
</template>

<script>
import docDrawer from "@/components/docDrawer.vue"
import reportDrawer from "@/components/reportDrawer.vue"

export default ({
    components: { docDrawer, reportDrawer },
    props: ['displayedTopic', 'topicProvisionCounter', 'selectedProvisions'],

    data() {
        return {
            reverse: "",
            displayed: [],
            reportDate: "",
            reportCounter: 0,
            provisionClicked: '',
            changeStyleIndex: '',

            //for the drawer
            buttonVisible: 0,
            docDrawerOpen: false,
            doc_id: 0,
            segement_id: 0,
            direction: 'ltr',

            //for the report drawer
            reportbuttonVisible: 999,
            reportDrawerOpen: false,
            selectedReport: [],
            allIDs: []
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
            // console.log("TOPICS USED", this.displayed)
        },

        changeStyle(index){
            this.changeStyleIndex = index
        },

        showDrawerButton(index) {
            this.buttonVisible = index
        },

        reverseList() {
            if(this.reverse) {
                this.displayed = this.displayed.reverse()
            }
        },

        openDrawer(id, index) {
            this.docDrawerOpen = true,
            this.segement_id = id
            console.log(index)
        },

        openReportDrawer(reportId) {
            // console.log("CLICK VAR", reportId)
            this.reportDrawerOpen = true

            // this.selectedReport = report
            for (let report of this.displayed) {
                // console.log("REPORT", report)
                if ( reportId == report.id ) {
                    this.selectedReport = report
                }
            }

            var segmentIds = []
            for ( let segment of this.selectedReport.segments) {
                segmentIds.push(segment.number) 
            }
            this.allIDs = segmentIds
        }
    },

    mounted(){
       this.showImplementation(this.selectedProvisions[0])
    },

    watch: {
        'displayedTopic': function(){
            // set selected provision default when topic changes
            this.showImplementation(this.selectedProvisions[0])
            this.showImplementation(this.provisionClicked)
            this.changeStyle(0)
            this.showDrawerButton(0)
        }
    },

    created() {
        
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

/deep/ .el-drawer__body {
    padding-top: 0px;
}


</style>
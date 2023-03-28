<template>
    <div class="tracker">
        <div class="title">
            <p style="margin-bottom: 0px;">Selected Topic:</p>
            <h2 style="margin-top: 10px; font-style: italic;">{{ this.displayedTopic }}</h2>
        </div>
        <!-- heading for the provisions/implementation -->
        <el-row justify="center" :gutter="60" class="section-wrapper">
            <el-col :span="12">
                <div class="text-container">
                    <h3>Agreement Provisions</h3>
                    <p class="counters" style="font-style: italic;">Click provision to view</p>
                    <p class="counters">{{ this.topicProvisionCounter }} records</p>
                </div>
            </el-col>

            <el-col :span="12">
                <div class="text-container">
                <h3>Implementation Instances</h3>
                <p class="counters">{{ this.reportCounter }} instances</p>
                <el-radio-group 
                    v-model="reverse" 
                    @change="reverseList()"
                    class="radio-group">
                    <el-radio label="1">Latest</el-radio>
                    <el-radio label="2">Oldest</el-radio>
                </el-radio-group>
                </div>
            </el-col>
        </el-row>

    <!-- trying the collapse -->
    <el-row justify="center" :gutter="30" class="section-wrapper">
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
                            Locate in Agreement
                        </el-button>
                    </div>

                    <el-divider class="provision-divider"/>
                </div>      
            </div>
        </el-col>

        <el-col :span="12"
        style="height: 80vh; overflow: auto;">
            <div id="if-empty"></div>
            <el-timeline :reverse="reverse" class="timeline">
                <el-timeline-item
                    v-for="(report, index) in this.displayed"
                    :key="report"
                    :timestamp="report.newTimeStamp"
                    placement="top" 
                    >
                <el-card 
                    shadow="hover"
                    @mouseover="this.reportbuttonVisible = index" @mouseleave="this.reportbuttonVisible = 9999">
                    <h3>{{ report.name }}</h3>

                    <div class="source-wrapper">
                        <p class="repo-source">Source: {{ report.label }}</p>
                        <el-button 
                            round size="small" 
                            v-show="this.reportbuttonVisible == index"
                            @click="openReportDrawer(report.id)">
                            Open Full Report
                        </el-button>
                    </div>

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
            reverse: '1',
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

            let agtDate = document.querySelector(".info-wrapper p").innerHTML
            agtDate = new Date(agtDate)
            
            for (let report of displayedReports) {
                let repoDate = report.date
                repoDate = new Date(repoDate)
                const monthDiff = repoDate.getMonth() - agtDate.getMonth()
                const yearDiff = repoDate.getYear() - agtDate.getYear()
                const difference = monthDiff + yearDiff * 12;

                let timeDif, month, year = ''
                let yearNum, monthNum = 0

                yearNum = Math.floor(difference / 12)
                if ( yearNum == 1) { 
                    year = yearNum + ' year ' 
                }
                else { 
                    year = yearNum + ' years ' 
                }

                monthNum = difference - yearNum * 12
                if ( monthNum == 1) { 
                    month = monthNum + ' month '
                 }
                else if (monthNum == 0) { 
                    month = ''
                }
                else { 
                    month = monthNum + ' months ' 
                }

                if (difference >= 12) {
                    timeDif = year + month + 'after agreement'
                }
                else if ( difference > 0 && difference < 12) {
                    timeDif = month + 'after agreement'
                }
                else {
                    const dayDiff = repoDate.getDate() - agtDate.getDate()
                    timeDif = dayDiff + ' days after agreement'
                }

                report['newTimeStamp'] = report.date + '  |  ' + timeDif
                
            }
            this.displayed = displayedReports
            this.reportCounter = displayedReports.length

            const emptyDiv = document.querySelector("#if-empty")
            if (this.reportCounter == 0) {
                emptyDiv.innerHTML = '<p>We found no instances of implementation found for this provision topic.</p>';
            }
            else {
                emptyDiv.innerHTML = ''
            }
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
            this.reportDrawerOpen = true

            for (let report of this.displayed) {
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
       this.reverseList()
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

h2 {
    font-size: 24px;
}

h3 {
    padding: 0px;
    margin: 0px;
}
.title {
    text-align: center;
    margin: 40px 50px 20px 50px;
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
    margin: 0 5%;
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
    padding: 5px 5px 5px 0px;
}

/deep/ .el-drawer__body {
    padding-top: 0px;
}

.source-wrapper {
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

</style>
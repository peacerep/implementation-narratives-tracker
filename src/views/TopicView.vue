<template>
    <tracker-header />

    <div class="agt-head">
        <div class="breadcrumb">
            <el-link class="country-title" @click="home">Home</el-link>
            <el-icon><CaretRight /></el-icon>
            <el-link id="drawer" class="country-title" @click="toCountryView(this.countryName)">{{ this.countryName }} Topics</el-link>
            <el-icon><CaretRight /></el-icon>
            <el-link class="country-title current-page">{{ this.topicCategory }}</el-link>
            <el-icon><CaretRight /></el-icon>
            <el-link class="country-title current-page">{{ this.topicSubcategory }}</el-link>
        </div>

        <h1>{{ this.topicText }}</h1>
        <p>Click agreement to explore implementation.</p>
    </div>


    <div class="tracker">
        <!-- agreement loop -->
        <div class="section-wrapper"
            v-for="agt in sortedAgreements"
            :key="agt.id">
            <div @click="toggleAgreement(agt)" class="agreement-container">
                <div class="date-column">
                    <p class="date-column-ddmm">{{ formatDate(agt.date).dayMonth }}</p>
                    <p class="date-column-yyyy">{{ formatDate(agt.date).year }}</p>
                </div>
                <div class="info-column">
                    <h2 class="agt-in-topic">{{ agt.name }}</h2>
                    <p>{{ getPaxData(agt.id).agtDescription }}</p>
                </div>
            </div>

            
            <div v-if="selectedAgreementId === agt.id" class="provision-container">
                <el-divider></el-divider>
                <el-row justify="center" :gutter="15" class="section-wrapper">
                    <el-col :span="12">
                        <h3>Agreement Provisions</h3>
                        <p class="counters" style="font-style: italic;">Click provision to view/fold</p>
                        </el-col>
                    <el-col :span="12">
                        <h3>Implementation Instances</h3>
                        <p class="counters" style="font-style: italic;">Since agreement signed</p>
                    </el-col>
                </el-row>

                <div class="provision" v-for="(provision, index) in agt.provisions" :key="provision">
                    <el-row justify="center" :gutter="15" class="section-wrapper">
                    <el-col :span="12">
                        <!-- <h3>Provisions</h3> -->
                        <div class="text-container">
                            <p class="agt-extracts"
                                :class="{changeStyle:changeStyleIndex == index}"
                                @click="toggleProvision(provision.number)">
                                ...{{ provision.text }}...
                            </p>
                            <el-button 
                                round size="small"
                                v-if="selectedProvisionNumber === provision.number"
                                @click="openDrawer(provision.number, selectedAgreementId, agt.name)">
                                Locate in Agreement
                            </el-button>
                        </div>
                    </el-col>

                    <el-col :span="12" style="padding: 20px 0px;">
                        <!-- <h3>Reports</h3> -->
                        <el-scrollbar max-height="80vh" v-if="selectedProvisionNumber === provision.number">
                            <el-timeline class="timeline">
                                <el-timeline-item
                                    v-for="report in provision.reports"
                                    :key="report"
                                    :timestamp="computeTimeDif(report.date, agt.date)"
                                    placement="top">
                                    <el-card>
                                        <h3>{{ report.name }}</h3>
                                        <div class="source-wrapper">
                                            <p class="repo-source">Source: {{ report.organisation }}</p>
                                            <el-button 
                                                round size="small" style="margin-left: 10px;"
                                                @click="openReportDrawer(report.id, report)">
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
                                    </el-card>
                                </el-timeline-item>
                            </el-timeline>
                        </el-scrollbar>
                    </el-col>
                    </el-row>
                </div>
            </div>
        </div>
    </div>

    <!-- Agreement Full Text -->
    <el-drawer
    v-model="docDrawerOpen"
    :direction="direction"
    title="Agreement full text"
    size="45%"
    >
        <docDrawerTopic ref="docDrawer" :agtId="this.selectedAgreementId" :agtName="this.clickedAgt" :id="this.segement_id" :docDrawerOpen="docDrawerOpen" :country="this.countryName"/>
    </el-drawer>

    <!-- Report Full Text -->
    <el-drawer
        v-model="reportDrawerOpen"
        title="Report full text"
        size="45%"
        >
        <reportDrawerTopic :report="this.selectedReport" :reportDrawerOpen="reportDrawerOpen" :allIDs="allIDs" :country="this.countryName" />
    </el-drawer>
    
    
    <trackerFooter />
</template>
    
<script>
import { useRoute } from 'vue-router'

import trackerHeader from '@/components/trackerHeader.vue'
import trackerFooter from '@/components/trackerFooter.vue'
import docDrawerTopic from '@/components/docDrawerTopic.vue'
import reportDrawerTopic from '@/components/reportDrawerTopic.vue'

import countries from '@/data/countries.json'
import PAX from '@/data/agt_description_links.json'


export default {
    components: { trackerHeader, trackerFooter, docDrawerTopic, reportDrawerTopic},

    data() {
        return {
            changeStyleIndex: '',
            provisionClicked: '',
            displayed: [],
            reportDate: "",
            reportCounter: 0,

            selectedAgreementId: null,
            selectedProvisionNumber: null,
            hoveredReportID: null,

            //for the drawer
            buttonVisible: 0,
            docDrawerOpen: false,
            doc_id: 0,
            segement_id: 0,
            direction: 'ltr',
            agt_id: 0,
            clickedAgt: "",

            //for the report drawer
            reportbuttonVisible: 999,
            reportDrawerOpen: false,
            selectedReport: [],
            allIDs: []
        }
    },

    methods: {
        home(){
            this.$router.push('/');
        },

        toCountryView(country) {
            this.$router.push({
                name: `country`,
                query: {
                    title: `${country}`
                }
            })
        },

        changeStyle(index){
            this.changeStyleIndex = index
        },

        toggleAgreement(agt) {
            if (this.selectedAgreementId === agt.id) {
                this.selectedAgreementId = null; // fold the currently open agreement
            } else {
                this.selectedAgreementId = agt.id; 
            }
        },

        toggleProvision(provisionNumber) {
            if (this.selectedProvisionNumber === provisionNumber) {
                this.selectedProvisionNumber = null;
            } else {
                this.selectedProvisionNumber = provisionNumber;
                // console.log("click", provisionNumber)
            }
        },

        formatDate(dateInt) {
            const dateStr = String(dateInt);
            const year = dateStr.substring(0, 4);
            const month = parseInt(dateStr.substring(4, 6), 10) - 1; 
            const day = dateStr.substring(6, 8);

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const monthName = monthNames[month];

            return {
                dayMonth: `${day} ${monthName}`,
                year: year
            };
        },

        getPaxData(agtID) {
            let paxLink = '';
            let agtDescription = '';

            for (let item of PAX) {
                if (agtID == item.agreementID) {
                    paxLink = item.hyperlink_pax;
                    agtDescription = item.description;
                    break;
                }
            }

            return {
                paxLink: paxLink,
                agtDescription: agtDescription
            };
        },

        computeTimeDif(reportDateInt, agtDateInt) {
            const convertToDate = (dateInt) => {
                const dateStr = String(dateInt);
                const year = dateStr.substring(0, 4);
                const month = dateStr.substring(4, 6) - 1;
                const day = dateStr.substring(6, 8);
                return new Date(year, month, day);
            };

            const repoDate = convertToDate(reportDateInt);
            const agtDate = convertToDate(agtDateInt);

            const monthDiff = repoDate.getMonth() - agtDate.getMonth();
            const yearDiff = repoDate.getFullYear() - agtDate.getFullYear();
            const difference = monthDiff + yearDiff * 12;

            let timeDif, month, year = '';
            let yearNum, monthNum = 0;

            yearNum = Math.floor(difference / 12);
            year = yearNum === 1 ? yearNum + ' year ' : yearNum + ' years ';

            monthNum = difference - yearNum * 12;
            month = monthNum === 1 ? monthNum + ' month ' : monthNum === 0 ? '' : monthNum + ' months ';

            if (difference >= 12) {
                timeDif = year + month + 'after agreement';
            } else if (difference > 0 && difference < 12) {
                timeDif = month + 'after agreement';
            } else {
                const dayDiff = repoDate.getDate() - agtDate.getDate();
                timeDif = dayDiff + ' days after agreement';
            }

            const formattedRepoDate = `${repoDate.getFullYear()}-${String(repoDate.getMonth() + 1).padStart(2, '0')}-${String(repoDate.getDate()).padStart(2, '0')}`;
            const timeDisplay = formattedRepoDate + ' | ' + timeDif;

            return timeDisplay;
        },

        openDrawer(id, agtid, agtname ) {
            this.docDrawerOpen = true,
            this.segement_id = id,
            this.agt_id = agtid
            this.clickedAgt = agtname
            // console.log("open drawer", id, agtid, agtname)
        },

        openReportDrawer(reportId, reportData) {
            this.reportDrawerOpen = true
            this.selectedReport = reportData
            // console.log("reportID", reportId)

            var segmentIds = []
            for ( let segment of this.selectedReport.segments) {
                segmentIds.push(segment.number) 
            }
            this.allIDs = segmentIds
        }


    },

    computed: {
    sortedAgreements() {
        return this.topicData.agreements.slice().sort((a, b) => {
            return b.date - a.date;
            // return a.date - b.date;
        });
    }
},

    setup() {
        const $route = useRoute()
        let topicId = $route.query.id
        let topicText = $route.query.topicText
        let countryName = $route.query.country

        let data = {}

        var topicCategory = ""
        var topicSubcategory = ""
        // var topic = ""

        var topicData = []

        // var provision;

        for (let country of countries.countries) {
            if (country.name == countryName) {
                data = country
                for (let item of data.topics) {
                    if ( topicId == item.id) {
                        topicCategory = item.category[0]
                        topicSubcategory = item.subcategory[0]
                        // topic = item.text
                        
                        topicData = item
                        // provision = item.provisions
                        
                    }
                }
            }
        }

        console.log(topicData)

        return {
            topicData, topicId, topicText, countryName, topicCategory, topicSubcategory
        }
    }
}

</script>

<style scoped>

.agt-head {
    text-align: left;
    padding: 2vh 5%;
}

.country-title {
    font-size: 16px;
    font-weight: medium;
    margin: 0px 5px;
}

.breadcrumb {
    display: flex; 
    flex-direction: row; 
    align-items: center;
    margin: 10px 0px;
}

.current-page {
    font-style: italic;
}

h1 {
    font-size: 28px;
    margin: 0px 0px 10px 0px;
}

h3 {
    padding: 0px;
    margin: 0px;
}

.agt-head {
    text-align: left;
    padding: 2vh 5%;
}

.country-title {
    font-size: 16px;
    font-weight: medium;
    margin: 0px 5px;
}

.breadcrumb {
    display: flex; 
    flex-direction: row; 
    align-items: center;
    margin: 10px 0px;
}

.current-page {
    font-style: italic;
}

.text-container {
    text-align: left;
    margin: 0px 00px;
}

.tracker {
    margin: 0 5%;
}

.section-wrapper {
    margin: 0px 0px;
    text-align: left;
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

.source-wrapper {
    padding-top: 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.agt-extracts {
    color: black;
    font-size: 16px;
    font-weight: 400;
}

.agt-extracts:hover {
    color: grey;
    cursor: pointer;
}

.agt-in-topic {
    padding-top: 0;
    margin: 0px 0px 10px 0px;
}

.agt-in-topic:hover{
    cursor:pointer
}

.agreement-container {
    display: flex;
    align-items: flex-start;
    margin: 40px 10px 10px 10px;
    transition: box-shadow 0.3s ease;
}

.agreement-container:hover {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 25px 20px -20px;
}

.agreement-container:hover .agt-in-topic {
    text-decoration: underline;
}

.provision-container {
    margin: 0px 25px;
}

.date-column {
    width: 80px;
    flex-shrink: 0;
    text-align: center;
    margin-right: 20px;
}

.info-column {
    flex-grow: 1;
    padding-left: 10px; 
}

.date-column-ddmm {
    font-size: 18px;
    font-weight: 300;
    font-style: italic;
    padding: 3px 0;
    margin: 0;
    border-bottom: 1px solid gray;
}

.date-column-yyyy {
    font-size: 24px;
    font-weight: 800;
    font-style: italic;
    padding: 3px 0;
    margin: 0;
}
</style>
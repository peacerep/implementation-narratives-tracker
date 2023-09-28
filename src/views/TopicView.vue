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
    </div>


    <div class="tracker">
        <!-- agreement loop -->
        <div class="section-wrapper"
            v-for="agt in this.topicData.agreements"
            :key="agt">
            <div>
                <p>Agreement</p>
                <h2>{{ agt.name }}</h2>
            </div>
            
            <div class="provision" v-for="provision in agt.provisions" :key="provision">
                <el-row justify="center" :gutter="30" class="section-wrapper">
                <el-col :span="12">
                    <h3>Provisions</h3>
                    <div class="text-container">
                        <p>{{ provision.text }}</p>
                    </div>
                </el-col>

                <el-col :span="12">
                    <h3>Reports</h3>
                    <el-timeline class="timeline">
                        <el-timeline-item
                            v-for="report in provision.reports"
                            :key="report"

                            placement="top">
                            <el-card>
                                <h3>{{ report.name }}</h3>
                                <div class="source-wrapper">
                                    <p class="repo-source">Source: {{ report.organisation }}</p>
                                    <!-- <el-button 
                                        round size="small">
                                        Open Full Report
                                    </el-button> -->
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
                </el-col>
                </el-row>
            </div>
        </div>
    </div>
    
    
    <trackerFooter />
</template>
    
<script>
import { useRoute } from 'vue-router'

import trackerHeader from '@/components/trackerHeader.vue'
import trackerFooter from '@/components/trackerFooter.vue'

import countries from '@/data/countries.json'

export default {
    components: { trackerHeader, trackerFooter},

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
    margin: 0px 50px;
    text-align: left;
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

.source-wrapper {
    padding-top: 0px;
    display: flex;
    flex-direction: row;
    align-items: center;
}
</style>
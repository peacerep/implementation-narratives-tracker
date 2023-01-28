<template>
    <trackerHeader />

    <p 
        class="country-title"
        @click="toCountryView(country)">
        {{ this.countryName }}</p>
    <h1>{{ this.agtName }}</h1>

    <agtInfo 
        :provisionCounter="this.provisionCounter"
        :reportCounter="this.reportCounter"
        :agtDate="this.agtDate"
        :toLink="toLink"
        :toDescription="toDescription" />

    <topicList
        :agtTopicList="agtTopicList"
        @changeTopic="changeTopic" />


    <provisionSec
        :displayedTopic="displayedTopic"
        :topicProvisionCounter="topicProvisionCounter"
        :selectedProvisions="selectedProvisions" />

    <trackerFooter />
</template>

<script>
import { useRoute } from 'vue-router'

import trackerHeader from '@/components/trackerHeader.vue'
import trackerFooter from '@/components/trackerFooter.vue'
import agtInfo from '@/components/agtInfo.vue'
import topicList from '@/components/topicList.vue'
import provisionSec from '@/components/provisionSec.vue'

// 导入数据
import countries from '@/data/countries.json'
import PAX from '@/data/agt_description_links.json'

export default ({
    components: {
        trackerHeader, trackerFooter, agtInfo, topicList, provisionSec
    },

    data() {
        return{
            displayedTopic: 'please select a topic',
            topicProvisionCounter: 0,
            selectedProvisions: 0,
            toLink: this.paxLink,
            toDescription: this.agtDescription
        }
    },

    methods: {
        changeTopic(topic) {
            this.displayedTopic = topic
            // console.log(this.displayedTopic, 'SELECTED')

            let subProvisionCounter = 0
            let tmpArr = []

            for (let item of this.provisionList) {
                if (this.displayedTopic == item.topic) {
                    subProvisionCounter = item.provisions.length
                    // console.log('shortlist', subProvisionCounter)
                    tmpArr = item.provisions
                    console.log(tmpArr)
                }
            }
            this.topicProvisionCounter = subProvisionCounter
            this.selectedProvisions = tmpArr

            console.log('show-tmp', tmpArr)
            console.log('show-data',this.selectedProvisions)
        },
    },

    setup() {
        //传入agreement和country
        const $route = useRoute()
        let agtName = $route.query.agtName
        let countryName = $route.query.title
        let agtDate = $route.query.agtDate
        let agtID = $route.query.id

        // console.log('id',agtID)

        let data = {}
        let provisionList = []

        //初始化本页需要的数据
        for (let country of countries.countries) {
            if (country.name == countryName) {
                data = country
                for (let item of data.topics) {
                    let topicName = item.text
                    for (let agt of item.agreements) {
                        if ( agtName == agt.name ) {
                            provisionList.push({topic: topicName, provisions: agt.provisions})
                        }
                    }
                }
            }
        }
        // console.log(provisionList)

        //PAX links & descriptions
        let paxLink = ''
        let agtDescription = ''

        for (let item of PAX){
            if ( agtID == item.agreementID) {
                paxLink = item.hyperlink_pax
                agtDescription = item.description
            }
        }

        //本页显示内容
        let provisionCounter = 0
        let reportCounter = 0
        let reportList = []
        let agtTopicList = []

        //count all the provisions
        for (let topic of provisionList) {
            // console.log('topic',topic.topic)
            agtTopicList.push(topic.topic)
            for (let provision of topic.provisions){
                provisionCounter++
                // console.log(provision.reports)
                for (let report of provision.reports) {
                    if (reportList.includes(report.id) == false){
                        reportList.push(report.id)
                        reportCounter++
                    }
                }
            }    
        }

        

        return {
            agtName,agtDate, countryName, provisionList,provisionCounter, reportCounter, agtTopicList, paxLink, agtDescription
        }
    }
})
</script>

<style scoped>

h1 {
    font-size: 36px;
    margin: 0px 200px 0px 200px;
}

.country-title {
    font-size: 20px;
    font-weight: medium;
    text-align: center;
    margin-top: 40px;
    padding: 0px 0px;
}

</style>

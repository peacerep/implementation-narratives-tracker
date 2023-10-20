<template>
    <!-- <trackerHeader /> -->
    <div class="agt-head">
        <div class="breadcrumb">
            <el-link class="country-title" @click="home">Home</el-link>
            <el-icon><CaretRight /></el-icon>
            <el-link id="drawer" class="country-title" @click="toCountryView(this.countryName)">{{ this.countryName }} Agreements</el-link>
            <el-icon><CaretRight /></el-icon>
            <el-link class="country-title current-page">Provision Implementations</el-link>
        </div>
        <h1>{{ this.agtName }}</h1>

        <agtInfo 
            :provisionCounter="this.provisionCounter"
            :reportCounter="this.reportCounter"
            :agtDate="this.agtDate"
            :toLink="toLink"
            :toDescription="toDescription" />
    </div>

    <topicList
        :agtTopicList="agtTopicList"
        :selTopic="selTopic"
        @changeTopic="changeTopic" />

    <provisionSec
        :agtDate="this.agtDate"
        :agtID="this.agtID"
        :agtName="this.agtName"
        :displayedTopic="displayedTopic"
        :topicProvisionCounter="topicProvisionCounter"
        :selectedProvisions="selectedProvisions"
        :country="countryName" />

    <!-- <trackerFooter /> -->
</template>

<script>
import { useRoute } from 'vue-router'

// import trackerHeader from '@/components/trackerHeader.vue'
// import trackerFooter from '@/components/trackerFooter.vue'
import agtInfo from '@/components/agtInfo.vue'
import topicList from '@/components/topicList.vue'
import provisionSec from '@/components/provisionSec.vue'

// import data
import countries from '@/data/countries.json'
import PAX from '@/data/agt_description_links.json'

export default ({
    components: {
        agtInfo, topicList, provisionSec
    },

    data() {
        return{
            displayedTopic: 'please select a topic',
            topicProvisionCounter: 0,
            selectedProvisions: [],
            toLink: this.paxLink,
            toDescription: this.agtDescription,
            country: ""
        }
    },

    methods: {
        changeTopic(topic) {
            //assign to the selected topic
            this.displayedTopic = topic

            let subProvisionCounter = 0
            let tmpArr = []
            for (let item of this.provisionList) {
                if (this.displayedTopic == item.topic) {
                    subProvisionCounter = item.provisions.length
                    tmpArr = item.provisions
                }
            }
            this.topicProvisionCounter = subProvisionCounter
            this.selectedProvisions = tmpArr
            // console.log(this.selectedProvisions)
        },

        toCountryView(country) {
            this.$router.push({
                name: `country`,
                query: {
                    title: `${country}`
                }
            })
        },

        home(){
            this.$router.push('/');
        }
    },

    beforeMount(){
        //set the default choice to be the first topic in topicList
        // this.changeTopic(this.agtTopicList[0])
        this.changeTopic(this.selTopic)
    },

    setup() {
        //send in agreement and country data
        const $route = useRoute()
        let agtName = $route.query.agtName
        let countryName = $route.query.title
        let agtDate = $route.query.agtDate
        let agtID = $route.query.id
        let selTopic = $route.query.topic

        let data = {}
        let provisionList = []

        //initialize data to this page: topics+provisions+reports
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

        //modify the entire time format for provisionList
        for (let topics of provisionList) {
            for (let provision of topics.provisions){
                for (let report of provision.reports){
                    let tmp = report.date.toString()
                    let ze = /\d{4}-\d{1,2}-\d{1,2}/
                    if (!ze.test(tmp)) {
                        let year = tmp.slice(0,4)
                        let month = tmp.slice(4,6)
                        let day = tmp.slice(6,8)
                        let newDate = year + "-" + month + "-" + day
                        //assign value
                        report.date = newDate
                    }
                }
            }
        }

        //PAX links & descriptions
        let paxLink = ''
        let agtDescription = ''

        for (let item of PAX){
            if ( agtID == item.agreementID) {
                paxLink = item.hyperlink_pax
                agtDescription = item.description
            }
        }

        //THIS PAGE context
        let provisionCounter = 0
        let reportCounter = 0
        let reportList = []
        let agtTopicList = []

        //count all the provisions
        for (let topic of provisionList) {
            agtTopicList.push(topic.topic)
            for (let provision of topic.provisions){
                provisionCounter++
                for (let report of provision.reports) {
                    if (reportList.includes(report.id) == false){
                        reportList.push(report.id)
                        reportCounter++
                    }
                }
            }    
        }

        return {
            agtName, agtDate, agtID, countryName, provisionList, provisionCounter, reportCounter, agtTopicList, paxLink, agtDescription, selTopic
        }
    }
})
</script>

<style scoped>

h1 {
    font-size: 28px;
    margin: 0px 0px 10px 0px;
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

</style>

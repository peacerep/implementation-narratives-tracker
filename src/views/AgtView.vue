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
        <h1 class="agt-title">{{ this.agtName }}</h1>

        <agtInfo 
            :provisionCounter="this.provisionCounter"
            :reportCounter="this.reportCounter"
            :agtDate="this.agtDate"
            :toLink="toLink"
            :toDescription="toDescription" />
    </div>

    <topicList
        :agtTopicList="this.uniqueSubcategories"
        :selTopic="selTopic"
        @changeTopic="changeTopic" />

    <provisionSec
        :agtDate="this.agtDate"
        :agtID="this.agtID"
        :agtName="this.agtName"
        :displayedTopic="displayedTopic"
        :displayedCategroy="displayedCategroy"
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
            displayedCategroy: "Category",
            topicProvisionCounter: 0,
            selectedProvisions: [],
            toLink: this.paxLink,
            toDescription: this.agtDescription,
            country: ""
        }
    },

    methods: {
        changeTopic(topic, category) {
            //assign to the selected topic
            this.displayedTopic = topic
            this.displayedCategroy = category

            let subProvisionCounter = 0
            let tmpArr = []
            for (let item of this.provisionList) {
                if (this.displayedTopic == item.subcategory) {
                    subProvisionCounter = item.provisions.length
                    tmpArr = item.provisions
                }
            }
            this.topicProvisionCounter = subProvisionCounter
            this.selectedProvisions = tmpArr
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
        this.changeTopic(this.selTopic, this.selCategory)
    },

    setup() {
        //send in agreement and country data
        const $route = useRoute()
        let agtName = $route.query.agtName
        let countryName = $route.query.title
        let agtDate = $route.query.agtDate
        let agtID = $route.query.id
        let selTopic = $route.query.subCatAsTopic
        // let selCategory = $route.query.category

        let data = {}
        let provisionList = []

        //initialize data to this page: topics+provisions+reports
        // for (let country of countries.countries) {
        //     if (country.name == countryName) {
        //         data = country
        //         for (let item of data.topics) {
        //             let topicName = item.text
        //             let subcategoryLabel = item.subcategory[0]
        //             for (let agt of item.agreements) {
        //                 if ( agtName == agt.name ) {
        //                     provisionList.push({subcategory: subcategoryLabel, topic: topicName, provisions: agt.provisions})
        //                 }
        //             }
        //         }
        //     }
        // }

        // Initialize data to this page: topics + provisions + reports
        // for (let country of countries.countries) {
        //     if (country.name == countryName) {
        //         data = country;
        //         let subcategoryMap = new Map();
        //         for (let item of data.topics) {
        //             let topicName = item.text;
        //             let subcategoryLabel = item.subcategory[0];

        //             for (let agt of item.agreements) {
        //                 if (agtName == agt.name) {
        //                     if (!subcategoryMap.has(subcategoryLabel)) {
        //                         subcategoryMap.set(subcategoryLabel, { topics: [], provisions: [] });
        //                     }
        //                     let subcatEntry = subcategoryMap.get(subcategoryLabel);
        //                     if (!subcatEntry.topics.includes(topicName)) {
        //                         subcatEntry.topics.push(topicName);
        //                     }
        //                     for (let provision of agt.provisions) {
        //                         if (!subcatEntry.provisions.some(p => p.number === provision.number)) {
        //                             subcatEntry.provisions.push(provision);
        //                         }
        //                     }
        //                 }
        //             }
        //         }
        //         provisionList = Array.from(subcategoryMap).map(([subcategory, { topics, provisions }]) => {
        //             return { subcategory, topics, provisions };
        //         });
        //     }
        // }

        for (let country of countries.countries) {
            if (country.name == countryName) {
                data = country;
                let categoryMap = new Map();

                for (let item of data.topics) {
                    let topicName = item.text;

                    // Iterate through category-subcategory pairs
                    for (let catSubCatPair of item.category) {
                        let categoryLabel = catSubCatPair[0];
                        let subcategoryLabel = catSubCatPair[1];

                        for (let agt of item.agreements) {
                            if (agtName == agt.name) {
                                // Construct a unique key for each category-subcategory pair
                                let key = `${categoryLabel}|${subcategoryLabel}`;

                                // Check if the key already exists in the map
                                if (!categoryMap.has(key)) {
                                    categoryMap.set(key, { category: categoryLabel, subcategory: subcategoryLabel, topics: [], provisions: [] });
                                }
                                // Get the existing entry from the map
                                let categoryEntry = categoryMap.get(key);

                                // Add topic if it's not already in the list
                                if (!categoryEntry.topics.includes(topicName)) {
                                    categoryEntry.topics.push(topicName);
                                }

                                // Check for duplicate provisions based on their 'number'
                                for (let provision of agt.provisions) {
                                    if (!categoryEntry.provisions.some(p => p.number === provision.number)) {
                                        categoryEntry.provisions.push(provision);
                                    }
                                }
                            }
                        }
                    }
                }

                // Convert map to list
                provisionList = Array.from(categoryMap.values());
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

        //THIS PAGE context
        let provisionCounter = 0
        let reportCounter = 0
        let reportList = []
        let agtTopicList = []

        //count all the provisions
        // for (let topic of provisionList) {
        //     agtTopicList.push(topic.topic)
        //     for (let provision of topic.provisions){
        //         provisionCounter++
        //         for (let report of provision.reports) {
        //             if (reportList.includes(report.id) == false){
        //                 reportList.push(report.id)
        //                 reportCounter++
        //             }
        //         }
        //     }    
        // }

        let uniqueSubcategories = new Set(); 

        for (let item of provisionList) {
            // Add subcategory to the set of unique subcategories
            uniqueSubcategories.add(item.subcategory);

            // Count provisions and reports
            for (let provision of item.provisions) {
                provisionCounter++; 
                for (let report of provision.reports) {
                    if (!reportList.includes(report.id)) {
                        reportList.push(report.id); 
                        reportCounter++; 
                    }
                }
            }
        }
        let uniqueSubcategoryCount = uniqueSubcategories.size;
        


        return {
            agtName, agtDate, agtID, countryName, provisionList, provisionCounter, reportCounter, agtTopicList, paxLink, agtDescription, selTopic, uniqueSubcategories, uniqueSubcategoryCount
        }
    }
})
</script>
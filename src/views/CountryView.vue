<template>
  <trackerHeader />

  <div class="country-layout">
    <el-container>
        <el-header>
            <div class="breadcrumb">
                <el-link class="country-title" @click="home">Home</el-link>
                <el-icon><CaretRight /></el-icon>
                <el-link class="country-title">{{ this.title }} Agreements</el-link>
            </div>
            <countryHeader :title="title" />
        </el-header>

      <el-container>
        <el-aside width="50%">
            <topicByCategoryList :topicByCategory="this.topicByCategory" :countryName="this.countryName"/>
        </el-aside>

        <el-divider direction="vertical"></el-divider>

        <el-main>
            <div style="display: flex; flex-direction: row; align-items: center;">
                <p style="padding: 0px 10px;">Sort by:</p>
                <el-radio-group 
                    v-model="reverse" 
                    @change="reverseList()"
                    class="radio-group">
                    <el-radio label="1">Newest</el-radio>
                    <el-radio label="2">Oldest</el-radio>
                </el-radio-group>
            </div>
            
            <docList 
                :dataListDisplayed="dataListDisplayed.slice(sizePerPage*(currentPage-1),sizePerPage*currentPage)"
                :title="title" />
            
            <!-- page split -->
            <div class="paginationClass">
            <el-pagination
                :page-size="sizePerPage"
                :total="this.dataListDisplayed.length"
                hide-on-single-page
                @current-change="currentChange"
            ></el-pagination>
            </div>
        </el-main>

      </el-container>
    </el-container>
  </div>

  <!-- <trackerFooter /> -->
</template>

<script>
import { useRoute } from 'vue-router'

import trackerHeader from '@/components/trackerHeader.vue'
// import trackerFooter from '@/components/trackerFooter.vue'
import countryHeader from '@/components/countryHeader.vue'
import docList from '@/components/docList.vue'
import topicByCategoryList from '@/components/topicByCategoryList.vue'

// import data
import countries from '@/data/countries.json'

export default ({
    components: {
        countryHeader, docList, topicByCategoryList, trackerHeader
    },

    data() {
        return{
            title: this.countryName,
            dataListDisplayed: this.agreementList,

            //parent component pass data to filter
            allAgt: this.agreementList,
            allOptions: this.topicOptions,

            filterList: [
                {
                    title: 'agreements by topics',
                    value: this.topicOptions
                },
                {
                    title: 'agreements by years',
                    value: this.yearOptions
                }
            ],

            //page split
            sizePerPage: 6,
            currentPage: 1,

            //sort by date
            reverse: '1',

            // topicByCategory: this.topicByCategory
            // activeCategory: [],
            // activeSubcategory: {}
        }
    },

    methods: {
        changeDisplayList(newList) {
            this.dataListDisplayed = newList
            console.log("displayed", this.dataListDisplayed)
        },

        currentChange(current) {
            this.currentPage = current
        },

        home(){
            this.$router.push('/');
        },

        reverseList() {
            if(this.reverse) {
                this.dataListDisplayed = this.dataListDisplayed.reverse()
            }
        },
    },

    mounted() {
        this.reverseList()
    },

    setup() {
        //pass in country title through route
        const $route = useRoute()
        let countryName = $route.query.title
        let data = {}
        let agreementList = []

        // Initialise agreement data in this page
        for (let country of countries.countries) {
            if (country.name == countryName) {
                data = country
            }
        }

        // Get all agreement list
        let topic = ''
        // find duplicate topic
        let topicID = 0
        let topicList = []

        let topicOptions = []
        let agtName = ''
        let agtID = ''
        let yearOptions = []
        // let agtTimeExact = ''

        let topicByCategory = []

        let agtList = []
        for (let item of data.topics) {
                topic = item.text
                topicOptions.push(topic)

                // find duplicate topic
                topicID = item.id
                topicList.push({"id": topicID, "topic": topic})

                // get the topic category
                // topicByCategory = [{categoryLabel: "", subcategories: [{label:"s", topicList: ["a", "b"]}]}, }]
                
                const categoryLabel = item.category[0];
                const subcategoryLabel = item.subcategory[0];

                // search and match category
                let categoryEntry = null;
                for (let category of topicByCategory) {
                    if (category.categoryLabel === categoryLabel) {
                    categoryEntry = category;
                    break;
                    }
                }

                // create category
                if (categoryEntry === null) {
                    categoryEntry = {
                    categoryLabel: categoryLabel,
                    subcategories: []
                    };
                    topicByCategory.push(categoryEntry);
                }

                // search and match subcategory
                let subcategoryEntry = null;
                for (let subcategory of categoryEntry.subcategories) {
                    if (subcategory.label === subcategoryLabel) {
                    subcategoryEntry = subcategory;
                    break;
                    }
                }

                // create subcategory
                if (subcategoryEntry === null) {
                    subcategoryEntry = {
                    label: subcategoryLabel,
                    topicList: []
                    };
                    categoryEntry.subcategories.push(subcategoryEntry);
                }

                // Add the topic text to the subcategory's topicList
                subcategoryEntry.topicList.push({id: item.id, topic: item.text});

                for (let agt of item.agreements){
                    agtName = agt.name
                    agtID = agt.id
                    let agtTime = ''
                    
                    // decide if this agt is in the list
                    if (agtList.includes(agtName) == false){
                        agtList.push(agtName)
                        
                        // get agt time
                        let tmp = agt.date.toString()
                        let YEAR = tmp.slice(0,4)
                        let MONTH = tmp.slice(4,6)
                        let DAY = tmp.slice(6,8)
                        agtTime = YEAR + '-' + MONTH + '-' + DAY

                        if(yearOptions.includes(YEAR) == false){
                            yearOptions.push(YEAR)
                        }

                        agreementList.push({'agt': agtName, 'id': agtID, 'date': agtTime, 'year': YEAR, "topics": [topic], "topicsID": [{id: topicID, topic: topic}]})
                    }
                    else {
                        for (let subAgt of agreementList) {
                            // console.log(subAgt)
                            if (subAgt.agt == agtName) {
                                subAgt.topics.push(topic)

                                //find duplicate topic
                                subAgt.topicsID.push({id: topicID, topic: topic})
                            }
                        }
                    }
                }
            }

            for (let subAgt of agreementList) {
                subAgt.topicsID.sort((a, b) => {
                    if (a.topic < b.topic) return -1;
                    if (a.topic > b.topic) return 1;
                    return 0;
                });

                subAgt.topics.sort();
            }

            //find duplicate topics
            topicList.sort((a, b) => {
                    if (a.topic < b.topic) return -1;
                    if (a.topic > b.topic) return 1;
                    return 0;
                });
            // console.log(topicList)

            let topicMap = {};

            // Build the map
            for (let item of topicList) {
                if (!topicMap[item.topic]) {
                    topicMap[item.topic] = [];
                }
                if (!topicMap[item.topic].includes(item.id)) {
                    topicMap[item.topic].push(item.id);
                }
            }

            // Find topics with more than one unique id
            let duplicateTopics = Object.keys(topicMap).filter(topic => topicMap[topic].length > 1);

            // Extract the items from topicList based on the duplicate topics
            let duplicates = topicList.filter(item => duplicateTopics.includes(item.topic));
            console.log(duplicates);

        // sort the arrary by date descending order
        agreementList.sort(function(a, b) {
                // return new Date(b.date) - new Date(a.date);
                return new Date(a.date) - new Date(b.date);

            })

        console.log(topicByCategory);
        
        return {
            countryName, data, agreementList, topicOptions, yearOptions, topicByCategory
        }
    }
})
</script>

<style scoped>
.el-main{
    /* height: 100vh; */
    /* overflow:auto; */
    background-color: burlywood;
}
.country-layout .el-header {
  background-color: #F1F1F1;
  padding: 10px 6%;
  margin: 0px 0%;
  height: auto;
  /* border-bottom: 2px solid black; */
}

.country-layout .el-main {
    padding: 0px 5%;
    background-color: white;
    display: block;
    text-align: left;
  
}

.country-layout .el-aside {
  background-color: white;
  padding: 0px 5%;
  display: block;
  text-align: left;
  overflow: hidden;
}

.topic-collapse-container {
    margin-top: 80px;
    padding: 20px;
}

::v-deep .outer-collapse .el-collapse-item__header {
  font-size: 1.3em; 
  margin: 10px 0;
  color: black;
}

::v-deep .outer-collapse .el-collapse-item__content {
  font-size: 1.1em; 
}

/* Inner Collapse */
::v-deep .inner-collapse {
  padding-left: 20px;
}

::v-deep .inner-collapse .el-collapse-item__header {
  font-size: 1em; 
}

::v-deep .inner-collapse .el-collapse-item__content {
  font-size: 0.9em; 
}

::v-deep .topic-link {
    display: block;
}

.paginationClass {
    position: relative;
    bottom: 0;
    text-align: center;
}

.el-row {
    margin-left: 50px;
    margin-bottom: 10px;
    align-items: flex-start;
}

.el-col {
    column-rule: 4px dotted rgb(79, 185, 227);
    border-radius: 4px;
    align-items: flex-start;
  
}

.el-divider--vertical{
  display:inline-block;
  width:1px;
  height: 100vh;
  margin:0 8px;
  vertical-align:middle;
  position:relative;
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

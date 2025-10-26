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
            <!-- <topicByCategoryList :topicByCategory="this.topicByCategory" :countryName="this.countryName"/> -->
             <topicTimelineList :topicTimelines = "this.topicTimelines" :countryName="this.countryName"/>
        </el-aside>

        <el-divider direction="vertical"></el-divider>

        <el-main>
            <h2>Explore by Agreement</h2>
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
// import topicByCategoryList from '@/components/topicByCategoryList.vue'
import topicTimelineList from '@/components/topicTimelineList.vue'


// import data
import countries from '@/data/countries.json'
import topicTimelineData from '@/data/topicTimelineData.json'

export default ({
    components: {
        countryHeader, trackerHeader, topicTimelineList, docList
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
            sizePerPage: 5,
            currentPage: 1,

            //sort by date
            reverse: '1',
        }
    },

    methods: {
        changeDisplayList(newList) {
            this.dataListDisplayed = newList
            // console.log("displayed", this.dataListDisplayed)
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

        // right panel: Initialise agreement data in this page
        for (let country of countries.countries) {
            if (country.name == countryName) {
                data = country
            }
        }

        // right panel: process agreement list
        let yearOptions = []
        for (let item of data.topics) {
            let topic = item.text;
            let topicID = item.id;

            for (let agt of item.agreements) {
                let agtName = agt.name;
                let agtID = agt.id;
                let agtTime = '';

                // Convert agreement date to YYYY-MM-DD format
                let tmp = agt.date.toString();
                let YEAR = tmp.slice(0, 4);
                let MONTH = tmp.slice(4, 6);
                let DAY = tmp.slice(6, 8);
                agtTime = YEAR + '-' + MONTH + '-' + DAY;

                // Process agreement details
                let agreement = agreementList.find(a => a.agt === agtName);

                if (!agreement) {
                    agreement = {
                        'agt': agtName,
                        'id': agtID,
                        'date': agtTime,
                        'year': YEAR,
                        'categoryList': item.category.map(catSubCat => ({ label: catSubCat[0], subCategoryList: [catSubCat[1]] })),
                        'topics': [topic],
                        'topicsID': [{ id: topicID, topic: topic }]
                    };
                    agreementList.push(agreement);
                    if (!yearOptions.includes(YEAR)) {
                        yearOptions.push(YEAR);
                    }
                } else {
                    // Update existing agreement
                    agreement.topics.push(topic);
                    agreement.topicsID.push({ id: topicID, topic: topic });

                    item.category.forEach(catSubCat => {
                        let cat = catSubCat[0];
                        let subCat = catSubCat[1];
                        let category = agreement.categoryList.find(c => c.label === cat);

                        if (!category) {
                            agreement.categoryList.push({ label: cat, subCategoryList: [subCat] });
                        } else if (!category.subCategoryList.includes(subCat)) {
                            category.subCategoryList.push(subCat);
                        }
                    });
                }
            }
        }

        // right panel: sort the arrary by date descending order
        agreementList.sort(function(a, b) {
                return new Date(a.date) - new Date(b.date);
            })
        
        // right panel: number of subcategories in the blue box
        for (let agreement of agreementList) {
            let uniqueSubCats = new Set();
            for (let category of agreement.categoryList) {
                for (let subCat of category.subCategoryList) {
                    uniqueSubCats.add(subCat);
                }
            }
            agreement.totalUniqueSubCats = uniqueSubCats.size;
        } 
        // console.log("agreementList", agreementList)

        // left panel: read in the flattened topic data
        let topicTimelines = {}
        for (let country of topicTimelineData.countries) {
            if (country.name == countryName) {
                topicTimelines = country.Groups
                // console.log("topicTimeline", topicTimelines)
            }
        }
        
        return {
            countryName, data, agreementList, yearOptions, topicTimelines
        }
    }
})
</script>

<style scoped>
  /* .el-row {
      margin-left: 50px;
      margin-bottom: 10px;
      align-items: flex-start;
  } */
  
  /* .el-col {
      column-rule: 4px dotted rgb(79, 185, 227);
      border-radius: 4px;
      align-items: flex-start;
  } */

</style>

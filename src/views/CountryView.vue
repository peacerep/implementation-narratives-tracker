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
            sizePerPage: 5,
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

        // Initialise agreement data in this page
        for (let country of countries.countries) {
            if (country.name == countryName) {
                data = country
            }
        }

        // Get all agreement list
        // let topic = ''
        // find duplicate topic
        // let topicID = 0
        let topicList = []

        let topicOptions = []
        // let agtName = ''
        // let agtID = ''
        let yearOptions = []

        //temp: for agtlist showing categories
        // let cat = ""
        // let subCat = ""

        let topicByCategory = []

        // let agtList = []
        
        for (let item of data.topics) {
            let topic = item.text;
            topicOptions.push(topic);

            // Find duplicate topic
            let topicID = item.id;
            topicList.push({ "id": topicID, "topic": topic });

            // Iterate through category-subcategory pairs
            for (let catSubCatPair of item.category) {
                let categoryLabel = catSubCatPair[0];
                let subcategoryLabel = catSubCatPair[1];

                // Search and match category
                let categoryEntry = topicByCategory.find(category => category.categoryLabel === categoryLabel);

                // Create category if it doesn't exist
                if (!categoryEntry) {
                    categoryEntry = {
                        categoryLabel: categoryLabel,
                        subcategories: []
                    };
                    topicByCategory.push(categoryEntry);
                }

                // Search and match subcategory
                let subcategoryEntry = categoryEntry.subcategories.find(subcategory => subcategory.label === subcategoryLabel);

                // Create subcategory if it doesn't exist
                if (!subcategoryEntry) {
                    subcategoryEntry = {
                        label: subcategoryLabel,
                        topicList: []
                    };
                    categoryEntry.subcategories.push(subcategoryEntry);
                }

                // Add the topic to the subcategory's topicList
                subcategoryEntry.topicList.push({ id: item.id, topic: item.text });
            }

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


        // console.log("category entry", topicByCategory)
    

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
        
        for (let agreement of agreementList) {
            let uniqueSubCats = new Set();

            for (let category of agreement.categoryList) {
                for (let subCat of category.subCategoryList) {
                    uniqueSubCats.add(subCat);
                }
            }
            agreement.totalUniqueSubCats = uniqueSubCats.size;
        } 
        

        // console.log("agreementList", agreementList);
        
        return {
            countryName, data, agreementList, topicOptions, yearOptions, topicByCategory
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

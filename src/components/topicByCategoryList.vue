<template>
    <h2>Explore by Topics</h2>
    <el-scrollbar height="80vh">
    <div class="topic-collapse-container">
        <el-collapse class="outer-collapse" v-model="activeCategory" accordion>
            <el-collapse-item
                v-for="(category, categoryIndex) in this.topicByCategory"
                :key="categoryIndex"
                :title="category.categoryLabel"
                :name="category.categoryLabel"
            >
                <el-link
                    v-for="(subcategory, subcategoryIndex) in category.subcategories"
                    :key="subcategoryIndex"
                    :title="subcategory.label"
                    class="topic-link"
                    :underline="false"
                    :name="`${categoryIndex}-${subcategoryIndex}`"
                    @click="toSubCategoryView(subcategory, this.countryName)"
                    >
                {{ subcategory.label }}
                </el-link>

                
            </el-collapse-item>
        </el-collapse>
        </div>
    </el-scrollbar>
</template>

<script>

export default ({
    props: ["topicByCategory", "countryName"],

    data() {
        return {
            activeCategory: [],
            activeSubcategory: {}
        }
    },

    methods: {
        toTopicView(topic, country) {
            // console.log(topic)
            this.$router.push({
                name: `topic`,
                query: {
                    id: `${topic.id}`,
                    topicText: `${topic.topic}`,
                    country: `${country}`,
                }
            })
        },

        // toSubCategoryView(subCategoryTopic, country) {
        //     console.log(subCategoryTopic)
        //     this.$router.push({
        //         name: `subCategoryTopic`,
        //         query: {
        //             id: `${subCategoryTopic}`,
        //             topicText: `${subCategoryTopic.label}`,
        //             country: `${country}`,
        //         }
        //     })
        // }

        toSubCategoryView(subCategoryTopic, country) {
            console.log(subCategoryTopic, country)
            this.$router.push({
                name: `subCategoryList`,
                query: {
                    subCategory: `${subCategoryTopic.label}`,
                    // topicList: `${subCategoryTopic.topicList}`,
                    // topicList: JSON.stringify(subCategoryTopic.topicList),
                    country: `${country}`
                }
            })
        }
    }
})
</script>

<style scoped>
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
</style>
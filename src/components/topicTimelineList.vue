<template>
    <h2>Explore Topic Timelines</h2>
    <el-scrollbar height="80vh">

    <div class="topic-collapse-container">
        <el-collapse v-model="activeCategory" accordion class="outer-collapse">
            <el-collapse-item
                v-for="(subcategories, topic) in topicTimelines"
                :key="topic"
                :name="topic"
            >
                <template #title>{{ topic }}</template>
                
                <el-link
                v-for="(value, subcategory) in subcategories"
                :key="subcategory"
                :title="subcategory"
                :underline="false"
                class="topic-link"
                @click="toTimelineView(subcategory, this.countryName)"
                >
                {{ subcategory }}
                </el-link>
            </el-collapse-item>
            </el-collapse>
        </div>
    </el-scrollbar>
</template>

<script>
export default ({
    props: ["topicTimelines", "countryName"],

    data() {
        return {
            activeCategory: [],
            activeSubcategory: {}
        }
    },

    methods:{
        toTimelineView(subCategoryTopic, country) {
            console.log("toTimelineView", subCategoryTopic)
            this.$router.push({
                name: `timeline`,
                query: {
                    subCategory: `${subCategoryTopic}`,
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
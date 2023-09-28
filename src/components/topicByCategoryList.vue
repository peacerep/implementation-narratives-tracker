<template>
    <h2>Explore by Topics</h2>
    <div class="topic-collapse-container">
            <el-collapse class="outer-collapse" v-model="activeCategory" accordion>
            <el-collapse-item
                v-for="(category, categoryIndex) in this.topicByCategory"
                :key="categoryIndex"
                :title="category.categoryLabel"
                :name="category.categoryLabel"
            >
                <!-- Inner  -->
                <el-collapse class="inner-collapse" v-model="activeSubcategory[categoryIndex]">
                <el-collapse-item
                    v-for="(subcategory, subcategoryIndex) in category.subcategories"
                    :key="subcategoryIndex"
                    :title="subcategory.label"
                    :name="`${categoryIndex}-${subcategoryIndex}`"
                >
                    <!-- List of topics -->
                    <el-link
                        v-for="item of subcategory.topicList"
                        :key="item.id"
                        :underline="false"
                        class="topic-link"
                        @click="toTopicView(item, this.countryName)"
                    >
                    {{ item.topic }}
                </el-link>
                </el-collapse-item>
                </el-collapse>
            </el-collapse-item>
            </el-collapse>
        </div>
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
            console.log(topic)
            this.$router.push({
                name: `topic`,
                query: {
                    id: `${topic.id}`,
                    topicText: `${topic.topic}`,
                    country: `${country}`,
                }
            })
        }
    }
})
</script>
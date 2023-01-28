<template>
    <div class="country">
        <h1> {{ title }} </h1>
        <p>Agreements</p>
                <!-- <el-row :gutter="20">
                    <el-col :span="12"><h1> {{ title }} </h1></el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="4"><p>Agreements</p></el-col>
                </el-row> -->
            </div>
</template>

<script>
export default ({
    props: ["title"]
})
</script>

<style scoped>
.country {
    padding-top:80px;
    /* padding-left: 100px; */
    padding-bottom: 80px;
}

h1 {
    color: #000;
    font-size: 48px;
    /* text-align: left; */
    margin: 0px;
}

p {
    color: #000;
    font-size: 24px;
    font-weight: blod;
    /* text-align: left; */
    margin: 0px;
}
</style>
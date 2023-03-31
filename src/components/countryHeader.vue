<template>
    <div class="country">
        <h1>Implementation of Past {{ title }} Agreements</h1>
        <p>Please select an agreement to explore reports on how different provisions and topics were implemented.</p>
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
    padding-top: 30px;
    /* padding-left: 100px; */
    padding-bottom: 30px;
}

h1 {
    color: #000;
    font-size: 42px;
    /* text-align: left; */
    margin: 0px;
}

p {
    color: #000;
    font-size: 18px;
    font-weight: blod;
    /* text-align: left; */
    margin: 0px;
}
</style>
<template>
    <div class="tracker">
        <div class="title">
            <p style="margin-bottom: 0px;">Selected Topic:</p>
            <h2 style="margin-top: 10px; font-style: italic;">{{ this.displayedTopic }}</h2>
        </div>
        <!-- heading for the provisions/implementation -->
        <el-row justify="center" :gutter="60" class="section-wrapper">
            <el-col :span="12">
                <div class="text-container">
                    <h3>Agreement Provisions</h3>
                    <p class="counters" style="font-style: italic;">Click provision to view</p>
                    <p class="counters">{{ this.topicProvisionCounter }} records</p>
                </div>
            </el-col>

            <el-col :span="12">
                <div class="text-container">
                <h3>Implementation Instances</h3>
                <p class="counters" style="font-style: italic;">Since agreement signed</p>
                <div id="chart" v-show="displayChart"></div>
                <div id="chart-report" v-show="!displayChart"></div>

                <div style="display: flex; flex-direction: row; align-items: center;">
                    <p class="counters">{{ this.reportCounter }} instances</p>
                    <p class="counters">{{ this.segmentCounter }} segments</p>
                    <el-radio-group 
                        v-model="reverse" 
                        @change="reverseList()"
                        class="radio-group">
                        <el-radio label="1">Newest</el-radio>
                        <el-radio label="2">Oldest</el-radio>
                    </el-radio-group>
                    <!-- <el-button @click="toggleDisplay" style="margin-left: 10px;">Vis Toggle</el-button> -->
                </div>

                </div>
            </el-col>
        </el-row>

    <!-- the collapse -->
    <el-row justify="center" :gutter="30" class="section-wrapper">
        <el-col :span="12">
            <!-- loop the provisions -->
            <div class="text-container"
                v-for="(provision, index) in this.selectedProvisions"
                :key="provision">
                <div :provision = provision class="provision-container">

                    <div @click="showImplementation(provision), renderInstanceBar(), renderReportBar(), changeStyle(index), showDrawerButton(index)"> 
                        <p class="agt-extracts"
                            :class="{changeStyle:changeStyleIndex == index}">
                        ...{{ provision.text }}... </p>

                        <el-button 
                            round size="small" 
                            v-show="this.buttonVisible == index"
                            @click="openDrawer(provision.number, index)"
                            style="margin-bottom: 10px;">
                            Locate in Agreement
                        </el-button>
                    </div>

                    <el-divider class="provision-divider"/>
                </div>      
            </div>
        </el-col>

        <el-col :span="12"
        style="height: 80vh; overflow: auto;">
            <div id="if-empty"></div>
            <el-timeline :reverse="reverse" class="timeline">
                <el-timeline-item
                    v-for="(report, index) in this.displayed"
                    :key="report"
                    :timestamp="report.newTimeStamp"
                    placement="top" 
                    >
                <el-card 
                    shadow="hover"
                    @mouseover="this.reportbuttonVisible = index" @mouseleave="this.reportbuttonVisible = 9999">
                    <h3>{{ report.name }}</h3>

                    <div class="source-wrapper">
                        <p class="repo-source">Source: {{ report.organisation }}</p>
                        <el-button 
                            round size="small" 
                            v-show="this.reportbuttonVisible == index"
                            @click="openReportDrawer(report.id)">
                            Open Full Report
                        </el-button>
                    </div>

                    <div
                        v-for="segment in report.segments"
                        :key="segment"
                        class="segment-container"
                        >
                        <div>
                        <el-row class="segment-wrapper">
                            <el-col :span="22">
                                <p class="segment-text">{{ segment.text }}</p>
                            </el-col>
                            <el-col :span="2">
                                <div v-if="segment.polarity > 0">
                                <el-tag effect="plain" type="success" size="small" round>
                                positive
                                </el-tag></div>
                            <div v-else-if="segment.polarity < 0">
                                <el-tag effect="plain" type="danger" size="small" round>
                                negative
                                </el-tag></div>
                            <div v-else>
                                <el-tag effect="plain" type="info" size="small" round>
                                neutral
                                </el-tag></div>
                            </el-col>
                        </el-row>
                        </div>
                    </div>
                
                <!-- <el-divider /> -->
                </el-card>
                </el-timeline-item>
            </el-timeline>
        </el-col>
         
    </el-row>
    
    <!-- Agreement Full Text -->
    <el-drawer
        v-model="docDrawerOpen"
        :direction="direction"
        title="Agreement full text"
        size="45%"
        >
        <docDrawer ref="docDrawer" v-bind="$attrs" :id="this.segement_id" :docDrawerOpen="docDrawerOpen" :country="country"/>
    </el-drawer>

    <!-- Report Full Text -->
    <el-drawer
        v-model="reportDrawerOpen"
        title="Report full text"
        size="45%"
        >
        <reportDrawer :report="this.selectedReport" :reportDrawerOpen="reportDrawerOpen" :allIDs="allIDs" :country="country" />
    </el-drawer>

</div>
</template>

<script>
import docDrawer from "@/components/docDrawer.vue"
import reportDrawer from "@/components/reportDrawer.vue"
import * as d3 from "d3";
// import { beeswarm } from "d3-beeswarm";

export default ({
    components: { docDrawer, reportDrawer },
    props: ['displayedTopic', 'topicProvisionCounter', 'selectedProvisions', 'country', 'agtDate'],

    data() {
        return {
            reverse: '1',
            displayed: [],
            reportDate: "",
            reportCounter: 0,
            segmentCounter: 0,
            provisionClicked: '',
            changeStyleIndex: '',
            instanceBarData: [],
            reportBarData: [],
            displayChart: true,

            //for the drawer
            buttonVisible: 0,
            docDrawerOpen: false,
            doc_id: 0,
            segement_id: 0,
            direction: 'ltr',

            //for the report drawer
            reportbuttonVisible: 999,
            reportDrawerOpen: false,
            selectedReport: [],
            allIDs: []
        }
    },

    methods: {
        showImplementation(provision) {
            this.provisionClicked = provision
            let repoID = provision.number
            let displayedReports = []

            

            for (let item of this.selectedProvisions) {
                if ( repoID == item.number) {
                    displayedReports = item.reports
                }
            }

            let agtDate = document.querySelector(".info-wrapper p").innerHTML
            agtDate = new Date(agtDate)

            let segmentPolarityIndex = []

            displayedReports.forEach((report) => {
                report.segments.forEach((segment) => {
                    segmentPolarityIndex.push({
                        reportID: report.id,
                        segmentID: segment.number,
                        polarity: segment.polarity,
                        date: report.date,
                    })
                })
            })
            this.instanceBarData = segmentPolarityIndex
            this.segmentCounter = segmentPolarityIndex.length

            const reportPolarityIndex = displayedReports.map(report => {
            const totalPolarity = report.segments.reduce((acc, segment) => acc + segment.polarity, 0);
            const averagePolarity = totalPolarity / report.segments.length;

            return {
                reportID: report.id,
                date: report.date,
                polarity: averagePolarity
            }
            })

            this.reportBarData = reportPolarityIndex

            for (let report of displayedReports) {
                let repoDate = report.date
                repoDate = new Date(repoDate)
                const monthDiff = repoDate.getMonth() - agtDate.getMonth()
                const yearDiff = repoDate.getYear() - agtDate.getYear()
                const difference = monthDiff + yearDiff * 12;

                let timeDif, month, year = ''
                let yearNum, monthNum = 0

                yearNum = Math.floor(difference / 12)
                if ( yearNum == 1) { 
                    year = yearNum + ' year ' 
                }
                else { 
                    year = yearNum + ' years ' 
                }

                monthNum = difference - yearNum * 12
                if ( monthNum == 1) { 
                    month = monthNum + ' month '
                 }
                else if (monthNum == 0) { 
                    month = ''
                }
                else { 
                    month = monthNum + ' months ' 
                }

                if (difference >= 12) {
                    timeDif = year + month + 'after agreement'
                }
                else if ( difference > 0 && difference < 12) {
                    timeDif = month + 'after agreement'
                }
                else {
                    const dayDiff = repoDate.getDate() - agtDate.getDate()
                    timeDif = dayDiff + ' days after agreement'
                }

                report['newTimeStamp'] = report.date + '  |  ' + timeDif
                
            }

            // sort the arrary by date descending order
            displayedReports.sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
            })

            this.displayed = displayedReports
            this.reportCounter = displayedReports.length

            // When selected provision change, the default sorting should always be to the "neweast"
            this.reverse = (this.reverse === '2') ? '1' : this.reverse;

            const emptyDiv = document.querySelector("#if-empty")
            if (this.reportCounter == 0) {
                emptyDiv.innerHTML = '<p>We found no instances of implementation found for this provision topic.</p>';
            }
            else {
                emptyDiv.innerHTML = ''
            }
        },

        toggleDisplay() {
            this.displayChart = !this.displayChart
        },

        mapRange(value, inputMin, inputMax, outputMin, outputMax) {
            return (value - inputMin) * (outputMax - outputMin) / (inputMax - inputMin) + outputMin
            },

        renderInstanceBar() {
            // clear the div first
            const chartDiv = document.getElementById("chart")
            chartDiv.innerHTML = ""

            if (this.reportCounter != 0) {
                //generate the visualization
                const reportTimeline = document.querySelector('.timeline')
                const reportTimelineWidth = reportTimeline.offsetWidth
                const margin = { top: 10, right: 20, bottom: 20, left: 10 };
                const width = reportTimelineWidth - margin.left - margin.right;
                const data = JSON.parse(JSON.stringify(this.instanceBarData));
                // console.log(data)

                // Include 
                const dateDomain = d3.extent(data, d => new Date(d.date))
                const agtDate = new Date(this.agtDate)
                dateDomain.shift()
                dateDomain.unshift(agtDate)


                // Get the MAX count of a instances in the report
                const reportCounts = data.reduce((counts, entry) => {
                if (Object.prototype.hasOwnProperty.call(counts, entry.reportID)) {
                    counts[entry.reportID]++;
                } else {
                    counts[entry.reportID] = 1;
                }
                return counts;
                }, {});
                const maxCount = Math.max(...Object.values(reportCounts));

                // Map this to 
                const mappedValue = Math.round(this.mapRange(maxCount, 1, 30, 65, 130))
                const height = mappedValue - margin.top - margin.bottom;

                // Define the scales
                const xScale = d3.scaleTime().domain(dateDomain).range([10, width]);

                const yScale = d3.scaleLinear().domain([-1, 1]).range([height, 20]);

                // Define the colors
                const color = d3.scaleOrdinal().domain([1, 0, -1]).range(["#67c23a", "#CFD1D4", "#f56c6c"]);
                
                // Define the collide with circle radius
                const radius = 6

                // Define the force simulation
                const simulation = d3.forceSimulation(data)
                .force("x", d3.forceX(d => xScale(new Date(d.date))).strength(1))
                .force("y", d3.forceY(d => yScale(d.polarity)).strength(1))
                .force("collide", d3.forceCollide(radius+1.5))
                .stop();

                const svg = d3.select("#chart").append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);

                // Create the axes
                const xAxis = d3.axisBottom(xScale)
                                .ticks(d3.timeMonth.every(3))
                                .tickFormat(d => {
                                    const month = d3.timeFormat("%b")(d);
                                    const year = d3.timeFormat("%Y")(d);
                                    return month === "Jan" ? `${year}` : month;
                                });
                                
                svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

                // Append a rectangle at the beginning of the x-axis
                svg.append("rect")
                    .attr("x", margin.left)
                    .attr("y", height - margin.bottom /2)
                    .attr("width", 5)
                    .attr("height", 20) 
                    .attr("fill", "black"); 

                // Run the force simulation
                for (let i = 0; i < 120; ++i) simulation.tick();

                // Render the beeswarm chart
                svg.selectAll(".dot")
                .data(data)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("r", radius)
                .attr("cx", d => d.x)
                .attr("cy", d => d.y)
                .attr("fill", d => color(Math.sign(d.polarity)));
            }
        },

        renderReportBar(){
            // clear the div first
            const chartDiv = document.getElementById("chart-report")
            chartDiv.innerHTML = ""

            if (this.reportCounter != 0) {
                //generate the visualization
                const reportTimeline = document.querySelector('.timeline')
                const reportTimelineWidth = reportTimeline.offsetWidth
                const margin = { top: 5, right: 10, bottom: 20, left: 10 };
                const width = reportTimelineWidth - margin.left - margin.right;
                const height = 50 - margin.top - margin.bottom;
                const data = this.reportBarData

                const svg = d3
                        .select("#chart-report")
                        .append("svg")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                const x = d3
                        .scaleTime()
                        .domain(d3.extent(data, (d) => new Date(d.date)))
                        .range([0, width - data.length * 2]); // Adjust the x-scale range

                const xAxis = d3
                            .axisBottom(x)
                            .ticks(d3.timeMonth.every(3)) // Display ticks every quarter
                            .tickFormat((d) => {
                                // Format tick labels with month number or year
                                return d.getMonth() === 0
                                ? d.getFullYear()
                                : d.toLocaleString('en-US', { month: 'short' });
                            });

                svg
                .append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);

                const colorScale = (polarity) => {
                    if (polarity > 0) return "YellowGreen";
                    if (polarity < 0) return "LightCoral";
                    return "Gainsboro";
                };

                svg
                    .selectAll(".bar")
                    .data(data)
                    .enter()
                    .append("rect")
                    .attr("class", "bar")
                    .attr("x", (d) => x(new Date(d.date)))
                    .attr("y", 0)
                    .attr("width", 10) // Decrease the width of each square
                    .attr("height", 20)
                    .attr("fill", (d) => colorScale(d.polarity));
                // console.log("report timeline", data)
            }
        },

        changeStyle(index){
            this.changeStyleIndex = index
        },

        showDrawerButton(index) {
            this.buttonVisible = index
        },

        reverseList() {
            if(this.reverse) {
                this.displayed = this.displayed.reverse()
            }
        },

        openDrawer(id) {
            this.docDrawerOpen = true,
            this.segement_id = id

        },

        openReportDrawer(reportId) {
            this.reportDrawerOpen = true

            for (let report of this.displayed) {
                if ( reportId == report.id ) {
                    this.selectedReport = report
                }
            }

            console.log("reportID", reportId)

            var segmentIds = []
            for ( let segment of this.selectedReport.segments) {
                segmentIds.push(segment.number) 
            }
            this.allIDs = segmentIds
        }
    },

    mounted(){
       this.showImplementation(this.selectedProvisions[0])
       this.renderInstanceBar()
       this.renderReportBar()
    },

    watch: {
        'displayedTopic': function(){
            // set selected provision default when topic changes
            this.showImplementation(this.selectedProvisions[0])
            this.showImplementation(this.provisionClicked)
            this.renderInstanceBar()
            this.renderReportBar()
            this.changeStyle(0)
            this.showDrawerButton(0)

            // console.log("Sorting", this.reverse)
            // if (this.reverse == '2') {
            //     this.reverse = "1"
            // }
        }
    }
})
</script>


<style scoped>
h1 {
    font-size: 30px;
    margin: 60px 0px 0px 0px;
}

h2 {
    font-size: 24px;
}

h3 {
    padding: 0px;
    margin: 0px;
}
.title {
    text-align: center;
    margin: 40px 50px 20px 50px;
}

.counters {
    padding: 5px 5px;
    margin: 0px;
}

.radio-group {
    float: right;
    padding: 5px 0px 5px 50px;
}

.text-container {
    text-align: left;
    margin: 0px 00px;
}

.provision-divider {
    margin: 5px 0px;
}

.tracker {
    margin: 0 5%;
}

.section-wrapper {
    margin: 0px 50px;
}

.segment-text {
    margin: 0px 0px 0px 0px;
    padding: 0px;
}

.segment-container {
    margin-top: 10px;
    padding-bottom: 10px;
    margin-bottom: 5px;
    border-bottom: 1.3px dashed #CFCFCF;
}

.segment-container:nth-last-child(1) {
    border-bottom: none;
}

.segment-divider {
    margin: 10px 0px;
    border-style: dashed;
}


.timeline {
    text-align: left;
    padding: 0px;
    margin: 0px;
}
.agt-extracts {
    color: darkgray;
    font-size: 16px;
    font-weight: 400;
}

.agt-extracts:hover {
    color: grey;
    cursor: pointer;
}
.changeStyle {
    color: black;
    font-weight: 600;
}

.repo-source {
    margin: 0px;
    padding: 5px 5px 5px 0px;
}

/deep/ .el-drawer__body {
    padding-top: 0px;
}

.source-wrapper {
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

</style>
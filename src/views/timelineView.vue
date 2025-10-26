<template>
    <div class="page-wrapper">
    <trackerHeader />

    <div class="agt-head">
      <div class="breadcrumb">
        <el-link class="country-title" @click="home">Home</el-link>
        <el-icon><CaretRight /></el-icon>
        <el-link id="drawer" class="country-title" @click="toCountryView(this.countryName)">
          {{ this.countryName }} Topics
        </el-link>
        <el-icon><CaretRight /></el-icon>
        <el-link class="country-title current-page">{{ this.topicCategory }}</el-link>
        <el-icon><CaretRight /></el-icon>
        <el-link class="country-title current-page">{{ this.subCategory }}</el-link>
      </div>

      <h1>{{ this.subCategory }}</h1>
    </div>

    <div class="timeline-wrapper">

      <svg
        class="timeline-path"
        :height="height"
        width="100%"
        :style="{
          position: 'absolute',
          left: '0px',
          top: `${svgTopOffset}px`,
          zIndex: 0,
          pointerEvents: 'none'
        }"
      ></svg>

      <div class="timeline-axis">
        <div class="timeline-line"></div>
        <div
          v-for="entry in dotPositions"
          :key="'dot-' + entry.id"
          class="timeline-dot"
          :style="{
            top: `${entry.y - dotRadius}px`,
            left: `calc(50% + ${entry.x}px)`,
            width: `${dotRadius * 2}px`,
            height: `${dotRadius * 2}px`,
            backgroundColor: entry.type === 'agreement' ? '#124191' : '#ffc917'
          }"
          @mouseover="onDotHover(entry.id)"
          @mouseleave="onDotLeave"
          @click="scrollToEntry(entry.id)"
        />

      </div>


      <div id="timeline" class="timeline-container">
        <div
          v-for="entry in timelineData"
          :key="entry.id"
          :id="entry.id"
          class="timeline-entry"
          style="margin-bottom: 2rem;"
        >
          <!-- Agreement Layout -->
          <div v-if="entry.type === 'agreement'" class="custom-card agreement-card">
            <div class="entry-tag-wrapper">
              <span class="entry-tag agreement">
                <el-icon style="margin-right: 4px;"><Document /></el-icon>
                Peace Agreement
              </span>
            </div>
            <div class="card-body">
              <h4>{{ entry.name }}</h4>
              <p><strong>Date:</strong> {{ formatDate(entry.date) }}</p>
              <div v-if="entry.content && entry.content.length > 0" class="text-list">
              <div v-for="(c, idx) in entry.content" :key="idx">
                <span class="text-content">{{ c.text }}</span>
                <el-divider />
              </div>
            </div>

            </div>
          </div>


          <!-- Report Layout -->
          <div v-if="entry.type === 'report'" class="custom-card report-card">
            <div class="entry-tag-wrapper">
              <span class="entry-tag report">
                <el-icon style="margin-right: 4px;"><LocationFilled /></el-icon>
                Implementation Report
                <span class="org-badge">{{ entry.organisation }}</span>
              </span>
            </div>
            <div class="card-body">
              <h4>{{ entry.name }}</h4>
              <p><strong>Date:</strong> {{ formatDate(entry.date) }}</p>
              <div v-if="entry.content && entry.content.length > 0" class="text-list">
                <div v-for="(c, idx) in entry.content" :key="idx">
                  <div class="tag-text-line">
                  <el-tag
                    effect="plain"
                    :type="c.polarity >= 0 ? 'success' : 'danger'"
                    size="small"
                    round
                  >
                    {{ c.polarity >= 0 ? 'positive' : 'negative' }}
                  </el-tag>
                  <span class="text-content">{{ c.text }}</span>
                </div>
                  <el-divider />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>


<script>
import { useRoute } from 'vue-router'
import * as d3 from "d3";


import trackerHeader from '@/components/trackerHeader.vue'
import topicTimelineData from '@/data/topicTimelineData.json'


// import countries from '@/data/countries.json'
// import PAX from '@/data/agt_description_links.json'

export default {
    components: { trackerHeader },

    data() {
      return {
        width: window.innerWidth * 0.5,
        cardPositions: [],
        svgTopOffset: 0,
        height: 0,
        margin: { top: 50, bottom: 50, left: 100, right: 50 },
        dotRadius: 5,
        hoveredDotId: null,
        scrollLock: false,
      };
    },


    computed: {
      yScale() {
        if (!this.timelineData.length || !this.height) return null;

        return d3
          .scaleTime()
          .domain(d3.extent(this.timelineData, (d) => d.date))
          .range([this.height - this.margin.bottom, this.margin.top]);
          // .range([this.margin.top, this.height - this.margin.bottom]);
      },

      dotPositions() {
        if (!this.timelineData.length || !this.yScale) return [];

        const nodes = this.timelineData.map((d) => ({
          ...d,
          y: this.yScale(d.date),
          x: 0 
        }));

        const simulation = d3.forceSimulation(nodes)
          .force("y", d3.forceY(d => d.y).strength(1))
          .force("x", d3.forceX(0)) 
          .force("collide", d3.forceCollide(7)) 
          .stop();

        // Run simulation manually for stability
        for (let i = 0; i < 200; ++i) simulation.tick();

        // console.log("dotPositions", nodes)

        return nodes;
      },

    },

    mounted() {
      this.updateSvgTopOffset();
      window.addEventListener("resize", this.updateSvgTopOffset);

      this.updateTimelineHeight();
      this.getRelativeCardPositions();

      window.addEventListener("resize", this.updateTimelineHeight);

      const container = document.getElementById("timeline");

      window.addEventListener("resize", () => {
        this.updateTimelineHeight();
      });

      if (container) {
          container.addEventListener("scroll", () => {
            this.getRelativeCardPositions();
            this.drawDotToCardPaths();

          });
        }

      this.$nextTick(() => {

        const timelineContainer = document.getElementById("timeline");
        if (timelineContainer) {
          this.height = timelineContainer.clientHeight;
          this.drawDotToCardPaths();
          
        }
      });
    },

    beforeUnmount() {
      window.removeEventListener("resize", this.updateSvgTopOffset);
      window.removeEventListener("resize", this.updateTimelineHeight);

      const container = document.getElementById("timeline");
      if (container) {
        // container.removeEventListener("scroll", this.animatePath);
      }
    },

    methods: {
        home(){
            this.$router.push('/');
        },

        toCountryView(country) {
            this.$router.push({
                name: `country`,
                query: {
                    title: `${country}`
                }
            })
        },


        formatDate(date) {
          if (!date) return "N/A";
          return d3.timeFormat("%Y-%m-%d")(date);
        },

        updateTimelineHeight() {
          this.$nextTick(() => {
            const timelineContainer = document.getElementById("timeline");
            if (timelineContainer) {
              this.height = timelineContainer.clientHeight;
            }
          });
        },


        getRelativeCardPositions() {
          const wrapper = document.querySelector(".timeline-wrapper");
          const wrapperRect = wrapper.getBoundingClientRect();

          const cards = document.querySelectorAll(".custom-card");

          const cardPositions = [];

          cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();

            cardPositions.push({
              id: this.timelineData[index]?.id,
              y: rect.top - wrapperRect.top,
              x: rect.left - wrapperRect.left
            });
          });



          // console.log("cardPositions", cardPositions);
          this.cardPositions = cardPositions;
        },

        updateSvgTopOffset() {
          const wrapper = document.querySelector(".timeline-wrapper");
          const wrapperRect = wrapper.getBoundingClientRect();
          this.svgTopOffset = wrapperRect.top + window.scrollY;
        },

        drawDotToCardPaths() {
          const svg = d3.select(".timeline-path");
          svg.selectAll("*").remove(); 

          const axis = document.querySelector(".timeline-line");
          const wrapper = document.querySelector(".timeline-wrapper");

          if (!axis || !wrapper) return;

          const axisRect = axis.getBoundingClientRect();
          const wrapperRect = wrapper.getBoundingClientRect();
          const axisOffsetX = axisRect.left - wrapperRect.left;

          this.dotPositions.forEach((dot) => {
            const card = this.cardPositions.find(c => c.id === dot.id);
            if (!card) return;

            const x1 = axisOffsetX + dot.x;   
            const y1 = dot.y;

            const x2 = card.x; 
            const y2 = card.y + 20;

            const midX = (x1 + x2) / 2;

            const pathData = `
              M ${x1},${y1}
              C ${midX},${y1} ${midX},${y2} ${x2},${y2}
            `;

            svg.append("path")
              .attr("d", pathData)
              .attr("stroke", "#999")
              .attr("fill", "none")
              .attr("stroke-width", 0.5)
              .attr("data-id", dot.id);
          });
        },

        onDotHover(id) {
          this.hoveredDotId = id;
          d3.selectAll(".timeline-path path")
            .transition()
            .duration(200)
            .attr("stroke-width", function () {
              return d3.select(this).attr("data-id") === id ? 1 : 0.5;
            })
            .attr("stroke", function () {
              return d3.select(this).attr("data-id") === id ? "#333" : "#999";
            });
        },

        onDotLeave() {
          this.hoveredDotId = null;
          d3.selectAll(".timeline-path path")
            .transition()
            .duration(200)
            .attr("stroke-width", 0.5)
            .attr("stroke", "#999");
        },

        scrollToEntry(id) {
          if (this.scrollLock) return;

          const cardEl = document.getElementById(id);
          const container = document.getElementById("timeline");

          if (cardEl && container) {
            // Lock scroll to prevent overlaps
            this.scrollLock = true;

            // Use requestAnimationFrame to delay execution until layout settles
            requestAnimationFrame(() => {
              const cardRect = cardEl.getBoundingClientRect();
              const containerRect = container.getBoundingClientRect();

              const cardOffsetTop = cardRect.top - containerRect.top + container.scrollTop;
              const scrollTarget =
                cardOffsetTop - container.clientHeight / 2 + cardEl.clientHeight / 2;

              container.scrollTo({
                top: scrollTarget,
                behavior: "smooth"
              });

              // Watch for scroll end
              this.waitForScrollToFinish(container, scrollTarget, () => {
                this.scrollLock = false;
              });
            });
          }
        },

        waitForScrollToFinish(container, target, callback) {
          let frame = 0;

          const check = () => {
            const diff = Math.abs(container.scrollTop - target);
            if (diff < 1 || frame > 60) {
              callback();
              return;
            }
            frame++;
            requestAnimationFrame(check);
          };

          requestAnimationFrame(check);
        },

        drawYearLabels() {
          const scale = this.yScale();

          if (!scale) {
            console.warn("drawYearLabels skipped: scale is null");
            return;
          }

          const years = scale.ticks(d3.timeYear.every(1));
          console.log("years", years);

          const svg = d3.select(".timeline-path");
          svg.selectAll(".year-label").remove();

          const formatYear = d3.timeFormat("%Y");

          svg
            .selectAll(".year-label")
            .data(years)
            .enter()
            .append("text")
            .attr("class", "year-label")
            .attr("x", this.margin.left - 10)
            .attr("y", d => scale(d))
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .attr("font-size", 12)
            .attr("fill", "#666")
            .text(d => formatYear(d));
        }


    },

    setup() {
        const $route = useRoute()
        let subCategory = $route.query.subCategory
        let countryName = $route.query.country
        var topicCategory = ""
        let agreements = [];
        let reports = [];

        // Get data from the original file 
        for (let country of topicTimelineData.countries) {
          console.log("checking country", country.name);
            if (country.name === countryName) {
                if (country.Groups) {
                    for (let [category, subcategories] of Object.entries(country.Groups)) {
                        for (let [subcategory, documents] of Object.entries(subcategories)) {
                            if (subcategory === subCategory) {
                                console.log("data used in this page", subcategory, documents);
                                topicCategory = category;
                                agreements = documents.agreements || [];
                                reports = documents.reports || [];
                            }
                        }
                    }
                }
            }
        }

        // console.log("reports", reports)

        function parseDate(yyyymmdd) {
          const str = yyyymmdd.toString();
          return new Date(parseInt(str.substring(0, 4)), parseInt(str.substring(4, 6)) - 1, parseInt(str.substring(6, 8)));
        }

        // Transform documents into timeline data
        const timelineData = [
          ...agreements.map(d => ({
            id: d.id,
            name: d.name,
            date: parseDate(d.date),
            type: "agreement",
            content: d.provisions
          })),
          ...reports.map(d => ({
            id: d.id,
            name: d.name,
            date: parseDate(d.date),
            type: "report",
            organisation: d.organisation,
            content: d.segments
          })),
        ].sort((a, b) => b.date - a.date);

        console.log("timeline data", timelineData);

        return {
            subCategory,
            countryName,
            topicCategory,
            agreements,
            reports,
            timelineData
        }
    }

}

</script>


<style scoped>

.page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* overflow-y: hidden; */
}

.agt-head {
  padding: 1rem 2rem;
  background-color: #f9f9f9;
  flex-shrink: 0; 
}

.timeline-wrapper {
  display: flex;
  flex-grow: 1;
  height: 100%; 
  overflow: hidden;
  /* padding: 0 10vw; */
  padding: 0 0 0 10vw;
}

.timeline-axis {
  position: sticky;
  top: 0;
  width: 80px;
  height: 100%;
  background-color: transparent;
  z-index: 1;
}

.timeline-line {
  position: absolute;
  top: 0;
  left: 50%;
  width: 2px;
  height: 100%;
  background-color: #ccc;
}

.timeline-dot {
  position: absolute;
  /* width: 10px;
  height: 10px; */
  border-radius: 50%;
  z-index: 1;
  transform: translateX(-50%);
}


.timeline-container {
  flex: 1;
  overflow-y: auto;
  /* padding: 2rem 5rem; */
  padding: 2rem 10rem 2rem 5rem;
  /* height: 100%; */
  position: relative;
}

.timeline-path path {
  transition: stroke-dashoffset 0.25s ease-out;
}



h3 {
  margin-bottom: 10px;
}

h4 {
  font-size: 16px;
  margin: 10px 0;
}

.el-collapse-item {
  font-size: 14px;
}


.text-list {
  text-align: left;
}

::v-deep .el-card {
    text-align: left;
}

::v-deep .el-divider {
  margin: 5px 0;
}

/* .entry-tag {
  display: inline-block;
  padding: 0.3rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: black;
  border: 1px solid #ccc;
  border-radius: 999px;
  align-items: center;
} */

.entry-tag.agreement {
  background-color: #eaf2ff;
  color: #124191;
}

.entry-tag.report {
  color: #ffc917;
  background-color: #fffbec;

  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.org-badge {
  background-color: #fffbec;
  color: black;
  font-size: 0.7rem;
  font-weight: 500;
  /* padding: 0.15rem 0.5rem; */
  border-radius: 999px;
  white-space: nowrap;
}


.custom-card {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s ease;
  text-align: left;
}

.custom-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.entry-tag-wrapper {
  background-color: #f5f7fa;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #ebeef5;
}

.entry-tag {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 600;
  
  padding: 0.25rem 0.6rem;
  border-radius: 999px;
}

.card-body {
  padding: 1rem;
}

.card-body h4 {
  margin: 0.5rem 0 0.25rem;
}

.text-list {
  margin-top: 0.75rem;
}

.tag-text-line {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.text-content {
  flex: 1;
  line-height: 1.4;
}

</style>
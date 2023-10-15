const url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
const w = 1200;
const h = 550;
const padding = 60;
const svg = d3.select("svg")
const baseTemp = 8.66;
const colSet =[
    {col:"rgb(69, 117, 180)", num:2.8},
    {col:"rgb(116, 173, 209)", num:3.9},
    {col:"rgb(171, 217, 233)", num:5.0},
    {col:"rgb(224, 243, 248)", num:6.1},
    {col:"rgb(255, 255, 191)", num:7.2},
    {col:"rgb(254, 224, 144)", num:8.3},
    {col:"rgb(253, 174, 97)", num:9.5},
    {col:"rgb(244, 109, 67)", num:10.6},
    {col:"rgb(215, 48, 39)", num:11.7},
] 
 
const colDataSet =[2.8,3.9,5.0,6.1,7.2,8.3,9.5,10.6,11.7,12.8]




const drawCanvas = ()=>{
    svg.attr("width",w).attr("height", h);
}
const rest=(dataset)=>{
    const xScale = d3.scaleBand().domain(dataset.map(obj=>obj.year)).range([padding,w-padding]);
    const yScale = d3.scaleBand().domain([0,1,2,3,4,5,6,7,8,9,10,11]).range([padding,h-padding]);

    const xAxis = d3.axisBottom(xScale).tickValues(xScale.domain().filter(y=>y%10===0));
    const yAxis = d3.axisLeft(yScale).tickValues(yScale.domain()).tickFormat((month)=>{
        let date = new Date(0);
        date.setUTCMonth(month);
        let format = d3.utcFormat("%B");
        return format(date)
    });

    svg.append("g").attr("id","x-axis").attr("transform",`translate(0,${h-padding})`).call(xAxis);
    svg.append("g").attr("id","y-axis").attr("transform",`translate(${padding},0)`).call(yAxis);

    svg.selectAll("rect").data(dataset).enter().append("rect").attr("class","cell cell-bor")
    .attr("data-month",d=>d.month-1)
    .attr("data-year",d=>d.year)
    .attr("data-temp",d=>baseTemp+d.variance)
    .attr("fill",d=>{
        let val = baseTemp+d.variance;
        if(val <= 3.9){
            return colSet[0].col;
        }
        else if(val <= 5){
            return colSet[1].col;
        }
        else if(val <= 6.1){
            return colSet[2].col;
        }
        else if(val <= 7.2){
            return colSet[3].col;
        }
        else if(val <= 8.3){
            return colSet[4].col;
        }
        else if(val <= 9.5){
            return colSet[5].col;
        }
        else if(val <= 10.6){
            return colSet[6].col;
        }
        else if(val <= 11.7){
            return colSet[7].col;
        }
        else if(val <= 12.8){
            return colSet[8].col;
        }
        else {
            return "#a50026";
        }
    })
    .attr("width",(w-(2*padding))/(d3.max(dataset,d=>d.year)-d3.min(dataset,d=>d.year)))
    .attr("height",(h-(2*padding))/12)
    .attr("x",d=>xScale(d.year))
    .attr("y",d=>yScale(d.month-1))
    .on("mouseover",(e,d)=>{
        let x = $(e.target).offset();
        let tt = d3.select("#tooltip");

        let date = new Date(0)
        date.setUTCMonth(d.month-1)
        let format =new d3.utcFormat("%B")

        tt.attr("data-year",d.year)
        .style("opacity","1")
        .style("left",`${x.left-30}px`)
        .style("top",`${x.top-80}px`)

        tt.html(`${d.year}-${format(date)}<br/>${(baseTemp + d.variance).toFixed(1)}℃<br/>${d.variance > 0 ? "+" : ""}${(d.variance).toFixed(1)}℃`)
    })
    .on("mouseout",d=>{
        let tt= d3.select("#tooltip")
        tt.style("opacity","0")
        .style("left","0")
        .style("top","0")
    });

    const legend =d3.select("body").append("svg").attr("id","legend").attr("width",500).attr("height",60);
    const colXScale = d3.scaleBand().domain([...colDataSet]).range([0,500]);
    const colXAxis = d3.axisBottom(colXScale).tickFormat(d3.format(".1f"));
    legend.append("g").attr("id","col-x-axis").attr("transform",`translate(0,30)`).call(colXAxis);
    legend.selectAll("rect").data(colSet).enter().append("rect")
    .attr("width",50)
    .attr("height",30)
    .attr("y",0)
    .attr("x",d=>colXScale(d.num)+25)
    .attr("fill",d=>d.col)
    .attr("stroke","white")
}

fetch(url).then(resp=>resp.json()).then(rawData=>{
    drawCanvas()
    rest(rawData.monthlyVariance)
}).catch(err=>console.log(err));
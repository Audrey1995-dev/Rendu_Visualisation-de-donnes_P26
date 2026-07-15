const width = 1200;
const height = 2000;
const svg = d3.select("#chart")
  .attr("width", width)
  .attr("height", height);
const slider = d3.select("#slider");
const yearLabel = d3.select("#yearLabel");
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

const barWidth = 1000;
const barHeight = 420;

const barMargin = {
  top: 35,
  right: 40,
  bottom: 65,
  left: 75
};

const barSvg = d3.select("#barChart")
  .attr("viewBox", `0 0 ${barWidth} ${barHeight}`);

function isAggregate(country) {
  return (
    country.startsWith("-") ||
    country.startsWith(">") ||
    country === "Pays d'origine - total" ||
    country === "Autres" ) ;
}

const continents = {
  Europe: [
    "Suisse", "Albanie", "Andorre", "Belgique", "Bulgarie", "Danemark",
    "Allemagne", "Finlande", "France", "Grèce", "Royaume-Uni", "Irlande",
    "Islande", "Italie", "Liechtenstein", "Luxembourg", "Malte", "Monaco",
    "Pays-Bas", "Norvège", "Autriche", "Pologne", "Portugal", "Roumanie",
    "Saint-Marin", "Suède", "Espagne", "Turquie", "Hongrie", "Chypre",
    "Slovaquie", "République tchèque", "Serbie", "Croatie", "Slovénie",
    "Bosnie et Herzégovine", "Monténégro", "Macédoine du Nord", "Estonie",
    "Lettonie", "Lituanie", "Moldova", "Ukraine", "Russie"],
  Amérique: [
    "Etats-Unis", "Canada", "Argentine", "Bolivie", "Brésil", "Chili",
    "Équateur", "Haïti", "Jamaïque", "Colombie", "Cuba", "Mexique",
    "Pérou", "Uruguay", "Venezuela"],
  Asie: [
    "Arménie", "Azerbaïdjan", "Géorgie", "Afghanistan", "Bhoutan",
    "Taïwan (Taipei chinois)", "Chine", "Hong Kong", "Inde", "Iraq",
    "Iran", "Israël", "Japon", "Népal", "Pakistan", "Philippines",
    "Singapour", "Corée (Sud)", "Syrie", "Thaïlande", "Vietnam",
    "Bangladesh", "Palestine", "Kazakshtan", "Kirghizistan",
    "Tadjikistan", "Ouzbékistan"],
  Afrique: [
    "Algérie", "Gabon", "Guinée-Bissau", "Congo (Kinshasa)", "Mali",
    "Burkina Faso", "Zimbabwe", "Sénégal", "Afrique du sud", "Tunisie",
    "Egypte"],
  Océanie: [
    "Australie", "Nouvelle-Zélande"]
};

function getContinent(country) {
  for (const continent in continents) {
    if (continents[continent].includes(country)) {
      return continent;
    }
  }
  return null;
}

const colors = {
  Europe: "#619bd8",
  Amérique: "#619bd8",
  Asie: "#619bd8",
  Afrique: "#619bd8",
  Océanie: "#619bd8"
};

const centers = {
  Europe:   { x: 230, y: 230 },
  Amérique: { x: 600, y: 230 },
  Asie:     { x: 970, y: 230 },
  Afrique:  { x: 410, y: 600 },
  Océanie:  { x: 790, y: 600 }
};

function drawContinentLabels() {
  svg.selectAll(".continent-label")
    .data(Object.keys(centers))
    .enter()
    .append("text")
    .attr("class", "continent-label")
    .attr("x", d => centers[d].x)
    .attr("y", d => centers[d].y - 150)
    .attr("text-anchor", "middle")
    .text(d => d);
}

drawContinentLabels();

function updateBarChart(barData) {
  const innerWidth =
    barWidth - barMargin.left - barMargin.right;

  const innerHeight =
    barHeight - barMargin.top - barMargin.bottom;

  const x = d3.scaleBand()
    .domain(barData.map(d => d.continent))
    .range([0, innerWidth])
    .padding(0.25);

  const y = d3.scaleLinear()
    .domain([0, d3.max(barData, d => d.films) || 1])
    .nice()
    .range([innerHeight, 0]);

  const chartGroup = barSvg
    .selectAll(".bar-chart-group")
    .data([null])
    .join("g")
    .attr("class", "bar-chart-group")
    .attr(
      "transform",
      `translate(${barMargin.left},${barMargin.top})`
    );

  // Axe horizontal
  chartGroup.selectAll(".x-axis")
    .data([null])
    .join("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${innerHeight})`)
    .call(d3.axisBottom(x));

  // Axe vertical
  chartGroup.selectAll(".y-axis")
    .data([null])
    .join("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y).ticks(6));

  // Barres
  const bars = chartGroup
    .selectAll(".bar")
    .data(barData, d => d.continent);

  bars.exit().remove();

  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d.continent))
    .attr("width", x.bandwidth())
    .attr("y", innerHeight)
    .attr("height", 0)
    .attr("fill", d => colors[d.continent])
    .merge(bars)
    .transition()
    .duration(600)
    .attr("x", d => x(d.continent))
    .attr("width", x.bandwidth())
    .attr("y", d => y(d.films))
    .attr("height", d => innerHeight - y(d.films))
    .attr("fill", d => colors[d.continent]);

  // Valeurs au-dessus des barres
  const values = chartGroup
    .selectAll(".bar-value")
    .data(barData, d => d.continent);

  values.exit().remove();

  values.enter()
    .append("text")
    .attr("class", "bar-value")
    .attr("text-anchor", "middle")
    .merge(values)
    .transition()
    .duration(600)
    .attr("x", d => x(d.continent) + x.bandwidth() / 2)
    .attr("y", d => y(d.films) - 8)
    .text(d => d.films);
}

d3.json("data-simple.json").then(data => {

data = data
.filter(d => !isAggregate(d.pays))
.filter(d => getContinent(d.pays) !== null);

const years = [...new Set(data.map(d => d.annee))].sort((a, b) => a - b);

slider
    .attr("min", 0)
    .attr("max", years.length - 1)
    .attr("step", 1)
    .attr("value", years.length - 1);

function update(year) {
    yearLabel.text(year);
    const yearData = data.filter(d => d.annee === year);
    const radiusScale = d3.scaleSqrt()
      .domain([0, d3.max(yearData, d => d.films)])
      .range([4, 70]);
     yearData.forEach(d => {
      d.radius = radiusScale(d.films);
      d.continent = getContinent(d.pays);
    });

    const totalsByContinent = Object.keys(continents).map(continent => ({
    continent: continent, films: d3.sum(
    yearData.filter(d => d.continent === continent),
    d => d.films
     )
    }));

    updateBarChart(totalsByContinent);

    const simulation = d3.forceSimulation(yearData)
      .force("x", d3.forceX(d => centers[d.continent].x).strength(0.18))
      .force("y", d3.forceY(d => centers[d.continent].y).strength(0.18))
      .force("collision", d3.forceCollide(d => d.radius + 2))
      .stop();
    for (let i = 0; i < 300; i++) {
      simulation.tick();
    }
    const bubbles = svg.selectAll(".bubble")
      .data(yearData, d => d.pays);
    bubbles.exit().remove();
    bubbles
      .transition()
      .duration(600)
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", d => d.radius)
      .attr("fill", d => colors[d.continent]);
    bubbles.enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y)
      .attr("r", 0)
      .attr("fill", d => colors[d.continent])
      .attr("opacity", 0.8)
      .on("mouseover", function(event, d) {
        tooltip
          .style("opacity", 1)
          .html(`<strong>${d.pays}</strong><br>${d.continent}<br>${d.films} films<br>${d.annee}`);
      })
      .on("mousemove", function(event) {
        tooltip
          .style("left", (event.pageX + 15) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", function() {
        tooltip.style("opacity", 0);
      })
      .transition()
      .duration(600)
      .attr("r", d => d.radius);

    const labels = svg.selectAll(".label")
      .data(yearData, d => d.pays);

    labels.exit().remove();

    labels.enter()
  
  .append("text")
  .attr("class", "label")
  .merge(labels)
  .attr("x", d => d.x)
  .attr("y", d => d.y)
  .attr("text-anchor", "middle")
  .attr("dominant-baseline", "middle")
  .text(d => d.films >= 50 ? d.pays : "");
  }
  update(years[years.length - 1]);

slider.on("input", function() {
    update(years[this.value]);
  });

});
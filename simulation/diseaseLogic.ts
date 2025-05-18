import * as d3 from "d3"
import {
  generateErdosRenyiGraph,
  generateWattsStrogatzGraph,
  generateBarabasiAlbertGraph,
  generateCommunityNetwork,
} from "../utils/graphGenerators"

export function runSimulation(form, svgRef) {
  const width = 600
  const height = 400

  let graph
  switch (form.graphType) {
    case "erdos":
      graph = generateErdosRenyiGraph(form.nodes, 0.05)
      break
    case "watts":
      graph = generateWattsStrogatzGraph(form.nodes, 4, 0.2)
      break
    case "barabasi":
      graph = generateBarabasiAlbertGraph(form.nodes, 3)
      break
    case "community":
      graph = generateCommunityNetwork(form.nodes, 5, 0.1, 0.01)
      break
    default:
      graph = generateErdosRenyiGraph(form.nodes, 0.05)
  }

  // Enhanced node properties
  const nodes = graph.nodes.map((n, id) => ({
    ...n,
    id,
    // Disease state
    state: id < form.infected ? "infected" : "susceptible",
    infectedTime: id < form.infected ? 0 : null,
    // Node characteristics that affect disease dynamics
    age: Math.floor(Math.random() * 80) + 10, // Age between 10-90
    immunity: Math.random(), // Immunity level (0-1)
    healthScore: Math.random(), // General health (0-1)
    // Visualization properties
    highlighted: false,
    processingContact: false,
    pendingStateChange: null,
  }))

  const links = graph.links.map((link) => ({
    ...link,
    active: false,
    weight: Math.random(),
    // Visual properties for transmission animation
    transmissionActive: false,
    transmissionProgress: 0,
  }))

  const svg = d3.select(svgRef.current)
  svg.selectAll("*").remove()
  const container = svg.append("g")

  const zoom = d3
    .zoom()
    .scaleExtent([0.1, 10])
    .on("zoom", (event) => {
      container.attr("transform", event.transform)
    })
  svg.call(zoom)

  const initialScale = 0.2
  const initialTranslate = [width / 2, height / 2]
  svg.call(zoom.transform, d3.zoomIdentity.translate(initialTranslate[0], initialTranslate[1]).scale(initialScale))

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(links)
        .id((d) => d.id)
        .distance(form.radius * 40 * 40),
    )
    .force("charge", d3.forceManyBody().strength(-40))
    .force("center", d3.forceCenter(width / 2, height / 2))

  // Create a group for transmission animations
  const transmissionGroup = container.append("g").attr("class", "transmissions")

  // Create links
  const link = container
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(links)
    .join("line")
    .attr("stroke-width", 1)
    .attr("stroke", "#777")
    .attr("stroke-opacity", 0.15)

  // Create nodes
  const node = container
    .append("g")
    .attr("class", "nodes")
    .selectAll("circle")
    .data(nodes)
    .join("circle")
    .attr("r", 10)
    .attr("fill", getNodeColor)
    .attr("stroke", "#fff")
    .attr("stroke-width", 1.5)
    .attr("stroke-opacity", (d) => (d.highlighted ? 1 : 0.5))
    .call(drag(simulation))

  // Add tooltips for nodes
  node
    .append("title")
    .text(
      (d) => `Age: ${d.age}, Health: ${Math.round(d.healthScore * 100)}%, Immunity: ${Math.round(d.immunity * 100)}%`,
    )

  simulation.on("tick", () => {
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y)
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y)
      .attr("stroke", (d) => (d.active ? "orange" : "#555"))
      .attr("stroke-opacity", (d) => (d.active ? 0.8 : 0.1))
  })

  function getNodeColor(d) {
    switch (d.state) {
      case "susceptible":
        return "blue"
      case "infected":
        return "red"
      case "critical":
        return "purple"
      case "recovered":
        return "green"
      case "dead":
        return "white"
      default:
        return "gray"
    }
  }

  // Function to update node appearance
  function updateNodeAppearance() {
    node
      .attr("fill", getNodeColor)
      .attr("stroke-opacity", (d) => (d.highlighted || d.processingContact ? 1 : 0.5))
      .attr("stroke-width", (d) => (d.highlighted || d.processingContact ? 2.5 : 1.5))
  }

  // Function to animate transmission between nodes
  async function animateTransmission(sourceNode, targetNode, link, successful) {
    return new Promise((resolve) => {
      // Mark the link as active
      link.active = true

      // Create a transmission particle
      const particle = transmissionGroup
        .append("circle")
        .attr("r", 4)
        .attr("fill", successful ? "red" : "yellow")
        .attr("opacity", 0.8)

      // Animate the particle along the link
      const duration = 1000
      const startTime = Date.now()

      function updateParticle() {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)

        // Position the particle along the path
        const x = sourceNode.x + (targetNode.x - sourceNode.x) * progress
        const y = sourceNode.y + (targetNode.y - sourceNode.y) * progress

        particle.attr("cx", x).attr("cy", y)

        if (progress < 1) {
          requestAnimationFrame(updateParticle)
        } else {
          // Animation complete
          particle.transition().duration(200).attr("r", 12).attr("opacity", 0).remove()
          link.active = false
          resolve()
        }
      }

      updateParticle()
    })
  }

  // Process disease state transitions
  async function processStateTransitions() {
    // Apply all pending state changes
    let stateChangesApplied = false

    nodes.forEach((node) => {
      if (node.pendingStateChange) {
        node.state = node.pendingStateChange
        node.pendingStateChange = null
        stateChangesApplied = true

        // Reset processing flag
        node.processingContact = false

        // If became infected, initialize infection time
        if (node.state === "infected") {
          node.infectedTime = 0
        }
      }
    })

    if (stateChangesApplied) {
      // Update node colors to reflect new states
      updateNodeAppearance()

      // Restart simulation with low alpha to adjust positions slightly
      simulation.alpha(0.1).restart()
    }

    return stateChangesApplied
  }

  // Process disease progression for infected nodes
  async function processDiseaseProgression() {
    let progressionOccurred = false

    nodes.forEach((node) => {
      // Skip nodes that are already processing a contact
      if (node.processingContact) return

      // Process infected nodes for potential recovery or worsening
      if (node.state === "infected") {
        node.infectedTime += 1

        // Check if infection duration has reached recovery threshold
        if (node.infectedTime >= form.recoveryDays) {
          node.processingContact = true

          // Calculate recovery probability based on health, age, and immunity
          const ageRiskFactor = Math.min(1, node.age / 100) // Higher age = higher risk
          const healthFactor = node.healthScore // Higher health = better chance of recovery
          const immunityFactor = node.immunity // Higher immunity = better chance of recovery

          const recoveryChance = (form.recoveryRate * (healthFactor + immunityFactor)) / (1 + ageRiskFactor)

          if (Math.random() < recoveryChance) {
            // Will recover
            node.pendingStateChange = "recovered"
          } else {
            // Will become critical
            node.pendingStateChange = "critical"
          }

          progressionOccurred = true
        }
      }
      // Process critical nodes for potential death or recovery
      else if (node.state === "critical") {
        node.processingContact = true

        // Calculate survival probability based on health and age
        const survivalChance = 0.5 * node.healthScore * (1 - Math.min(0.8, node.age / 100))

        if (Math.random() < survivalChance) {
          // Will recover
          node.pendingStateChange = "recovered"
        } else {
          // Will die
          node.pendingStateChange = "dead"
        }

        progressionOccurred = true
      }
    })

    return progressionOccurred
  }

  // Main simulation loop
  async function runSimulationLoop() {
    // Process any pending state transitions first
    await processStateTransitions()

    // Process disease progression
    const progressionOccurred = await processDiseaseProgression()
    if (progressionOccurred) {
      // If progression occurred, apply state changes before processing contacts
      await processStateTransitions()
      // Wait a bit to let the user see the changes
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    // Find active infected nodes
    const activeInfected = nodes.filter((n) => n.state === "infected" && !n.processingContact)

    // If no active infected nodes, end simulation or wait
    if (activeInfected.length === 0) {
      // Check if there are any nodes in critical condition
      const criticalNodes = nodes.filter((n) => n.state === "critical")
      if (criticalNodes.length > 0) {
        // Process critical nodes and continue
        await new Promise((resolve) => setTimeout(resolve, 500))
        runSimulationLoop()
      } else {
        // No more active disease, simulation complete
        console.log("Simulation complete")
        return
      }
    } else {
      // Process a random infected node
      const infectedNode = activeInfected[Math.floor(Math.random() * activeInfected.length)]

      // Mark this node as processing a contact
      infectedNode.processingContact = true
      infectedNode.highlighted = true
      updateNodeAppearance()

      // Find susceptible neighbors
      const susceptibleNeighbors = []

      links.forEach((link) => {
        const sourceId = typeof link.source === "object" ? link.source.id : link.source
        const targetId = typeof link.target === "object" ? link.target.id : link.target

        if (sourceId === infectedNode.id) {
          const neighbor = nodes.find((n) => n.id === targetId)
          if (neighbor && neighbor.state === "susceptible" && !neighbor.processingContact) {
            susceptibleNeighbors.push({ neighbor, link })
          }
        } else if (targetId === infectedNode.id) {
          const neighbor = nodes.find((n) => n.id === sourceId)
          if (neighbor && neighbor.state === "susceptible" && !neighbor.processingContact) {
            susceptibleNeighbors.push({ neighbor, link })
          }
        }
      })

      // If there are susceptible neighbors, process a contact
      if (susceptibleNeighbors.length > 0) {
        const { neighbor, link } = susceptibleNeighbors[Math.floor(Math.random() * susceptibleNeighbors.length)]

        // Mark the neighbor as processing a contact
        neighbor.processingContact = true
        neighbor.highlighted = true
        updateNodeAppearance()

        // Calculate infection probability
        const baseInfectionChance = form.transmissionRate
        const ageRiskFactor = Math.min(1, neighbor.age / 100) // Higher age = higher risk
        const immunityProtection = neighbor.immunity // Higher immunity = lower risk

        // Final infection chance
        const infectionChance = baseInfectionChance * (1 + ageRiskFactor) * (1 - immunityProtection * 0.8)

        // Determine if infection occurs
        const infectionOccurs = Math.random() < infectionChance

        // Animate the transmission
        await animateTransmission(infectedNode, neighbor, link, infectionOccurs)

        // Set pending state change if infection occurs
        if (infectionOccurs) {
          neighbor.pendingStateChange = "infected"
        }

        // Reset highlighting
        infectedNode.highlighted = false
        neighbor.highlighted = false
        updateNodeAppearance()

        // Reset processing flag for infected node
        infectedNode.processingContact = false
      } else {
        // No susceptible neighbors, reset processing flag
        infectedNode.processingContact = false
        infectedNode.highlighted = false
        updateNodeAppearance()
      }

      // Continue simulation after a short delay
      await new Promise((resolve) => setTimeout(resolve, 200))
      runSimulationLoop()
    }
  }

  // Start the simulation
  runSimulationLoop()
}

function drag(simulation) {
  return d3
    .drag()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    })
    .on("drag", (event, d) => {
      d.fx = event.x
      d.fy = event.y
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    })
}

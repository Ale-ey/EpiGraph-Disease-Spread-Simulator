"use client"

import { useState, useRef } from "react"
import { Menu, X, ChevronDown, Github, Twitter, Linkedin, Play, RefreshCw, Info } from "lucide-react"
import { runSimulation } from "./simulation/diseaseLogic"

export default function DiseaseSimulationUI() {
  const [form, setForm] = useState({
    nodes: 100, // Reduced for better performance
    edges: 300,
    duration: 60,
    infected: 5,
    radius: 2.5,
    transmissionRate: 0.2,
    recoveryRate: 0.5,
    recoveryDays: 5,
    graphType: "erdos",
  })

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [showTooltip, setShowTooltip] = useState("")
  const svgRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: name === "graphType" ? value : Number.parseFloat(value) })
  }

  const handleSubmit = () => {
    setIsSimulationRunning(true)
    runSimulation(form, svgRef)
  }

  const tooltips = {
    graphType: "The network structure that determines how nodes are connected",
    transmissionRate: "Probability of disease transmission during contact between infected and susceptible individuals",
    recoveryRate: "Probability of recovery after the recovery period",
    recoveryDays: "Number of days until potential recovery",
    infected: "Initial number of infected individuals",
    duration: "Total simulation duration in days",
    nodes: "Total number of individuals in the network",
    radius: "Controls the distance between nodes in the visualization",
  }

  return (
    <div className="min-h-screen bg-[#0a1214] text-[#e6f0f0] flex flex-col">
      {/* Header */}
      <header className="border-b border-[#2a3638] bg-[#0a1214]/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-serif text-[#2dd4bf] mr-2">EpiGraph</h1>
            <span className="text-xs bg-[#2a3638] px-2 py-1 rounded-full">Simulation</span>
          </div>

          <div className="hidden md:flex space-x-6 text-sm">
            <a href="#about" className="hover:text-[#2dd4bf] transition-colors">
              About
            </a>
            <a href="#simulation" className="hover:text-[#2dd4bf] transition-colors">
              Simulation
            </a>
            <a href="#methodology" className="hover:text-[#2dd4bf] transition-colors">
              Methodology
            </a>
            <a href="#team" className="hover:text-[#2dd4bf] transition-colors">
              Team
            </a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-[#2dd4bf]">
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0a1214] border-t border-[#2a3638] py-4">
            <div className="container mx-auto px-4 flex flex-col space-y-3">
              <a href="#about" className="hover:text-[#2dd4bf] transition-colors">
                About
              </a>
              <a href="#simulation" className="hover:text-[#2dd4bf] transition-colors">
                Simulation
              </a>
              <a href="#methodology" className="hover:text-[#2dd4bf] transition-colors">
                Methodology
              </a>
              <a href="#team" className="hover:text-[#2dd4bf] transition-colors">
                Team
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="about" className="py-16 md:py-24 border-b border-[#2a3638]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#2dd4bf] mb-6">
                Disease Spread Simulation
              </h1>
              <p className="text-lg mb-8 text-[#a8b7b7] leading-relaxed">
                Explore how infectious diseases propagate through different network structures. Our advanced simulation
                tool helps visualize epidemic patterns using graph theory and epidemiological models.
              </p>
              <div className="bg-[#1a2224] p-4 rounded-lg border border-[#2a3638] mb-6">
                <p className="text-[#a8b7b7]">
                  <span className="text-[#2dd4bf] font-medium">Semester Project:</span> This is a semester project for
                  the Design Analysis and Algorithm course under the supervision of Prof. Aimal Rextin.
                </p>
              </div>
              <a
                href="#simulation"
                className="inline-flex items-center bg-[#2a3638] hover:bg-[#3a4648] text-[#2dd4bf] px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Start Simulation <ChevronDown className="ml-2" size={16} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1a2224] p-4 rounded-lg border border-[#2a3638]">
                <img
                  src="/images/ali-haider.png"
                  alt="Ali Haider"
                  className="w-full h-auto rounded-lg mb-3 aspect-square object-cover"
                />
                <h3 className="font-medium text-[#2dd4bf]">Ali Haider</h3>
                <p className="text-sm text-[#a8b7b7]">Software Engineer, BESE 14 B</p>
              </div>
              <div className="bg-[#1a2224] p-4 rounded-lg border border-[#2a3638]">
                <img
                  src="/images/ammer-saeed.png"
                  alt="Ammer Saeed"
                  className="w-full h-auto rounded-lg mb-3 aspect-square object-cover"
                />
                <h3 className="font-medium text-[#2dd4bf]">Ammer Saeed</h3>
                <p className="text-sm text-[#a8b7b7]">Software Engineer, BESE 14 B</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Simulation Section */}
      <section id="simulation" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-[#2dd4bf] mb-12 text-center">
            Interactive Simulation Environment
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls Panel */}
            <div className="lg:col-span-1">
              <div className="bg-[#1a2224] rounded-xl border border-[#2a3638] p-6 shadow-xl h-full">
                <h3 className="text-xl font-serif text-[#2dd4bf] mb-6 border-b border-[#2a3638] pb-3">
                  Simulation Parameters
                </h3>

                <div className="space-y-5">
                  <div>
                    <div className="flex items-center mb-1">
                      <label className="block text-sm font-medium text-[#a8b7b7]">Graph Type</label>
                      <button
                        className="ml-2 text-[#2dd4bf] hover:text-[#14b8a6]"
                        onMouseEnter={() => setShowTooltip("graphType")}
                        onMouseLeave={() => setShowTooltip("")}
                      >
                        <Info size={14} />
                      </button>
                    </div>
                    {showTooltip === "graphType" && (
                      <div className="text-xs bg-[#2a3638] p-2 rounded mb-2 text-[#e6f0f0]">{tooltips.graphType}</div>
                    )}
                    <select
                      name="graphType"
                      value={form.graphType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-md bg-[#0a1214] border border-[#2a3638] text-[#e6f0f0] focus:border-[#2dd4bf] focus:ring-1 focus:ring-[#2dd4bf] transition-colors"
                    >
                      <option value="erdos">Erdős–Rényi (Random)</option>
                      <option value="watts">Watts–Strogatz (Small World)</option>
                      <option value="barabasi">Barabási–Albert (Scale Free)</option>
                      <option value="community">Community Network</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-[#a8b7b7]">Transmission Rate</label>
                        <button
                          className="ml-2 text-[#2dd4bf] hover:text-[#14b8a6]"
                          onMouseEnter={() => setShowTooltip("transmissionRate")}
                          onMouseLeave={() => setShowTooltip("")}
                        >
                          <Info size={14} />
                        </button>
                      </div>
                      {showTooltip === "transmissionRate" && (
                        <div className="text-xs bg-[#2a3638] p-2 rounded mb-2 text-[#e6f0f0]">
                          {tooltips.transmissionRate}
                        </div>
                      )}
                      <div className="flex items-center">
                        <input
                          type="range"
                          name="transmissionRate"
                          min="0"
                          max="1"
                          step="0.01"
                          value={form.transmissionRate}
                          onChange={handleChange}
                          className="w-full accent-[#2dd4bf]"
                        />
                        <span className="ml-2 text-sm w-10 text-right">{form.transmissionRate}</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-[#a8b7b7]">Recovery Rate</label>
                        <button
                          className="ml-2 text-[#2dd4bf] hover:text-[#14b8a6]"
                          onMouseEnter={() => setShowTooltip("recoveryRate")}
                          onMouseLeave={() => setShowTooltip("")}
                        >
                          <Info size={14} />
                        </button>
                      </div>
                      {showTooltip === "recoveryRate" && (
                        <div className="text-xs bg-[#2a3638] p-2 rounded mb-2 text-[#e6f0f0]">
                          {tooltips.recoveryRate}
                        </div>
                      )}
                      <div className="flex items-center">
                        <input
                          type="range"
                          name="recoveryRate"
                          min="0"
                          max="1"
                          step="0.01"
                          value={form.recoveryRate}
                          onChange={handleChange}
                          className="w-full accent-[#2dd4bf]"
                        />
                        <span className="ml-2 text-sm w-10 text-right">{form.recoveryRate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-[#a8b7b7]">Recovery Days</label>
                        <button
                          className="ml-2 text-[#2dd4bf] hover:text-[#14b8a6]"
                          onMouseEnter={() => setShowTooltip("recoveryDays")}
                          onMouseLeave={() => setShowTooltip("")}
                        >
                          <Info size={14} />
                        </button>
                      </div>
                      {showTooltip === "recoveryDays" && (
                        <div className="text-xs bg-[#2a3638] p-2 rounded mb-2 text-[#e6f0f0]">
                          {tooltips.recoveryDays}
                        </div>
                      )}
                      <input
                        type="number"
                        name="recoveryDays"
                        value={form.recoveryDays}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-[#0a1214] border border-[#2a3638] text-[#e6f0f0]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-[#a8b7b7]">Initial Infected</label>
                        <button
                          className="ml-2 text-[#2dd4bf] hover:text-[#14b8a6]"
                          onMouseEnter={() => setShowTooltip("infected")}
                          onMouseLeave={() => setShowTooltip("")}
                        >
                          <Info size={14} />
                        </button>
                      </div>
                      {showTooltip === "infected" && (
                        <div className="text-xs bg-[#2a3638] p-2 rounded mb-2 text-[#e6f0f0]">{tooltips.infected}</div>
                      )}
                      <input
                        type="number"
                        name="infected"
                        value={form.infected}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-[#0a1214] border border-[#2a3638] text-[#e6f0f0]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-[#a8b7b7]">Simulation Days</label>
                        <button
                          className="ml-2 text-[#2dd4bf] hover:text-[#14b8a6]"
                          onMouseEnter={() => setShowTooltip("duration")}
                          onMouseLeave={() => setShowTooltip("")}
                        >
                          <Info size={14} />
                        </button>
                      </div>
                      {showTooltip === "duration" && (
                        <div className="text-xs bg-[#2a3638] p-2 rounded mb-2 text-[#e6f0f0]">{tooltips.duration}</div>
                      )}
                      <input
                        type="number"
                        name="duration"
                        value={form.duration}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-[#0a1214] border border-[#2a3638] text-[#e6f0f0]"
                      />
                    </div>

                    <div>
                      <div className="flex items-center mb-1">
                        <label className="block text-sm font-medium text-[#a8b7b7]">Number of Nodes</label>
                        <button
                          className="ml-2 text-[#2dd4bf] hover:text-[#14b8a6]"
                          onMouseEnter={() => setShowTooltip("nodes")}
                          onMouseLeave={() => setShowTooltip("")}
                        >
                          <Info size={14} />
                        </button>
                      </div>
                      {showTooltip === "nodes" && (
                        <div className="text-xs bg-[#2a3638] p-2 rounded mb-2 text-[#e6f0f0]">{tooltips.nodes}</div>
                      )}
                      <input
                        type="number"
                        name="nodes"
                        value={form.nodes}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-md bg-[#0a1214] border border-[#2a3638] text-[#e6f0f0]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center mb-1">
                      <label className="block text-sm font-medium text-[#a8b7b7]">Edge Length (Radius)</label>
                      <button
                        className="ml-2 text-[#2dd4bf] hover:text-[#14b8a6]"
                        onMouseEnter={() => setShowTooltip("radius")}
                        onMouseLeave={() => setShowTooltip("")}
                      >
                        <Info size={14} />
                      </button>
                    </div>
                    {showTooltip === "radius" && (
                      <div className="text-xs bg-[#2a3638] p-2 rounded mb-2 text-[#e6f0f0]">{tooltips.radius}</div>
                    )}
                    <input
                      type="number"
                      name="radius"
                      value={form.radius}
                      onChange={handleChange}
                      step="0.1"
                      min="0.1"
                      max="10"
                      className="w-full px-3 py-2 rounded-md bg-[#0a1214] border border-[#2a3638] text-[#e6f0f0]"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleSubmit}
                      disabled={isSimulationRunning}
                      className="flex-1 bg-gradient-to-r from-[#14b8a6] to-[#2dd4bf] text-[#0a1214] font-bold py-3 rounded-lg hover:opacity-90 transition mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <Play size={18} /> RUN SIMULATION
                    </button>
                    <button
                      onClick={() => window.location.reload()}
                      className="mt-4 bg-[#2a3638] hover:bg-[#3a4648] text-[#2dd4bf] p-3 rounded-lg"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Visualization Panel */}
            <div className="lg:col-span-2">
              <div className="bg-[#1a2224] rounded-xl border border-[#2a3638] p-6 shadow-xl h-full flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b border-[#2a3638] pb-3">
                  <h3 className="text-xl font-serif text-[#2dd4bf]">Network Visualization</h3>
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                      <span className="text-xs">Susceptible</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
                      <span className="text-xs">Infected</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                      <span className="text-xs">Recovered</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                      <span className="text-xs">Critical</span>
                    </div>
                    <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-white mr-1"></span>
                      <span className="text-xs">Dead</span>
                    </div>
                  </div>
                </div>

                <div className="flex-grow bg-[#0a1214] rounded-lg overflow-hidden">
                  <svg
                    ref={svgRef}
                    width="100%"
                    height="100%"
                    className="w-full h-full min-h-[500px]"
                    style={{ minHeight: "500px" }}
                  ></svg>
                </div>

                <div className="mt-4 text-center text-sm text-[#a8b7b7]">
                  <p>Hover over nodes to see their properties. Drag nodes to reposition them. Scroll to zoom in/out.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methodology Section */}
      <section id="methodology" className="py-16 bg-[#0f1618] border-y border-[#2a3638]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-[#2dd4bf] mb-8 text-center">Methodology</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a2224] p-6 rounded-xl border border-[#2a3638]">
              <h3 className="text-xl font-serif text-[#2dd4bf] mb-4">Network Models</h3>
              <p className="text-[#a8b7b7]">
                We implement various network models to simulate different social structures:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[#a8b7b7]">
                <li>Erdős–Rényi (random connections)</li>
                <li>Watts–Strogatz (small-world)</li>
                <li>Barabási–Albert (scale-free)</li>
                <li>Community-based networks</li>
              </ul>
            </div>

            <div className="bg-[#1a2224] p-6 rounded-xl border border-[#2a3638]">
              <h3 className="text-xl font-serif text-[#2dd4bf] mb-4">Epidemic Model</h3>
              <p className="text-[#a8b7b7]">Our simulation uses an extended SIR model with:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[#a8b7b7]">
                <li>Susceptible individuals (blue)</li>
                <li>Infected individuals (red)</li>
                <li>Critical condition (purple)</li>
                <li>Recovered individuals (green)</li>
                <li>Deceased individuals (white)</li>
              </ul>
            </div>

            <div className="bg-[#1a2224] p-6 rounded-xl border border-[#2a3638]">
              <h3 className="text-xl font-serif text-[#2dd4bf] mb-4">Individual Factors</h3>
              <p className="text-[#a8b7b7]">Each person in the network has unique characteristics:</p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-[#a8b7b7]">
                <li>Age (affects vulnerability)</li>
                <li>Immunity level (resistance to infection)</li>
                <li>Health score (recovery potential)</li>
                <li>Social connections (network position)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-serif font-bold text-[#2dd4bf] mb-8 text-center">Project Team</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#1a2224] p-5 rounded-xl border border-[#2a3638] text-center">
              <img
                src="/images/ali-haider.png"
                alt="Ali Haider"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-medium text-[#2dd4bf]">Ali Haider</h3>
              <p className="text-sm text-[#a8b7b7] mb-2">Software Engineer, BESE 14 B</p>
              <p className="text-xs text-[#a8b7b7]">Specializes in network algorithms and data visualization.</p>
            </div>

            <div className="bg-[#1a2224] p-5 rounded-xl border border-[#2a3638] text-center">
              <img
                src="/images/ammer-saeed.png"
                alt="Ammer Saeed"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-medium text-[#2dd4bf]">Ammer Saeed</h3>
              <p className="text-sm text-[#a8b7b7] mb-2">Software Engineer, BESE 14 B</p>
              <p className="text-xs text-[#a8b7b7]">Expert in algorithm design and computational modeling.</p>
            </div>

            <div className="bg-[#1a2224] p-5 rounded-xl border border-[#2a3638] text-center">
              <img
                src="/images/aimal-rextin.png"
                alt="Prof. Aimal Rextin"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-medium text-[#2dd4bf]">Prof. Aimal Rextin</h3>
              <p className="text-sm text-[#a8b7b7] mb-2">Associate Professor at NUST</p>
              <p className="text-xs text-[#a8b7b7]">
                Computer Science Researcher and course instructor for Design Analysis and Algorithm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1214] py-12 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-serif text-[#2dd4bf] mb-4">EpiGraph</h3>
              <p className="text-sm text-[#a8b7b7]">
                An advanced tool for simulating and visualizing disease spread through various network structures.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#2dd4bf] mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-[#a8b7b7]">
                <li>
                  <a href="#about" className="hover:text-[#2dd4bf] transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#simulation" className="hover:text-[#2dd4bf] transition-colors">
                    Simulation
                  </a>
                </li>
                <li>
                  <a href="#methodology" className="hover:text-[#2dd4bf] transition-colors">
                    Methodology
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-[#2dd4bf] mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-[#a8b7b7] hover:text-[#2dd4bf] transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="text-[#a8b7b7] hover:text-[#2dd4bf] transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-[#a8b7b7] hover:text-[#2dd4bf] transition-colors">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-[#2a3638] pt-6 text-center text-sm text-[#a8b7b7]">
            <p>© {new Date().getFullYear()} EpiGraph. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Graph generation algorithms for different network types

export function generateErdosRenyiGraph(n: number, p: number) {
  const nodes = Array.from({ length: n }, (_, i) => ({ id: i }))
  const links = []

  // Generate random links with probability p
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      if (Math.random() < p) {
        links.push({ source: i, target: j })
      }
    }
  }

  return { nodes, links }
}

export function generateWattsStrogatzGraph(n: number, k: number, beta: number) {
  // Create a ring lattice
  const nodes = Array.from({ length: n }, (_, i) => ({ id: i }))
  const links = []

  // Connect each node to its k nearest neighbors
  for (let i = 0; i < n; i++) {
    for (let j = 1; j <= k / 2; j++) {
      links.push({
        source: i,
        target: (i + j) % n,
      })
    }
  }

  // Rewire edges with probability beta
  for (let i = 0; i < links.length; i++) {
    if (Math.random() < beta) {
      const link = links[i]
      const source = typeof link.source === "object" ? link.source.id : link.source

      // Choose a random target that is not the source and not already connected
      let target
      let attempts = 0
      do {
        target = Math.floor(Math.random() * n)
        attempts++
        // Avoid infinite loops
        if (attempts > 100) break
      } while (
        target === source ||
        links.some((l) => (l.source === source && l.target === target) || (l.source === target && l.target === source))
      )

      if (attempts <= 100) {
        link.target = target
      }
    }
  }

  return { nodes, links }
}

export function generateBarabasiAlbertGraph(n: number, m: number) {
  if (m >= n || n < 1 || m < 1) {
    throw new Error("Invalid parameters: m must be less than n, and both must be positive")
  }

  const nodes = Array.from({ length: n }, (_, i) => ({ id: i }))
  const links = []

  // Start with a complete graph of m nodes
  for (let i = 0; i < m; i++) {
    for (let j = i + 1; j < m; j++) {
      links.push({ source: i, target: j })
    }
  }

  // Add remaining nodes with preferential attachment
  for (let i = m; i < n; i++) {
    // Calculate degree of each existing node
    const degrees = new Array(i).fill(0)
    for (const link of links) {
      const source = typeof link.source === "object" ? link.source.id : link.source
      const target = typeof link.target === "object" ? link.target.id : link.target
      degrees[source]++
      degrees[target]++
    }

    // Calculate total degree
    const totalDegree = degrees.reduce((sum, degree) => sum + degree, 0)

    // Add m new edges with preferential attachment
    const connected = new Set()
    for (let j = 0; j < m; j++) {
      let target
      do {
        // Choose target with probability proportional to its degree
        let r = Math.random() * totalDegree
        target = 0
        while (r > 0 && target < i) {
          r -= degrees[target]
          target++
        }
        target = Math.max(0, target - 1)
      } while (connected.has(target))

      connected.add(target)
      links.push({ source: i, target })
    }
  }

  return { nodes, links }
}

export function generateCommunityNetwork(n: number, communities: number, p_in: number, p_out: number) {
  const nodes = Array.from({ length: n }, (_, i) => ({
    id: i,
    community: Math.floor(i / (n / communities)),
  }))

  const links = []

  // Generate links between nodes
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const sameComm = nodes[i].community === nodes[j].community
      const prob = sameComm ? p_in : p_out

      if (Math.random() < prob) {
        links.push({ source: i, target: j })
      }
    }
  }

  return { nodes, links }
}

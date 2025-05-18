export function updateColors(nodeSelection: any, colorFunction: (d: any) => string) {
  nodeSelection.transition().duration(200).attr("fill", colorFunction)
}

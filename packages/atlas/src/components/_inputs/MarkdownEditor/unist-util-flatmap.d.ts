declare module 'unist-util-flatmap' {
  type UnistNode = import('unist').Node
  declare function flatMap<F extends UnistNode, T extends UnistNode>(from: F, tr: (v: F) => T[]): T
  export default flatMap
}

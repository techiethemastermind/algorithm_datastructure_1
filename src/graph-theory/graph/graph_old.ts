import cytoscape, {
    EdgeSingular,
    NodeSingular,
    SearchVisitFunction,
    Core,
  } from 'cytoscape'
  import { Node } from '../tree/tree.interface'
  import { GraphData, IEdge, IGraph, IVertex, Visit } from './graph.interface'
  import { Parser } from '../parser/parser';
  
  /**
   * (1) Implement IGraph interface
   */
  export class Graph implements IGraph {
    cy: cytoscape.Core;
    graphData: GraphData;
    constructor(tree: Node) {
      /**
       * (2) Use Parser interface to parse Node
       */
      this.graphData = this.parser(tree);
  
      let nodes: { data: { id: string; }; }[] = [];
      this.graphData.vertices.forEach((vertex: IVertex):any => {
        nodes.push({ 
          data: {id: vertex.id},
        })
      });
  
      let edges: { data: { id: string; source: string; target: string; }; }[] = [];
      this.graphData.edges.forEach((edge: IEdge):any => {
        edges.push({
          data: {
            id: edge.source + edge.target,
            source: edge.source,
            target: edge.target
          }
        })
      });
      
      /**
       * (3) Initialize cy with parsed data
       */
      this.cy = cytoscape({
        // container: document.getElementById('root'),
        elements: {
          nodes: nodes,
          edges: edges
        }
      });
    }
  
    parsedData: GraphData = {
      vertices: [],
      edges: []
    }
  
    parser: Parser = (tree: Node): GraphData => {
  
      this.parsedData.vertices.push({
        id: tree.id,
        name: tree.name,
      });
  
      if (tree.children.length > 0) {
        const children = tree.children;
        for (let i = 0; i < children.length; i++) {
          this.parsedData.edges.push({
            source: tree.id,
            target: children[i].id,
          });
          this.parser(children[i]);
        }
      }
  
      console.log(this.parsedData);
  
      return this.parsedData;
    }
  
    // parser: Parser = (tree: Node): GraphData => {
    //   const graph: GraphData = {
    //     vertices: [],
    //     edges: []
    //   };
  
    //   const pArray = [tree];
    //   let idx = 0;
  
    //   while(1) {
  
    //     graph.vertices.push({
    //       id: pArray[idx].id,
    //       name: pArray[idx].name,
    //     });
  
    //     if (pArray[idx].children.length > 0) {
    //       pArray[idx].children.forEach((item) => {
    //         pArray.push(item);
  
    //         graph.edges.push({
    //           source: pArray[idx].id,
    //           target: item.id,
    //         });
    //       });
    //     } else {
    //       if(idx >= (pArray.length -1)) {
    //         break;
    //       }
    //     }
    //     idx++;
    //   }
  
    //   return graph;
    // }
  
    /**
     * (4) Use cytoscape under the hood
     */
    bfs(visited: Visit<IVertex, IEdge>) {
      this.cy.elements().bfs({
        root: "#A",
        visit: function(v, e, u, i, depth) {
          const vertex: IVertex = {
            id: v.id(),
            name: ""
          };
          const edge: IEdge = {
            source: e? e.source().id(): "",
            target: e? e.target().id(): ""
          };
          visited(vertex, edge);
        },
        directed: false
      });
    }
    /**
     * (5) Use cytoscape under the hood
     */
    dfs(visited: Visit<IVertex, IEdge>) {
      this.cy.elements().dfs({
        root: "#A",
        visit: function(v, e, u, i, depth){
          const vertex: IVertex = {
            id: v.id(),
            name: ""
          };
          const edge: IEdge = {
            source: e? e.source().id(): "",
            target: e? e.target().id(): ""
          }
          visited(vertex, edge);
        },
        directed: false
      })
    }
  }
  
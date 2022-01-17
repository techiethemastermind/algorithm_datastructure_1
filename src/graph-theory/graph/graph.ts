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
  parsedData: GraphData = {
    vertices: [],
    edges: []
  }
  constructor(tree: Node) {
    /**
     * (2) Use Parser interface to parse Node
     */
    this.parser(tree);

    /**
     * (3) Initialize cy with parsed data
     */
    let nodes: { data: { id: string; }; }[] = [];
    this.parsedData.vertices.forEach((vertex: IVertex): any => {
      nodes.push({
        data: { id: vertex.id },
      })
    });

    let edges: { data: { id: string; source: string; target: string; }; }[] = [];
    this.parsedData.edges.forEach((edge: IEdge): any => {
      edges.push({
        data: {
          id: edge.source + edge.target,
          source: edge.source,
          target: edge.target
        }
      })
    });

    this.cy = cytoscape({
      // container: document.getElementById('root'),
      elements: {
        nodes: nodes,
        edges: edges
      }
    });
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

    return this.parsedData;
  }

  /**
   * (4) Use cytoscape under the hood
   */
  bfs(visited: Visit<IVertex, IEdge>) {
    this.cy.elements().bfs({
      root: "#A",
      visit: function (v, e, u, i, depth) {
        const vertex: IVertex = {
          id: v.id(),
          name: ""
        };
        const edge: IEdge = {
          source: e ? e.source().id() : "",
          target: e ? e.target().id() : ""
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
      visit: function (v, e, u, i, depth) {
        const vertex: IVertex = {
          id: v.id(),
          name: ""
        };
        const edge: IEdge = {
          source: e ? e.source().id() : "",
          target: e ? e.target().id() : ""
        }
        visited(vertex, edge);
      },
      directed: false
    })
  }
}

import React from 'react';
import * as babelParser from "@babel/parser";
import {processNodeChildren} from "./create-ast";
import {basicProgram, getGraphLayout, getVoronoi} from "./voronoi";

test('Creates a call graph', () => {
  const ret = babelParser.parse(basicProgram);
  const edges = processNodeChildren([], "This should be a filename I think", ret.program)
  /*
      expect(edges).toEqual([
          {source: "test1", target: "test2"},
          {source: "test2", target: "test3"},
          {source: "test3", target: "test1"},
      ]);
  */
});

test("Lays out the call graph", () => {
  const g = getGraphLayout();
  expect(Object.values(g.nodes)[0].layoutPosX).not.toBeUndefined()
});

test("Draws the voronoi diagram", () => {
  const {voronoi,names} = getVoronoi();
  // expect(voronoi.vectors.length / 4).toBe(names.length);
});

class VoronoiColorer {
  constructor(delaunay) {
    this.delaunay = delaunay;
    this.colored = new Set();
    this.coloredWithUncoloredEdge = new Set();
  }
  getRandomColored() {
    const values = [...this.coloredWithUncoloredEdge.keys()];
    if (!values.length) return;
    const i = this.getRand(values.length);
    const neighbors = [...this.delaunay.neighbors(values[i])];
    const chosen = neighbors.filter();
  }
  getRand(n) {
    return Math.floor(Math.random() * n);
  }
}
test('It colors a graph', () => {
  const {voronoi,names} = getVoronoi();
  const centroidInfo = Array(voronoi.circumcenters.length).map(() => ({}));

})

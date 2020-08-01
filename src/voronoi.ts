import {Delaunay} from "d3-delaunay";
import * as babelParser from "@babel/parser";
import {processNodeChildren} from "./create-ast";
import {Graph, Layout} from "graphdracula";
import PoissonDiskSampling from 'poisson-disk-sampling';

const forbiddenNames = new Set([
    'constructor'
]);


/**
 * @param prop {string}
 */
function filterForbiddenName(prop) {
    return forbiddenNames.has(prop) ? prop.toUpperCase() : prop;
}
export function getGraphLayout() {
    const ret = babelParser.parse(basicProgram);
    const edges = processNodeChildren([], "This should be a filename I think", ret.program)
    const g = new Graph();
    edges.forEach(({source, target}) => {
        if (!source || !target) {
            console.log();
        }
        if (source !== "constructor")
        g.addEdge(source, target);
    })
    const layouter = new Layout.Spring(g);
    layouter.layout();
    return g;
}

export function getVoronoi() {
    const g = getGraphLayout();
    let nodes = Object.values(g.nodes);
    const points = nodes.map(({layoutPosX, layoutPosY}) => [layoutPosX * 100, layoutPosY * 100]);
    const names = nodes.map(({id}) => id);
    let xMin = points.reduce((min, [x,]) => x < min ? x : min, Number.MAX_SAFE_INTEGER) - 100;
    let yMin = points.reduce((min, [, y]) => y < min ? y : min, Number.MAX_SAFE_INTEGER) - 100;
    let xMax = points.reduce((max, [x,]) => x > max ? x : max, Number.MIN_SAFE_INTEGER) + 100;
    let yMax = points.reduce((max, [, y]) => y > max ? y : max, Number.MIN_SAFE_INTEGER) + 100;


    // How to set all points to be at 0,0
    const xOffset = 0 - xMin;
    const yOffset = 0 - yMin;
    xMax += xOffset;
    yMax += yOffset;
    points.forEach(p => {
        p[0] = p[0] + xOffset;
        p[1] = p[1] + yOffset;
    });

    const p = new PoissonDiskSampling({
        shape: [xMax, yMax],
        minDistance: 20,
        maxDistance: 30,
        tries: 10
    });
    const delaunay = Delaunay.from(points.concat(p.fill()));
    return {
        voronoi: delaunay.voronoi([
                0,
                0,
                xMax,
                yMax
            ]
        ),
        names,
        namesPoints: points
    };
}

export let basicProgram = `
    const { RawSource } = require("webpack-sources");
    const Module = require("./Module");
    const RuntimeGlobals = require("./RuntimeGlobals");
    const makeSerializable = require("./util/makeSerializable");

    const TYPES = new Set(["javascript"]);
    const RUNTIME_REQUIREMENTS = new Set([
    RuntimeGlobals.require,
    RuntimeGlobals.module
    ]);

    class DllModule extends Module {
    constructor(context, dependencies, name) {
    super("javascript/dynamic", context);

    // Info from Factory
    this.dependencies = dependencies;
    this.name = name;
    }

    /**
     * @returns {Set<string>} types available (do not mutate)
     */
    getSourceTypes() {
    return TYPES;
    }

    /**
     * @returns {string} a unique identifier of the module
     */
    identifier() {
    return this.name;
    }

    /**
     * @param {RequestShortener} requestShortener the request shortener
     * @returns {string} a user readable identifier of the module
     */
    readableIdentifier(requestShortener) {
    return this.name;
    }

    /**
     * @param {WebpackOptions} options webpack options
     * @param {Compilation} compilation the compilation
     * @param {ResolverWithOptions} resolver the resolver
     * @param {InputFileSystem} fs the file system
     * @param {function(WebpackError=): void} callback callback function
     * @returns {void}
     */
    build(options, compilation, resolver, fs, callback) {
    this.buildMeta = {};
    this.buildInfo = {};
    return callback();
    }

    /**
     * @param {CodeGenerationContext} context context for code generation
     * @returns {CodeGenerationResult} result
     */
    codeGeneration(context) {
    const sources = new Map();
    sources.set(
    "javascript",
    new RawSource("module.exports = __webpack_require__;")
    );
    return {
    sources,
    runtimeRequirements: RUNTIME_REQUIREMENTS
    };
    }

    /**
     * @param {NeedBuildContext} context context info
     * @param {function(WebpackError=, boolean=): void} callback callback function, returns true, if the module needs a rebuild
     * @returns {void}
     */
    needBuild(context, callback) {
    return callback(null, !this.buildMeta);
    }

    /**
     * @param {string=} type the source type for which the size should be estimated
     * @returns {number} the estimated size of the module (must be non-zero)
     */
    size(type) {
    return 12;
    }

    /**
     * @param {Hash} hash the hash used to track dependencies
     * @param {ChunkGraph} chunkGraph the chunk graph
     * @returns {void}
     */
    updateHash(hash, chunkGraph) {
    hash.update("dll module");
    hash.update(this.name || "");
    super.updateHash(hash, chunkGraph);
    }

    serialize(context) {
    context.write(this.name);
    super.serialize(context);
    }

    deserialize(context) {
    this.name = context.read();
    super.deserialize(context);
    }

    /**
     * Assuming this module is in the cache. Update the (cached) module with
     * the fresh module from the factory. Usually updates internal references
     * and properties.
     * @param {Module} module fresh module
     * @returns {void}
     */
    updateCacheModule(module) {
    super.updateCacheModule(module);
    this.dependencies = module.dependencies;
    }
    }

    makeSerializable(DllModule, "webpack/lib/DllModule");

    module.exports = DllModule;
`;


/**
 *
 * @param set {Set}
 * @returns {*[]}
 */
function getRandomElementInSet(set) {
    return [...set.values()][Math.floor(Math.random() * set.size)]
}

export class Colorer {
    constructor() {
        this.colored = new Set();
        this.color = 'red';
    }

    /**
     *
     * @param uncoloredPoints {Set}
     */
    colorPointT(uncoloredPoints) {

    }
}


export function ColorVoronoi(voronoi, getNextColor) {
    const uncoloredPoints = new Set(voronoi.points);
    while (uncoloredPoints.size) {
        const coloredPoint = getNextColor.colorPoint()
    }
}

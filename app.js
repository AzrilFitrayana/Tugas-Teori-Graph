class Graph {
    constructor() {
        this.nodes = new Set();
        this.edges = new Map();
    }

    addNode(node) {
        this.nodes.add(node);
        this.edges.set(node, []);
    }

    addEdge(node1, node2, weight) {
        this.edges.get(node1).push({ node: node2, weight: weight });
        this.edges.get(node2).push({ node: node1, weight: weight });
    }

    dijkstra(startNode) {
        let distances = new Map();
        let visited = new Set();
        let pq = new MinPriorityQueue();

        distances.set(startNode, 0);
        pq.enqueue(startNode, 0);

        this.nodes.forEach(node => {
            if (node !== startNode) {
                distances.set(node, Infinity);
            }
        });

        while (!pq.isEmpty()) {
            let { element: currentNode } = pq.dequeue();
            visited.add(currentNode);

            let neighbors = this.edges.get(currentNode);
            neighbors.forEach(neighbor => {
                if (!visited.has(neighbor.node)) {
                    let newDist = distances.get(currentNode) + neighbor.weight;
                    if (newDist < distances.get(neighbor.node)) {
                        distances.set(neighbor.node, newDist);
                        pq.enqueue(neighbor.node, newDist);
                    }
                }
            });
        }

        return distances;
    }
}

let graph = new Graph();
let positions = {};

function addNode() {
    let nodeName = document.getElementById('nodeName').value;
    if (nodeName && !graph.nodes.has(nodeName)) {
        graph.addNode(nodeName);
        positions[nodeName] = { x: Math.random() * 550 + 25, y: Math.random() * 350 + 25 };
        drawGraph();
    }
    document.getElementById('nodeName').value = '';
}

function addEdge() {
    let startNode = document.getElementById('edgeStart').value;
    let endNode = document.getElementById('edgeEnd').value;
    let weight = parseInt(document.getElementById('edgeWeight').value);
    if (graph.nodes.has(startNode) && graph.nodes.has(endNode) && weight > 0) {
        graph.addEdge(startNode, endNode, weight);
        drawGraph();
    }
    document.getElementById('edgeStart').value = '';
    document.getElementById('edgeEnd').value = '';
    document.getElementById('edgeWeight').value = '';
}

function findShortestPath() {
    let startNode = document.getElementById('startNode').value;
    if (graph.nodes.has(startNode)) {
        let distances = graph.dijkstra(startNode);
        let output = `Jarak terpendek dari ${startNode} ke node lain: <br>`;
        distances.forEach((distance, node) => {
            output += `Ke ${node}: ${distance} <br>`;
        });
        document.getElementById('output').innerHTML = output;
    } else {
        document.getElementById('output').innerHTML = 'Simpul awal tidak valid';
    }
}

function drawGraph() {
    let canvas = document.getElementById('graphCanvas');
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    graph.nodes.forEach(node => {
        let pos = positions[node];
        drawNode(ctx, pos.x, pos.y, node);
    });

    let drawnEdges = new Set();
    graph.edges.forEach((edges, node) => {
        edges.forEach(edge => {
            let edgeKey = [node, edge.node].sort().join("-");
            if (!drawnEdges.has(edgeKey)) {
                drawEdge(ctx, positions[node].x, positions[node].y, positions[edge.node].x, positions[edge.node].y, edge.weight);
                drawnEdges.add(edgeKey);
            }
        });
    });
}

function drawNode(ctx, x, y, label) {
    ctx.beginPath();
    ctx.arc(x, y, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#000';
    ctx.stroke();
    ctx.fillStyle = '#000';
    ctx.fillText(label, x - 5, y + 5);
}

function drawEdge(ctx, x1, y1, x2, y2, weight) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const ratio = 20 / distance; // Adjust this ratio to control the length of the line

    const offsetX = dx * ratio;
    const offsetY = dy * ratio;

    ctx.beginPath();
    ctx.moveTo(x1 + offsetX, y1 + offsetY);
    ctx.lineTo(x2 - offsetX, y2 - offsetY);
    ctx.stroke();

    const midX = (x1 + x2) / 2.1;
    const midY = (y1 + y2) / 2.1;

    ctx.fillText(weight, midX, midY);
}

// MinPriorityQueue class definition
class MinPriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(element, priority) {
        let newNode = { element, priority };
        if (this.isEmpty()) {
            this.collection.push(newNode);
        } else {
            let added = false;
            for (let i = 0; i < this.collection.length; i++) {
                if (priority < this.collection[i].priority) {
                    this.collection.splice(i, 0, newNode);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.collection.push(newNode);
            }
        }
    }

    dequeue() {
        return this.collection.shift();
    }

    isEmpty() {
        return this.collection.length === 0;
    }
}

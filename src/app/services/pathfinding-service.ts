import { Injectable } from '@angular/core';

export interface Node {
  id: string;
  x: number;
  y: number;
  floor: number;
  neighbors: string[];
}

export interface PathPoint {
  x: number;
  y: number;
  floor: number;
}

@Injectable({
  providedIn: 'root',
})
export class PathfindingService {

  // ⚡ Nodes à remplir avec les portes + intersections du RDC et étage 1
  private nodes: Node[] = [
    // exemple RDC
    { id: 'door-101', x: 280, y: 228, floor: 0, neighbors: ['c1'] },
    { id: 'door-102', x: 440, y: 228, floor: 0, neighbors: ['c2'] },
    { id: 'door-103', x: 600, y: 228, floor: 0, neighbors: ['c3'] },
    { id: 'door-201', x: 300, y: 460, floor: 0, neighbors: ['c4'] },
    { id: 'door-202', x: 510, y: 460, floor: 0, neighbors: ['c5'] },
    { id: 'door-hyper', x: 900, y: 460, floor: 0, neighbors: ['c6'] },

    { id: 'c1', x: 310, y: 300, floor: 0, neighbors: ['door-101', 'c4', 'c2'] },
    { id: 'c2', x: 460, y: 300, floor: 0, neighbors: ['door-102', 'c1', 'c3'] },
    { id: 'c3', x: 580, y: 300, floor: 0, neighbors: ['door-103', 'c2', 'c5'] },
    { id: 'c4', x: 310, y: 400, floor: 0, neighbors: ['door-201', 'c1'] },
    { id: 'c5', x: 510, y: 400, floor: 0, neighbors: ['door-202', 'c3', 'c6'] },
    { id: 'c6', x: 900, y: 400, floor: 0, neighbors: ['door-hyper', 'c5'] },

    { id: 'stairs-up', x: 760, y: 460, floor: 0, neighbors: ['c5', 'stairs-1-entrance'] },

    // ⚡ Nodes étage 1
    { id: 'door-301', x: 320, y: 218, floor: 1, neighbors: ['c1-1'] },
    { id: 'door-302', x: 540, y: 218, floor: 1, neighbors: ['c2-1'] },
    { id: 'door-303', x: 760, y: 218, floor: 1, neighbors: ['c3-1'] },
    { id: 'door-food-court', x: 900, y: 450, floor: 1, neighbors: ['c4-1'] },

    // intersections / couloirs étage 1
    { id: 'c1-1', x: 330, y: 300, floor: 1, neighbors: ['door-301', 'c2-1'] },
    { id: 'c2-1', x: 550, y: 300, floor: 1, neighbors: ['c1-1', 'c3-1'] },
    { id: 'c3-1', x: 760, y: 300, floor: 1, neighbors: ['c2-1', 'c4-1', 'stairs-down'] },
    { id: 'c4-1', x: 900, y: 350, floor: 1, neighbors: ['door-food-court', 'c3-1'] },

    // escaliers
    { id: 'stairs-down', x: 760, y: 470, floor: 1, neighbors: ['c3-1', 'stairs-up'] }, // lien vers RDC via stairs-up

  ];

  // ⚡ Obstacles à éviter
  private obstacles: { x: number; y: number; width: number; height: number }[] = [
    { x: 200, y: 300, width: 800, height: 120 }, // mur RDC
    { x: 900, y: 50, width: 250, height: 600 },  // store-hyper
    { x: 220, y: 80, width: 140, height: 160 }, // shop-101
    { x: 380, y: 80, width: 160, height: 160 }, // shop-102
    { x: 560, y: 80, width: 160, height: 160 }, // shop-103
    { x: 220, y: 460, width: 180, height: 160 }, // shop-201
    { x: 420, y: 460, width: 200, height: 160 }, // shop-202
  ];

  findPath(startId: string, endId: string): PathPoint[] {
    const start = this.nodes.find(n => n.id === startId);
    const end = this.nodes.find(n => n.id === endId);
    if (!start || !end) return [];

    const openSet: Node[] = [start];
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    this.nodes.forEach(n => {
      gScore.set(n.id, Infinity);
      fScore.set(n.id, Infinity);
    });
    gScore.set(start.id, 0);
    fScore.set(start.id, this.heuristic(start, end));

    while (openSet.length > 0) {
      openSet.sort((a,b) => fScore.get(a.id)! - fScore.get(b.id)!);
      const current = openSet.shift()!;
      if(current.id === end.id) return this.reconstructPath(cameFrom, current);

      for(const neighborId of current.neighbors){
        const neighbor = this.nodes.find(n => n.id === neighborId)!;
        if(this.isObstacle(neighbor)) continue;

        const tentativeG = gScore.get(current.id)! + this.distance(current, neighbor);
        if(tentativeG < gScore.get(neighbor.id)!){
          cameFrom.set(neighbor.id, current.id);
          gScore.set(neighbor.id, tentativeG);
          fScore.set(neighbor.id, tentativeG + this.heuristic(neighbor, end));
          if(!openSet.includes(neighbor)) openSet.push(neighbor);
        }
      }
    }
    return [];
  }

  private heuristic(a: Node, b: Node) {
    return Math.hypot(a.x-b.x, a.y-b.y);
  }

  private distance(a: Node, b: Node) {
    return Math.hypot(a.x-b.x, a.y-b.y);
  }

  private isObstacle(node: Node) {
    return this.obstacles.some(obs =>
      node.x >= obs.x && node.x <= obs.x + obs.width &&
      node.y >= obs.y && node.y <= obs.y + obs.height
    );
  }

  private reconstructPath(cameFrom: Map<string,string>, current: Node): PathPoint[] {
    const totalPath: PathPoint[] = [{x: current.x, y: current.y, floor: current.floor}];
    while(cameFrom.has(current.id)){
      const prevId = cameFrom.get(current.id)!;
      current = this.nodes.find(n => n.id === prevId)!;
      totalPath.unshift({x: current.x, y: current.y, floor: current.floor});
    }
    return totalPath;
  }
}
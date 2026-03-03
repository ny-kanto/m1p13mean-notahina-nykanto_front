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

  private nodes: Node[] = [

    // =========================
    // ======== RDC ============
    // =========================

    { id: 'door-101', x: 290, y: 234, floor: 0, neighbors: ['c1'] },
    { id: 'door-102', x: 450, y: 234, floor: 0, neighbors: ['c2'] },
    { id: 'door-103', x: 610, y: 234, floor: 0, neighbors: ['c3'] },
    { id: 'door-201', x: 310, y: 466, floor: 0, neighbors: ['c6'] },
    { id: 'door-202', x: 520, y: 466, floor: 0, neighbors: ['c7'] },
    { id: 'door-hyper', x: 906, y: 480, floor: 0, neighbors: ['c9'] },

    { id: 'c1', x: 310, y: 260, floor: 0, neighbors: ['door-101', 'c2', 'c4'] },
    { id: 'c2', x: 460, y: 260, floor: 0, neighbors: ['door-102', 'c1', 'c3'] },
    { id: 'c3', x: 610, y: 260, floor: 0, neighbors: ['door-103', 'c2'] },

    { id: 'c4', x: 170, y: 260, floor: 0, neighbors: ['c1', 'c5'] },
    { id: 'c5', x: 170, y: 440, floor: 0, neighbors: ['c4', 'c6'] },

    { id: 'c6', x: 310, y: 440, floor: 0, neighbors: ['c5', 'door-201', 'c7'] },
    { id: 'c7', x: 520, y: 440, floor: 0, neighbors: ['c6', 'door-202', 'c8'] },
    { id: 'c8', x: 740, y: 440, floor: 0, neighbors: ['c7', 'c9', 'stairs-up'] },
    { id: 'c9', x: 880, y: 440, floor: 0, neighbors: ['c8', 'door-hyper', 'stairs-up'] },

    { id: 'stairs-up', x: 805, y: 505, floor: 0, neighbors: ['c8', 'c9', 'stairs-down'] },

    // =========================
    // ======== ÉTAGE 1 ========
    // =========================

    { id: 'door-301', x: 330, y: 224, floor: 1, neighbors: ['c1-1'] },
    { id: 'door-302', x: 550, y: 224, floor: 1, neighbors: ['c2-1'] },
    { id: 'door-303', x: 770, y: 224, floor: 1, neighbors: ['c3-1'] },
    { id: 'door-food-court', x: 906, y: 470, floor: 1, neighbors: ['c7-1'] },

    { id: 'c1-1', x: 330, y: 260, floor: 1, neighbors: ['door-301', 'c2-1', 'c4-1'] },
    { id: 'c2-1', x: 550, y: 260, floor: 1, neighbors: ['door-302', 'c1-1', 'c3-1'] },
    { id: 'c3-1', x: 770, y: 260, floor: 1, neighbors: ['door-303', 'c2-1'] },

    { id: 'c4-1', x: 170, y: 260, floor: 1, neighbors: ['c1-1', 'c5-1'] },
    { id: 'c5-1', x: 170, y: 510, floor: 1, neighbors: ['c4-1', 'c6-1'] },

    { id: 'c6-1', x: 550, y: 460, floor: 1, neighbors: ['c5-1','stairs-down','c7-1'] },
    { id: 'c7-1', x: 910, y: 460, floor: 1, neighbors: ['c6-1', 'door-food-court'] },

    { id: 'stairs-down', x: 805, y: 515, floor: 1, neighbors: ['c6-1','c7-1','stairs-up'] },
  ];

  // =========================
  // ===== A* SEARCH =========
  // =========================

  findPath(startId: string, endId: string): PathPoint[] {
    const start = this.nodes.find(n => n.id === startId);
    const end = this.nodes.find(n => n.id === endId);

    if (!start || !end) return [];

    const openSet = new Set<string>([start.id]);
    const cameFrom = new Map<string, string>();
    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    this.nodes.forEach(n => {
      gScore.set(n.id, Infinity);
      fScore.set(n.id, Infinity);
    });

    gScore.set(start.id, 0);
    fScore.set(start.id, this.heuristic(start, end));

    while (openSet.size > 0) {
      // noeud avec fScore minimal
      const currentId = Array.from(openSet).reduce((a, b) =>
        (fScore.get(a)! < fScore.get(b)!) ? a : b
      )!;
      const current = this.nodes.find(n => n.id === currentId)!;

      if (current.id === end.id) return this.reconstructPath(cameFrom, current);

      openSet.delete(current.id);

      for (const neighborId of current.neighbors) {
        const neighbor = this.nodes.find(n => n.id === neighborId);
        if (!neighbor) continue;

        // ⚠️ Pas de saut d'étage sauf escalier
        const isStair = ['stairs-up', 'stairs-down'].includes(neighbor.id);
        if (neighbor.floor !== current.floor && !isStair) continue;

        const tentativeG = gScore.get(current.id)! + this.distance(current, neighbor);

        if (tentativeG < gScore.get(neighbor.id)!) {
          cameFrom.set(neighbor.id, current.id);
          gScore.set(neighbor.id, tentativeG);
          fScore.set(neighbor.id, tentativeG + this.heuristic(neighbor, end));
          openSet.add(neighbor.id);
        }
      }
    }

    return [];
  }

  private heuristic(a: Node, b: Node) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  private distance(a: Node, b: Node) {
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  private reconstructPath(cameFrom: Map<string, string>, current: Node): PathPoint[] {
    const path: PathPoint[] = [{ x: current.x, y: current.y, floor: current.floor }];
    while (cameFrom.has(current.id)) {
      const prevId = cameFrom.get(current.id)!;
      current = this.nodes.find(n => n.id === prevId)!;
      path.unshift({ x: current.x, y: current.y, floor: current.floor });
    }
    return path;
  }
}
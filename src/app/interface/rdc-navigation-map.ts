import { NavigationNode } from './navigation-node';

export const RDC_NAVIGATION_MAP: NavigationNode[] = [

  // ===== PORTES BOUTIQUES =====
  {
    id: 'door-101',
    x: 290,
    y: 228,
    floor: 0,
    connections: ['corridor-left']
  },
  {
    id: 'door-102',
    x: 450,
    y: 228,
    floor: 0,
    connections: ['corridor-center']
  },
  {
    id: 'door-103',
    x: 610,
    y: 228,
    floor: 0,
    connections: ['corridor-right']
  },

  {
    id: 'door-201',
    x: 310,
    y: 460,
    floor: 0,
    connections: ['corridor-left']
  },
  {
    id: 'door-202',
    x: 520,
    y: 460,
    floor: 0,
    connections: ['corridor-center']
  },

  // ===== ESCALIER =====
  {
    id: 'stairs-rdc',
    x: 805,
    y: 470,
    floor: 0,
    connections: ['corridor-right', 'stairs-etage1']
  },

  // ===== COULOIR =====
  {
    id: 'corridor-left',
    x: 350,
    y: 350,
    floor: 0,
    connections: ['door-101', 'door-201', 'corridor-center']
  },
  {
    id: 'corridor-center',
    x: 550,
    y: 350,
    floor: 0,
    connections: ['door-102', 'door-202', 'corridor-left', 'corridor-right']
  },
  {
    id: 'corridor-right',
    x: 750,
    y: 350,
    floor: 0,
    connections: ['door-103', 'stairs-rdc', 'corridor-center']
  }

];

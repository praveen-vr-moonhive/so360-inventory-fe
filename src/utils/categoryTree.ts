import { ItemCategory } from '../types/inventory';

export interface TreeNode extends ItemCategory {
    children: TreeNode[];
    depth: number;
}

export function buildCategoryTree(categories: ItemCategory[]): TreeNode[] {
    const map = new Map<string, TreeNode>();
    const roots: TreeNode[] = [];

    // First pass: create all nodes
    for (const cat of categories) {
        map.set(cat.id, { ...cat, children: [], depth: 0 });
    }

    // Second pass: build parent-child relationships
    for (const cat of categories) {
        const node = map.get(cat.id)!;
        if (cat.parent_id && map.has(cat.parent_id)) {
            const parent = map.get(cat.parent_id)!;
            node.depth = parent.depth + 1;
            parent.children.push(node);
        } else {
            roots.push(node);
        }
    }

    // Fix depths recursively
    function setDepths(nodes: TreeNode[], depth: number) {
        for (const node of nodes) {
            node.depth = depth;
            setDepths(node.children, depth + 1);
        }
    }
    setDepths(roots, 0);

    return roots;
}

export interface FlatNode {
    id: string;
    name: string;
    description?: string;
    parent_id?: string;
    depth: number;
}

export function flattenTree(roots: TreeNode[]): FlatNode[] {
    const result: FlatNode[] = [];

    function walk(nodes: TreeNode[]) {
        for (const node of nodes) {
            result.push({
                id: node.id,
                name: node.name,
                description: node.description,
                parent_id: node.parent_id,
                depth: node.depth,
            });
            walk(node.children);
        }
    }

    walk(roots);
    return result;
}

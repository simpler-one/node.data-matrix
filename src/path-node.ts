export class PathNode {

    get isLeaf(): boolean {
        return this.children.length === 0;
    }

    get isBranch(): boolean {
        return this.children.length > 1;
    }

    constructor(
        public readonly key: string,
        public readonly children: PathNode[] = [],
    ) {
    }

    public descendant(): PathNode {
        return this.isLeaf ? this : this.children[0].descendant();
    }

    public findBranch(): PathNode | undefined {
        if (this.isLeaf) {
            return undefined;
        }

        if (this.isBranch) {
            return this;
        }

        return this.children[0].findBranch();
    }

    public clone(): PathNode {
        return new PathNode(this.key, this.children.map(child => child.clone()));
    }

    public toString(): string {
        if (this.isLeaf) {
            return this.key;
        } else if (this.children.length === 1) {
            return `${this.key}.${this.children[0]}`; // Recursive
        } else {
            return `${this.key}.(${this.children.join(',')})`; // Recursive
        }
    }
}

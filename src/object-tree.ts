export class ObjTree {
    constructor(
        public readonly key: string,
        public readonly children: ObjTree[] = [],
    ) {
    }

    public clone(): ObjTree {
        return new ObjTree(this.key, this.children.map(child => child.clone()));
    }

    public descendant(): ObjTree {
        return this.children.length === 0 ? this : this.children[0].descendant();
    }
}

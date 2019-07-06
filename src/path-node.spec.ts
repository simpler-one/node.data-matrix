import { PathNode } from './path-node';

describe('PathNode', () => {
    // Given
    const root = new PathNode('0', [
        new PathNode('1', [
            new PathNode('2', [
                new PathNode('3', [
                    new PathNode('4'),
                    new PathNode('5'),
                ])
            ])
        ])
    ]);

    describe('clone()', () => {
        it('should match source and clone', () => {
            // When
            const clone = root.clone();

            // Then
            expect(clone).toEqual(root);
        });
    });

    describe('findBranch()', () => {
        it('should find child branch', () => {
            // When
            const branch = root.findBranch();

            // Then
            expect(branch).toBeTruthy();
            expect(branch.key).toBeTruthy('3');
        });

        it('should find itself as branch', () => {
            // When
            const rootBranch = new PathNode('top', [
                new PathNode('1', [
                    new PathNode('3', [
                        new PathNode('4'),
                        new PathNode('5'),
                    ])
                ]),
                new PathNode('2'),
            ]);

            // When
            const branch = rootBranch.findBranch();

            // Then
            expect(branch).toBe(rootBranch);
        })
    });

    describe('toString()', () => {
        it('should match', () => {
            // When
            const str = root.toString();

            // Then
            expect(str).toBe('0.1.2.3.(4,5)');
        });
    });
});

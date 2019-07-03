import { buildDataMatrix } from "./build";
import { $0, $00, $$ } from "./meta-value";


describe('buildDataMatrix', () => {
    describe('should match result without header columns', () => {
        // Given
        type Test = { val: string, obj: { val1: number, val2: boolean } };
        const header = [
            'val    obj',
            '-      {val1    val2}',
        ];
        const data = [[
            ['grp1',1,      false],
            [               true],
            [       2,      $$],
            [       $0,     $00],
        ], [
            ['grp2',1,      true],
            [               false],
            [$00,   2,      $$],
            [$$,    $0,     $0],
            [$0,    $0,     $00],
        ]];
        const expected: Test[] = [
            { val: 'grp1', obj: { val1: 1, val2: false } },
            { val: 'grp1', obj: { val1: 1, val2: true } },
            { val: 'grp1', obj: { val1: 2, val2: true } },
            { val: 'grp1', obj: { val1: 1, val2: false } },

            { val: 'grp2', obj: { val1: 1, val2: true } },
            { val: 'grp2', obj: { val1: 1, val2: false } },
            { val: 'grp1', obj: { val1: 2, val2: false } },
            { val: 'grp1', obj: { val1: 1, val2: true } },
            { val: 'grp2', obj: { val1: 1, val2: false } },
        ];

        it('(overload=header, groups)', () => {
            // When
            const tests = buildDataMatrix<Test>(header, ...data);
            // Then
            expect(tests).toEqual(expected);
        });
    
        it('(overload=[header, groups], options)', () => {
            // When
            const tests = buildDataMatrix<Test>([header, ...data], undefined);
            // Then
            expect(tests).toEqual(expected);
        });
    });

    it('should match result with header columns', () => {
        // Given
        type Test = { title: string, obj: { val1: number, val2: boolean } };
        const header = [
            'title  |   obj',
            '-      |   {val1 val2}',
        ];
        const data = [[
            ['t1',      1,  false],
            ['t2',          true],
            ['t3',          $$],
            ['t4',      2,  $00],
        ]];

        // When
        const tests = buildDataMatrix<Test>(header, ...data);

        // Then
        expect(tests).toEqual([
            { title: 't1', obj: { val1: 1, val2: false } },
            { title: 't2', obj: { val1: 1, val2: true } },
            { title: 't3', obj: { val1: 1, val2: true } },
            { title: 't4', obj: { val1: 2, val2: false } },
        ]);
    });

    describe('should fail if size mismatch', () => {
        // Given
        const header = [
            'mismatch   mismatch2   mismatch3',
        ];
        const data = [[
            ['grp1',    1],
        ]];

        it('(overload=header, groups)', () => {
            // When
            const result = buildDataMatrix(header, ...data);
    
            // Then
            expect(result).toEqual([]);
        });

        it('(overload=[header, groups], options)', () => {
            // When
            const result = buildDataMatrix([header, ...data], undefined);
    
            // Then
            expect(result).toEqual([]);
        });
    });

    describe('should fail if empty', () => {
        // Given
        const header = [
        ];
        const data = [[
            ['grp1',1],
        ]];

        it('(overload=header, groups)', () => {
            // When
            const result = buildDataMatrix(header, ...data);
    
            // Then
            expect(result).toEqual([]);
        });

        it('(overload=[header, groups], options)', () => {
            // When
            const result = buildDataMatrix([header, ...data], undefined);
    
            // Then
            expect(result).toEqual([]);
        });
    });
});

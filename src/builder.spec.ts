import { buildDataMatrix } from "./builder";
import { $0, $00, $$, _ } from "./meta-value";


describe('buildDataMatrix', () => {
    describe('should match result without header columns', () => {
        // Given
        type Test = { val: string, obj: { a: { a: number, b: number }, b: { a: number, b: number } } };
        const header = [
            'val    obj',
            '-      {a      b}',
            '       {a  b}  [a      b]',
        ];
        const data = [[
            ['grp1',1,  -1, [10,    -10]],
            [           -2, [20,    -20]],
            [       2,  _,  [_,     $0]],
        //     [       $0, $00,39, -30],
        // ], [
        //     ['grp2',1,      true],
        //     [               false],
        //     [$00,   2,      $$],
        //     [$$,    $0,     $0],
        //     [$0,    $0,     $00],
        ]];
        const expected: Test[] = [
            { val: 'grp1', obj: { a: { a: 1, b: -1 }, b: { a: 10, b: -10 } } },
            { val: 'grp1', obj: { a: { a: 1, b: -2 }, b: { a: 20, b: -20 } } },
            { val: 'grp1', obj: { a: { a: 2, b: -2 }, b: { a: 20, b: -10 } } },
            // { val: 'grp1', obj: { a: 1, b: false } },

            // { val: 'grp2', obj: { a: 1, b: true } },
            // { val: 'grp2', obj: { a: 1, b: false } },
            // { val: 'grp1', obj: { a: 2, b: false } },
            // { val: 'grp1', obj: { a: 1, b: true } },
            // { val: 'grp2', obj: { a: 1, b: false } },
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

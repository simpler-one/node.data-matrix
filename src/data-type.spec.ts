import { DataType } from './data-type';


describe('DataType constructor()', () => {
    describe('should match paths', () => {
        it('(open-nest)', () => {
            // Given
            const header = [
                'val    obj',
                '-      {a      b}',
                '       a       {a      b}',
            ];
    
            // When
            const result = new DataType(header);
    
            // Then
            expect(result.pathsString()).toEqual([
                'val',
                'obj.a.a',
                'obj.b.a',
                'obj.b.b',
            ]);
        });

        it('(block-nest)', () => {
            // Given
            const header = [
                'val    obj',
                '-      [a              b]',
                '       [a      b]      [a      b]',
            ];

            // When
            const result = new DataType(header);

            // Then
            expect(result.pathsString()).toEqual([
                'val',
                'obj.(a.(a,b),b.(a,b))',
            ]);
        });

        it('(open-nest & block-nest)', () => {
            // Given
            const header = [
                'val    obj',
                '-      {a      b}',
                '       {a  b}  [a      b]',
            ];

            // When
            const result = new DataType(header);

            // Then
            expect(result.pathsString()).toEqual([
                'val',
                'obj.a.a',
                'obj.a.b',
                'obj.b.(a,b)',
            ]);
        });
    });
});

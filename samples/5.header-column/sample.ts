import { buildDataMatrix } from '@working-sloth/data-matrix';

type Test = { label: string, time: string, isMale: boolean; age: number, expect: number };
const tests = buildDataMatrix<Test>(
    [                                        // Empty array in top header layer makes left side into header columns
        ['label',                                   [], 'time',        'isMale',   'age',  'expect']
    ], [//---------------------------------------------+-------------------------------------------
        // Header columns                              | normal data columns
        ['[morning] boy (max): discount 50%',           'morning',      true,       10,     -0.5],
                                                        // Auto filling works after header columns
        ['[morning] boy (above): no discount',          /*morning*/     /*true*/    11,     0.0],
        ['[morning] senior man (under): no discount',   /*morning*/     /*true*/    64,     0.0],
        ['[morning] senior man (min): discount 50%',                                65,     -0.5],
        ['[morning] girl (max): discount 50%',                          false,      10,     -0.5],
        ['[morning] girl (above): no discount',                                     11,     0.0],
        ['[morning] senior woman (under): no discount',                             64,     0.0],
        ['[morning] senior woman (min): discount 50%',                              65,     -0.5],
    ], [
        ['[afternoon] boy (max): discount 50%',         'afternoon',    true,       10,     -0.5],
        ['[afternoon] boy (above): no discount',                                    11,     0.0],
        ['[afternoon] senior man (under): no discount',                             64,     0.0],
        ['[afternoon] senior man (min): discount 50%',                              65,     -0.5],
        ['[afternoon] girl (max): discount 50%',                        false,      10,     -0.5],
        ['[afternoon] girl (above): discount 20%',                                  11,     -0.2],
        // ...
    ]
);

// Test loop
for (const test of tests) {
    it(test.label, () => {
        // Given
        const service = new FooService();
        // When
        const discount = service.calcDiscount(test.time, test.isMale, test.age);
        // Then
        expect(discount).toEqual(test.expect);
    });
}

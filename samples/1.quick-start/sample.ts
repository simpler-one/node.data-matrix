import { buildDataMatrix } from '@working-sloth/data-matrix';

// define test param
type Test = { time: string, isMale: boolean; age: number, expect: number, label: string };
// buildDataMatrix<T> convert the matrix to test list
const tests = buildDataMatrix<Test>(
    [
        ['time',        'isMale',   'age',  'expect',   'label'] // Header
    ], [//-------------------------------------------------------
        // Auto filling will work from LEFT to RIGHT
        ['morning',     true,       10,     -0.5,       '[morning] boy (max): discount 50%'],
        [/*morning*/    /*true*/    11,     0.0,        '[morning] boy (above): no discount'],
        [/*morning*/    /*true*/    64,     0.0,        '[morning] senior man (under): no discount'],
        [                           65,     -0.5,       '[morning] senior man (min): discount 50%'],
        [/*morning*/    false,      10,     -0.5,       '[morning] girl (max): discount 50%'],
        [/*morning*/    /*false*/   11,     0.0,        '[morning] girl (above): no discount'],
        [                           64,     0.0,        '[morning] senior woman (under): no discount'],
        [                           65,     -0.5,       '[morning] senior woman (min): discount 50%'],
        ['afternoon',   true,       10,     -0.5,       '[afternoon] boy (max): discount 50%'],
        [                           11,     0.0,        '[afternoon] boy (above): no discount'],
        [                           64,     0.0,        '[afternoon] senior man (under): no discount'],
        [                           65,     -0.5,       '[afternoon] senior man (min): discount 50%'],
        [               false,      10,     -0.5,       '[afternoon] girl (max): discount 50%'],
        [                           11,     -0.2,       '[afternoon] girl (above): discount 20%'],
        [                           64,     -0.2,       '[afternoon] senior woman (under): no discount'],
        [                           65,     -0.5,       '[afternoon] senior woman (min): discount 50%'],
        ['evening',     true,       10,     -0.5,       '[evening] boy: discount 50%'],
        [                           11,     0.0,        '[evening] boy (above): no discount'],
        [                           64,     0.0,        '[evening] senior man (under): no discount'],
        [                           65,     -0.5,       '[evening] senior man (min): discount 50%'],
        [               false,      10,     -0.5,       '[evening] girl (max): discount 50%'],
        [                           11,     0.0,        '[evening] girl (above): no discount'],
        [                           64,     0.0,        '[evening] senior woman (under): no discount'],
        [                           65,     -0.5,       '[evening] senior woman (min): discount 50%'],
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

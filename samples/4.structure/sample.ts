import { buildDataMatrix } from '@working-sloth/data-matrix';


type Test = {
    mode: string,
    door: { area: number, security: string },
    user: { area: number, permission: string },
    expect: boolean,
    label: string
};
const tests = buildDataMatrix<Test>(
    [
        // You can create nested object by stacking header layer
        'mode       door                user                expect      label',
        '-          [area   security]   {area    permission}             ',
        // "-" means no children                            Right edge items having no children can be skip
    ], [//-------------------------------------------------------------------
                // Nest defined by [brackets] is block-nest. This nesting needs brackets to write data and it can be replaced with ONE object
                                            // Nest defined by {brace} is open-nest. This nesting doesn't needs any brackets but it cannot be replaced with one object
        ['normal',  [1,     'admin'],   1,      'normal',   false,      '[Normal] admin / same area normal user -> cannot'],
        [                                       'admin',    true,       '[Normal] admin / same area admin user -> can'],
        [                               2,      'normal',   false,      '[Normal] admin / different area normal user -> cannot'],
        [                                       'admin',    false,      '[Normal] admin / different area admin user -> cannot'],
        [           [       'normal'],  1,      'normal',   true,       '[Normal] normal / same area normal user -> can'],
        [                                       'amdin',    true,       '[Normal] normal / same area admin user -> can'],
        [                               2,      'normal',   false,      '[Normal] normal / different area normal user -> cannot'],
        [                                       'amdin',    true,       '[Normal] normal / different area admin user -> can'],
    ], [
        ['emerg',   [1,     'admin'],   1,      'normal',   false,      '[Emergency] admin / same area normal user -> cannot'],
        [                                       'admin',    true,       '[Emergency] admin / same area admin user -> can'],
        [                               2,      'normal',   false,      '[Emergency] admin / different area normal user -> cannot'],
        [                                       'admin',    true,       '[Emergency] admin / different area admin user -> can'],
        [           [       'normal'],  1,      'normal',   true,       '[Emergency] normal / same area normal user -> can'],
        [                                       'amdin',    true,       '[Emergency] normal / same area admin user -> can'],
        [                               2,      'normal',   true,       '[Emergency] normal / different area normal user -> can'],
        [                                       'amdin',    true,       '[Emergency] normal / different area admin user -> can'],
    ], [       // block-nest can be replaced with ONE object
        ['emerg',   undefined,          1,      'normal',   undefined,  '[Emergency] undefined -> error'],
    ]
);


for (const test of tests) {
    it(test.label, () => {
        // Given
        const security = new SecurityChecker('door');
        // When
        const can = security.check(test.mode, test.door, test.user);
        // Then
        expect(can).toEqual(test.expect);
    });
}

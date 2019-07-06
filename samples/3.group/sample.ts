import { buildDataMatrix, $0, $00 } from '@working-sloth/data-matrix';

type Test = { from: string, to: string; type: string, weight: number, expect: number, label: string };
const tests = buildDataMatrix<Test>(
    [
        'from  to      type        weight  expect  label',
    ], [//--- US group -----------------------------------------------------------
        ['US',  'CN',   'normal',   10,     100,    '[US-CN] normal 10kg: cost 100'],
        [               'fast',     10,     150,    '[US-CN] normal 10kg: cost 150'],
        [               'economy',  10,     80,     '[US-CN] normal 10kg: cost 80'],
        //...
    ], [//--- JP Group -----------------------------------------------------------
        ['JP',  'CN',   'normal',   10,     30,     '[US-CN] normal 10kg: cost 30'],
        //...
    ], [//--- Error Group -----------------------------------------------------------
        ['',    $00,    $00,        $00,    null,   '[Error] Empty "from"'],
        [$00,   'Hell', $00,        $00,    null,   '[Error] Unknown "to"'],
        [$00,   $00,    'teleport', $00,    null,   '[Error] Unsupported "type"'],
        [$00,   $00,    $00,        -1,     null,   '[Error] Negative "weight"'],
        [$00,   $00,    $00,        9999,   null,   '[Error] Over "weight"'],
    ] // $00 means first value of all
);

for (const test of tests) {
    it(test.label, () => {
        // Given
        const service = new SendingService();
        let cost: number;
        let err = false;

        // When
        try {
            cost = service.calcCost(test.from, test.to, test.type, test.weight);
        } catch (e) {
            err = true;
        }

        // Then
        expect(cost).toEqual(test.expect);
        expect(err).toEqual(test.expect === undefined);
    });
}

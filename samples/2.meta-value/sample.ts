import { buildDataMatrix, $0 } from '@working-sloth/data-matrix';


type Test = { from: string, to: string; type: string, weight: number, expect: number, label: string };
const tests = buildDataMatrix<Test>(
    [
        ['from',    'to',   'type',     'weight',   'expect',   'label']
    ], [//--------------------------------------------------------------
        ['US',      'CN',   'normal',   10,         100,       '[US-CN] normal 10kg: cost 100'],
        [                   'fast',     10,         150,       '[US-CN] normal 10kg: cost 150'],
        [                   'economy',  10,         80,        '[US-CN] normal 10kg: cost 80'],
        ['JP',      'CN',   'normal',   10,         30,        '[US-CN] normal 10kg: cost 30'],
        // ....
        // You can easily test error cases by using meta value
        ['',        $0,     $0,         $0,         undefined, '[Error] Empty "from"'],
        [$0,        'Hell', $0,         $0,         undefined, '[Error] Unknown "to"'],
        [$0,        $0,     'teleport', $0,         undefined, '[Error] Unsupported "type"'],
        [$0,        $0,     $0,         -1,         undefined, '[Error] Negative "weight"'],
        [$0,        $0,     $0,         9999,       undefined, '[Error] Over "weight"'],
    ]
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

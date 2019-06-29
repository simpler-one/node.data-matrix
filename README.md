# Data Matrix

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

![DataMatrix](samples/1.quick-start/data-matrix.png)

Diligent developer, is it your work to crete many lengthy code for unit tests?
Let's be lazy.
<table>
    <tr>
        <th>Write all<br>(Before)</th>
        <td>
<pre>
it('should ...', () => {
    obj.val = false;
    const reuslt = obj.doSomething(1, true, 'user');
    expect(result).toBe(true);
});
it('should ...', () => {
    obj.val = false;
    const reuslt = doSomething(1, true, 'system');
    expect(result).toBe(true);
});
it('should ...', () => {
    obj.val = false;
    const reuslt = doSomething(1, false, 'user');
    expect(result).toBe(true);
});
it('should ...', () => {
    obj.val = false;
    const reuslt = doSomething(1, false, 'system');
    expect(result).toBe(true);
});
...
</pre>
        </td>
    </tr>
    <tr>
        <th>Test case list<br>(Before)</th>
        <td>
<pre>
const tests = [
    { val: false, type: 1, strict: true, user: 'user', expect: true, label: 'should ...' },
    { val: false, type: 1, strict: true, user: 'system', expect: true, label: 'should ...' },
    { val: false, type: 1, strict: false, user: 'user', expect: true, label: 'should ...' },
    { val: false, type: 1, strict: false, user: 'system', expect: true, label: 'should ...' },
    ...
];
for (const test of tests) {
    it(test.label, () => {
        obj.val = false;
        const reuslt = obj.doSomething(test.type, test.strict, test.user);
        expect(result).toBe(test.expect);
    });
}
</pre>
        </td>
    </tr>
    <tr>
        <th>Data matrix<br>(After)</th>
        <td>
<pre>
const tests = buildDataMatrix([
    [val,   type,   strict,     user,       expect,     label]
], [
    [false, 1,      true,       'user',     true,       'should ...'],
    [                           'system',   true,       'should ...'],
    [               false,      'user',     true,       'should ...'],
    [                           'system',   true,       'should ...'],
    ...
])
for (const test of tests) {
    it(test.label, () => {
        obj.val = false;
        const reuslt = obj.doSomething(test.type, test.strict, test.user);
        expect(result).toBe(test.expect);
    });
}
</pre>
        </td>
    </tr>
</table>

## What? 
 Data matrix cretor for JavaScript and TypeScript.

## Why? 
- Less code: you don't have to write lengthy code any more for unit test
- Readable: less code helps you to understand test cases and find mistake

## Quick start

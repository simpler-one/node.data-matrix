# Data Matrix

[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

![DataMatrix](samples/1.quick-start/data-matrix.png)

Diligent developer, is it your work to crete many lengthy code for unit tests?
Let's be lazy.
<table>
    <tr>
        <th>Write all<br>(Before)</th>
        <td>
            <div>
                Too long and duplicated
<pre>
it('[morning] boy (max): discount 50%', () => {
    const service = new FooService();
    const discount = service.calcDiscount('morning', true, 10);
    expect(discount).toEqual(-0.5);
});
it('[morning] boy (above): no discount', () => {
    const service = new FooService();
    const discount = service.calcDiscount('morning', true, 11);
    expect(discount).toEqual(0.0);
});
it('[morning] senior man (under): no discount', () => {
    const service = new FooService();
    const discount = service.calcDiscount('morning', true, 64);
    expect(discount).toEqual(0.0);
});
...
</pre>
</div>
        </td>
    </tr>
    <tr>
        <th>List<br>(Before)</th>
        <td>
            <div>
                Still duplicated
<pre>
const tests = [
    { time: 'morning', isMale: true, age: 10, expect: -0.5, label: '[morning] boy ...' },
    { time: 'morning', isMale: true, age: 11, expect: 0.0, label: '[morning] boy ...' },
    { time: 'morning', isMale: true, age: 64, expect: 0.0, label: '[morning] senior ...' },
    ...
];
for (const test of tests) {
    it(test.label, () => {
        ...
</pre>
            </div>
        </td>
    </tr>
    <tr>
        <th>Data matrix<br>(After)</th>
        <td>
            <div>
                Readable and no duplication
<pre>
const tests = buildDataMatrix([
    [
        ['time',        'isMale',   'age',  'expect',   'label']
    ], [//-------------------------------------------------------
        ['morning',     true,       10,     -0.5,       '[morning] boy ...'],
        [                           11,     0.0,        '[morning] boy ...'],
        [                           64,     0.0,        '[morning] senior ...'],
    ...
    ]
])
for (const test of tests) {
    it(test.label, () => {
        ...
</pre>
            </div>
        </td>
    </tr>
</table>

## What? 
 Data matrix cretor for JavaScript and TypeScript.

## Why? 
- Less code: you don't have to write lengthy code any more for unit test
- Readable: less code helps you to understand test cases and find mistake

## Quick start
```js

```

## Schedule
- Crate docs: someday
- Rest: every day
- Sleep: every day
- Be clever and lazy: soon
- Be stupid and diligent: never


## If you aren't satisfied
 contact: koba.work.work1127@gmail.com

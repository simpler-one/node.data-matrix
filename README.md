# Data Matrix

[![npm version](https://badge.fury.io/js/%40working-sloth%2Fdata-matrix.svg)](https://badge.fury.io/js/%40working-sloth%2Fdata-matrix)
[![Build Status](https://travis-ci.org/work-work-komei/node.data-matrix.svg?branch=develop)](https://travis-ci.org/work-work-komei/node.data-matrix)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/74961d74343647b7aef1e261757d2b5c)](https://app.codacy.com/app/work-work-komei/node.data-matrix?utm_source=github.com&utm_medium=referral&utm_content=work-work-komei/node.data-matrix&utm_campaign=Badge_Grade_Dashboard)
[![codecov](https://codecov.io/gh/work-work-komei/node.data-matrix/branch/develop/graph/badge.svg)](https://codecov.io/gh/work-work-komei/node.data-matrix)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

![DataMatrix](samples/1.quick-start/data-matrix.png)

[日本語](README-jp.md)

Diligent developer, is it your work to crete many lengthy code for unit tests?
Let's be lazy.
<table>
    <tr>
        <th>Write all<br>(Before)</th>
        <td>
            <div>
                Too long and duplicated
<pre class="code">
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
<pre class="code">
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
<pre class="code">
const tests = buildDataMatrix([
    [
        'time           isMale      age     expect  label', // Header
    ], [//-------------------------------------------------------
        ['morning',     true,       10,     -0.5,   '[morning] boy ...'],
        [                           11,     0.0,    '[morning] boy ...'],
        [                           64,     0.0,    '[morning] senior ...'],
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
 Data list creator for JavaScript and TypeScript.

## Why? 
- Less code: you don't have to write lengthy code any more for unit test
- Readable: less code helps you to understand test cases and find mistake
- Learning cost: basic takes only 1 step, full function takes 5 only steps to learn

## Quick start
```js
import { buildDataMatrix } from '@working-sloth/data-matrix';

// define test param
type Test = { time: string, isMale: boolean; age: number, expect: number, label: string };
// buildDataMatrix<T> convert the matrix to test list
const tests = buildDataMatrix<Test>(
    [
        ['time',        'isMale',   'age',  'expect',   'label'] // Header
    ], [//-------------------------------------------------------
        // Lacking values will be filled from LEFT to RIGHT with previous value
        ['morning',     true,       10,     -0.5,   '[morning] boy (max): discount 50%'],
        [/*morning*/    /*true*/    11,     0.0,    '[morning] boy (above): no discount'],
        [                           64,     0.0,    '[morning] senior man (under): no discount'],
        [                           65,     -0.5,   '[morning] senior man (min): discount 50%'],
        [               false,      10,     -0.5,   '[morning] girl (max): discount 50%'],
        [               /*false*/   11,     0.0,    '[morning] girl (above): no discount'],
        ...
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
```

## Other samples
 I have a truly marvelous sample of this case which this margin is too narrow to contain.
 [See samples](samples)

## Schedule
- Crate docs: someday
- Extension for VS Code (matrix formatter & header generator): someday
- Rest: every day
- Sleep: every day
- Be clever and lazy: soon
- Be stupid and diligent: never

## If you aren't satisfied
- [Open an issue](https://github.com/work-work-komei/node.data-matrix/issues) such as "question" or "enhancement"
- e-mail: koba.work.work1127@gmail.com

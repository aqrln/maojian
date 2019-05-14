'use strict';

const metatests = require('..');

metatests.test('async test.reject test', test => {
  const err = new Error('error');
  const t = new metatests.ImperativeTest('Rejecting test', async () => {
    const e1 = await t.rejects(Promise.reject(err), err);
    t.strictSame(e1, err);
    const e2 = await t.isRejected(Promise.reject(err), err);
    t.strictSame(e2, err);
  });
  t.on('done', () => {
    test.assert(t.success);
    test.contains(t.results[0], {
      type: 'isError',
      actual: err,
      expected: err,
    });
    test.contains(t.results[1], {
      type: 'strictSame',
      actual: err,
      expected: err,
    });
    test.contains(t.results[2], {
      type: 'isError',
      actual: err,
      expected: err,
    });
    test.contains(t.results[3], {
      type: 'strictSame',
      actual: err,
      expected: err,
    });
    test.end();
  });
});

metatests.test('test.reject test must throw resolve', test => {
  const res = 42;
  const t = new metatests.ImperativeTest('Rejecting test', async () => {
    try {
      await t.rejects(Promise.resolve(res), new Error());
      t.fail('must throw on resolve');
    } catch (e) {
      t.strictSame(e, res);
    }
  });
  t.on('done', () => {
    test.assertNot(t.success);
    test.contains(t.results[0], {
      type: 'fail',
      actual: res,
      message: 'expected to be rejected, but was resolved',
      success: false,
    });
    test.contains(t.results[1], {
      type: 'strictSame',
      actual: res,
      expected: res,
      success: true,
    });
    test.end();
  });
});

metatests.test('test.reject subtest function', test => {
  const err = new Error('error');
  const t = new metatests.ImperativeTest('Rejecting test', () =>
    t.rejects(() => Promise.reject(err), err)
  );
  t.on('done', () => {
    test.assert(t.success);
    test.contains(t.results[0], {
      type: 'isError',
      actual: err,
      expected: err,
    });
    test.end();
  });
});

metatests.test('test.reject must not repeat "fail" result', test => {
  const t = new metatests.ImperativeTest('Rejecting test', () =>
    t.rejects(Promise.resolve(42), new Error('error'))
  );
  t.on('done', () => {
    test.assertNot(t.success);
    test.contains(t.results[0], {
      type: 'fail',
      actual: 42,
      message: 'expected to be rejected, but was resolved',
      success: false,
    });
    test.strictSame(t.results.length, 1);
    test.end();
  });
});

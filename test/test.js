/**
 * Copyright 2019, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const assert = require('assert');
const session = require('express-session');

const FirestoreStore = require('../src/index')(session);

it('should throw without dataset', done => {
  assert.throws(() => new FirestoreStore());
  done();
});

it('should use the default kind', done => {
  const fakeDataset = {};
  fakeDataset.collection = kind => {
    assert.strictEqual(kind, 'Session');
    done();
  };

  const store = new FirestoreStore({dataset: fakeDataset});
  store.get();
});

it('should use the provided kind', done => {
  const expectedkind = 'providedKind';
  const fakeDataset = {};
  fakeDataset.collection = kind => {
    assert.strictEqual(kind, expectedkind);
    done();
  };

  const store = new FirestoreStore({
    dataset: fakeDataset,
    kind: expectedkind,
  });
  store.get();
});

it('should get a document', done => {
  const fakeDataset = {
    collection: kind => {
      assert.strictEqual(kind, 'Session');
      return fakeDataset;
    },
    doc: sid => {
      assert.strictEqual(sid, expectedSid);
      return fakeDataset;
    },
    get: () => {
      done();
    },
  };

  const store = new FirestoreStore({
    dataset: fakeDataset,
  });

  const expectedSid = 'sid';
  store.get(expectedSid);
});

it('should set a document', done => {
  const fakeDataset = {
    collection: kind => {
      assert.strictEqual(kind, 'Session');
      return fakeDataset;
    },
    doc: sid => {
      assert.strictEqual(sid, expectedSid);
      return fakeDataset;
    },
    set: () => {
      done();
    },
  };

  const store = new FirestoreStore({
    dataset: fakeDataset,
  });

  const expectedSid = 'sid';
  store.set(expectedSid);
});

it('should destroy a document', done => {
  const fakeDataset = {
    collection: kind => {
      assert.strictEqual(kind, 'Session');
      return fakeDataset;
    },
    doc: sid => {
      assert.strictEqual(sid, expectedSid);
      return fakeDataset;
    },
    delete: () => {
      done();
    },
  };

  const store = new FirestoreStore({
    dataset: fakeDataset,
  });

  const expectedSid = 'sid';
  store.destroy(expectedSid);
});

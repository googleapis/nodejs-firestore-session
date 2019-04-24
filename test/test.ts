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

import {Firestore} from '@google-cloud/firestore';
import * as assert from 'assert';

import {FirestoreStore} from '../src/index';

it('should throw without dataset', done => {
  // tslint:disable-next-line no-any
  assert.throws(() => new (FirestoreStore as any)());
  done();
});

it('should use the default kind', done => {
  const fakeDataset = ({
    collection: (kind: string) => {
      assert.strictEqual(kind, 'Session');
      done();
    },
  } as {}) as Firestore;
  const store = new FirestoreStore({dataset: fakeDataset});
  store.get('', assert.ifError);
});

it('should use the provided kind', done => {
  const expectedkind = 'providedKind';
  const fakeDataset = {
    collection: (kind: string) => {
      assert.strictEqual(kind, expectedkind);
      done();
    },
  } as Firestore;
  const store = new FirestoreStore({
    dataset: fakeDataset,
    kind: expectedkind,
  });
  store.get('', assert.ifError);
});

it('should get a document', done => {
  const fakeDataset = ({
    collection: (kind: string) => {
      assert.strictEqual(kind, 'Session');
      return fakeDataset;
    },
    doc: (sid: string) => {
      assert.strictEqual(sid, expectedSid);
      return fakeDataset;
    },
    get: () => {
      done();
    },
  } as {}) as Firestore;

  const store = new FirestoreStore({
    dataset: fakeDataset,
  });

  const expectedSid = 'sid';
  store.get(expectedSid, err => {
    assert.ifError(err);
  });
});

it('should set a document', done => {
  const fakeDataset = ({
    collection: (kind: string) => {
      assert.strictEqual(kind, 'Session');
      return fakeDataset;
    },
    doc: (sid: string) => {
      assert.strictEqual(sid, expectedSid);
      return fakeDataset;
    },
    set: () => {
      done();
    },
  } as {}) as Firestore;

  const store = new FirestoreStore({
    dataset: fakeDataset,
  });

  const expectedSid = 'sid';
  store.set(expectedSid, {} as Express.SessionData, assert.ifError);
});

it('should destroy a document', done => {
  const fakeDataset = ({
    collection: (kind: string) => {
      assert.strictEqual(kind, 'Session');
      return fakeDataset;
    },
    doc: (sid: string) => {
      assert.strictEqual(sid, expectedSid);
      return fakeDataset;
    },
    delete: () => {
      done();
    },
  } as {}) as Firestore;

  const store = new FirestoreStore({
    dataset: fakeDataset,
  });

  const expectedSid = 'sid';
  store.destroy(expectedSid);
});

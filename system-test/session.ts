// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Firestore} from '@google-cloud/firestore';
import * as assert from 'assert';
import {FirestoreStore} from '../src';

const store = new FirestoreStore({
  dataset: new Firestore(),
});

describe('system tests', () => {
  it('should return an empty session', done => {
    store.get('123', (err, session) => {
      assert.ifError(err);
      assert.strictEqual(session, undefined);
      done();
    });
  });

  it('Should create and retrieve a session', done => {
    const sessionData = ({foo: 'bar'} as {}) as Express.SessionData;
    store.set('123', sessionData, err => {
      assert.ifError(err);
      store.get('123', (err, session) => {
        assert.ifError(err);
        assert.deepStrictEqual(session, {foo: 'bar'});
        done();
      });
    });
  });

  it('Should destroy a session', done => {
    store.destroy('123', err => {
      assert.ifError(err);
      assert.strictEqual(err, undefined);
      store.get('123', (err, session) => {
        assert.ifError(err);
        assert.strictEqual(session, undefined);
        done();
      });
    });
  });
});

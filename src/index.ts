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
import {Store} from 'express-session';

export interface StoreOptions {
  dataset: Firestore;
  kind?: string;
}

export class FirestoreStore extends Store {
  db: Firestore;
  kind: string;
  constructor(options: StoreOptions) {
    super(options || {});
    this.db = options.dataset;
    if (!this.db) {
      throw new Error('No dataset provided to Firestore Session.');
    }
    this.kind = options.kind || 'Session';
  }

  get = (
    sid: string,
    callback: (err?: Error | null, session?: Express.SessionData) => void
  ) => {
    this.db
      .collection(this.kind)
      .doc(sid)
      .get()
      .then(doc => {
        if (!doc.exists) {
          return callback();
        }

        try {
          const result = JSON.parse(doc.data()!.data);
          return callback(null, result);
        } catch (err) {
          return callback(err);
        }
      }, callback);
  };

  set = (
    sid: string,
    session: Express.SessionData,
    callback?: (err?: Error) => void
  ) => {
    callback = callback || (() => {});
    let sessJson;

    try {
      sessJson = JSON.stringify(session);
    } catch (err) {
      return callback(err);
    }

    this.db
      .collection(this.kind)
      .doc(sid)
      .set({data: sessJson})
      .then(() => {
        callback!();
      });
  };

  destroy = (sid: string, callback?: (err?: Error) => void) => {
    callback = callback || (() => {});
    this.db
      .collection(this.kind)
      .doc(sid)
      .delete()
      .then(() => callback!(), callback);
  };
}

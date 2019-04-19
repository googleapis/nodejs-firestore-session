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

module.exports = function(session) {
  const Store = session.Store;

  class FirestoreStore extends Store {
    constructor(options) {
      options = options || {};
      super(options);
      this.db = options.dataset;
      if (!this.db) {
        throw new Error('No dataset provided to Firestore Session.');
      }
      this.kind = options.kind || 'Session';
    }

    get(sid, callback) {
      this.db
        .collection(this.kind)
        .doc(sid)
        .get()
        .then(doc => {
          if (!doc.exists) {
            return callback();
          }

          try {
            const result = JSON.parse(doc.data().data);
            return callback(null, result);
          } catch (err) {
            return callback(err);
          }
        })
        .catch(err => callback(err));
    }

    set(sid, sess, callback) {
      callback = callback || (() => {});
      let sessJson;

      try {
        sessJson = JSON.stringify(sess);
      } catch (err) {
        return callback(err);
      }

      this.db
        .collection(this.kind)
        .doc(sid)
        .set({data: sessJson});
      callback();
    }

    destroy(sid, callback) {
      this.db
        .collection(this.kind)
        .doc(sid)
        .delete();
      callback();
    }
  }
  return FirestoreStore;
};

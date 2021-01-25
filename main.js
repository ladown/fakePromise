'use strict';

class MyPromise {
  constructor(callback) {
    function resolver(data) {
      if (this.isRejected) {
        return;
      }
      this.thenCbs.forEach((cb) => {
        data = cb(data);
      });

      if (this.onFinally) {
        this.onFinally();
      }
    }
    function rejecter(err) {
      this.isRejected = true;
      if (this.onCatch) {
        this.onCatch(err);
      }

      if (this.onFinally) {
        this.onFinally();
      }
    }
    (this.onCatch = null), (this.onFinally = null), (this.thenCbs = []), (this.isRejected = false);
    callback(resolver.bind(this), rejecter.bind(this));
  }

  then(cb) {
    this.thenCbs.push(cb);
    return this;
  }
  catch(cb) {
    this.onCatch = cb;
    return this;
  }
  finally(cb) {
    this.onFinally = cb;
    return this;
  }
}

const promise1 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    reject('Some err');
    resolve(2);
  }, 200);
});

promise1
  .then((num) => (num *= 2))
  .catch((err) => console.log(err))
  .then((num) => (num *= 3))
  .finally(() => console.log('finally'))
  .then((num) => console.log(`Done${num}`));

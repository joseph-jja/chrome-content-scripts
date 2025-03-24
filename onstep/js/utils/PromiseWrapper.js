const PromiseWrapper = inputPromise => inputPromise
    .then(data => [undefined, data])
    .catch(err => [err, undefined]);

export default PromiseWrapper;
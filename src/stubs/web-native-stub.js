/**
 * Universal Web Mock Stub for Native-Only Modules
 * Used during web compilation and static site generation (SSG) in Metro.
 */
const React = require('react');

const createRecursiveProxy = (name = 'Stub') => {
  const handler = {
    get(target, prop) {
      if (prop === '__esModule') return true;
      if (prop === 'default') return proxyTarget;
      if (prop === 'prototype') return {};
      if (prop === 'displayName') return name;
      if (typeof prop === 'symbol') return undefined;
      if (prop === 'then') return undefined; // Prevent Promise detection
      if (prop === 'render' || prop === '$$typeof') return undefined;
      return createRecursiveProxy(`${name}.${String(prop)}`);
    },
    apply(target, thisArg, args) {
      // If called as a React Hook
      if (name.startsWith('use') || name.includes('.use')) {
        return {};
      }
      // If called as a component
      if (typeof args[0] === 'object' && args[0] !== null && 'children' in args[0]) {
        return React.createElement(React.Fragment, null, args[0].children);
      }
      return createRecursiveProxy(name);
    },
    construct(target, args) {
      return createRecursiveProxy(name);
    },
  };

  const proxyTarget = function () {
    return createRecursiveProxy(name);
  };

  return new Proxy(proxyTarget, handler);
};

const stub = createRecursiveProxy('NativeWebStub');

module.exports = stub;
module.exports.default = stub;

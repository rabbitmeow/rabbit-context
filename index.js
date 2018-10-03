import React from "react"

const $$contexts = Symbol ? Symbol('contexts') : 'rabbit-23333'
const $$reactContext = Symbol ? Symbol('react-context') : 'rabbit-23334'
const $$oneTimeUse = Symbol ? Symbol('one-time-use') : 'rabbit-23335'
const $$keys = Symbol ? Symbol('keys') : 'rabbit-23336'

const $maskedKeys = new Set([
  'props',
  'state',
  'context',
  'refs',
  'updater',
  '_reactInternalFiber',
  '_reactInternalInstance',
  'setState',
  'forceUpdate',

  'constructor',
  'getDerivedStateFromProps',
  'render',
  'componentDidMount',
  'shouldComponentUpdate',
  'componentDidUpdate',
  'componentDidCatch',
  'componentWillUnmount',

  'componentWillReceiveProps',
  'UNSAFE_componentWillReceiveProps',
  'componentWillMount',
  'UNSAFE_componentWillMount',
  'componentWillUpdate',
  'UNSAFE_componentWillUpdate'
])

function setReactContext(reactContext) {
  // if (this[$reactContext]) {
  //   throw new Error('A context can only be used one time.')
  // }
  this[$$reactContext] = reactContext
}
function clearReactContext() {
  this[$$reactContext] = null
}

function nestComponents(components) {
  return function $ComponentNester({children}) {
    if (React.isValidElement(children)) {
      children = React.cloneElement(children)
    }
    const nester = (wrappedElement, wrapperComponent) => React.createElement(wrapperComponent, null, wrappedElement)
    if (children !== undefined) {
      return components.reduceRight(nester, children)
    }
    return components.reduceRight(nester)
  }
}

function compose(funcs) {
  return funcs.reduce((a, b) => arg => a(b(arg)))
}

class Provider extends React.Component {
  constructor(props) {
    super(props)
    this[$$oneTimeUse] = true
    this[$$reactContext] = React.createContext()
  }
  componentWillUnmount() {
    this.props.clearReactContext()
  }
  render() {
    if (this[$$oneTimeUse]) {
      this.props.setReactContext(this[$$reactContext])
      const set = new Set(Object.getOwnPropertyNames(Object.getPrototypeOf(this)).concat(Object.keys(this)))
      this[$$keys] = [...set.values()].filter(key => !key.startsWith('_') && !$maskedKeys.has(key))
      
      this[$$oneTimeUse] = false
    }
    const values = this[$$keys].reduce((obj, key) => {
      obj[key] = this[key]
      return obj
    }, {})
    const {props: {children}, state} = this
    return React.createElement(this[$$reactContext].Provider, {value: Object.assign(values, state)}, React.cloneElement(children))
  }
}

class Context {
  constructor(Providers, smartTransform = true) {
    if (Providers == null || (typeof Providers !== 'object' && Object.getPrototypeOf(Providers) !== Provider)) {
      throw new TypeError('Context: type is invalid -- expected an object or Context.Provider but got: ' + typeof Providers + '.')
    }
    if (Object.getPrototypeOf(Providers) === Provider) {
      this[$$reactContext] = null
      const contactor = {
        setReactContext: setReactContext.bind(this),
        clearReactContext: clearReactContext.bind(this)
      }
      const self = this, _Provider = this.Provider
      this.Provider = function Provider(props) {
        return _Provider.call(self, Providers, contactor, props)
      }
      return
    }
    const providersArray = []
    this[$$contexts] = Object.keys(Providers).reduce((ctxs, key) => {
      const context = new Context(Providers[key])
      providersArray.push(context.Provider)
      ctxs[smartTransform && key.endsWith('Provider') && key.length > 8 ? `${key[0].toLowerCase()}${key.substr(1, key.length - 9)}` : key] = context
      return ctxs
    }, {})
    if (providersArray.length === 0) {
      throw new TypeError('No Providers in object.')
    }
    this.Provider = nestComponents(providersArray)
  }
  Provider(Provider, contactor, {children}) {
    return React.createElement(Provider, contactor, children)
  }
  inject(Component) {
    if (typeof Component !== 'function') {
      throw new TypeError('Context.inject: type is invalid -- expected a React.Component but got: ' + typeof Component + '.')
    }
    const contexts = this[$$contexts]
    if (!contexts) {
      const self = this
      return function $InjectWrapper(props) {
        return React.createElement(self[$$reactContext].Consumer, null, value => React.createElement(Component, Object.assign({}, value, props)))
      }
    }

    let storeProps = null
    const wrapped = Object.keys(contexts).map(key => {
      const context = contexts[key]

      return function (child) {
        return function $Composer(preKey, values) {
          if (preKey && !(preKey in storeProps)) {
            storeProps[preKey] = values
          }
          return React.createElement(context[$$reactContext].Consumer, null, child.bind(null, key))
        }
      }
    })
    
    const Bound$Composer = compose(wrapped)((key, values) => {
      if (!(key in storeProps)) {
        storeProps[key] = values
      }
      return React.createElement(Component, storeProps)
    }).bind(null, null)

    return function $ConsumerWrapper(props) {
      storeProps = Object.assign({}, props)
      return React.createElement(Bound$Composer)
    }
  }
}
Context.Provider = Provider

export default Context

# rabbit-context

A framework base on React new Context API but it can avoid nesting hell.

### Installation
`yarn add rabbit-context` or `npm i rabbit-context`

### Usage (4 steps)

##### Step 1: Declare your Provider.
````jsx
import Context from 'rabbit-context'

// Everything is similar to React.Component
class ProfileProvider extends Context.Provider {
  constructor(props) {
    super(props)
    this.state = {name: 'rabbit'}
  }
  updateName = name => {
    this.setState({name})
  }
}
````

##### Step 2: New a Context.
````jsx
const context = new Context(ProfileProvider) // or: const context = new Context({ProfileProvider})
````

##### Step 3: Inject a Component, then return an injected Component.
````jsx
const $InjectedComponent = context.inject(AnyComponent)
````

##### Step 4: Set context.Provider and use it.
````jsx
function App(props) {
  return (
    <div>
      <h1>App</h1>
      <$InjectedComponent {...props} />
    </div>
  )
}
document.render(
  <context.Provider>
    <App msg="hello" />
  </context.Provider>,
document.getElementById('root'))
````

##### That's all usages of rabbit-context, enjoy!


### API

#### `Context.Provider`
`Context.Provider` is `extends React.Component`.
So, you can do anything as same as you do in `React.Component`.
But **DO NOT** write any `lifecycle` and `render` in your `Context.Provider`.

#### `new Context(Providers: Context.Provider|object, smartTransform: boolean = true)`
You can construct `Context.Provider` in two ways.
1. `new Context(ProfileProvider)`
2. `new Context({ProfileProvider, ContactProvider})`

`smartTransform` will auto transform `ProfileProvider` and `ContactProvider` to `profile` and `contact` as `{profile, contact}` in second way when passing `compositedProps` to injected Components, `compositedProps` is composited with `values` from `Provider` and the `props` from parent Component, and the second one has higher priority.

#### `context.inject(Component: React.Component): React.Component`
Return a wrapped Component that you can receive values as `props` from Providers.

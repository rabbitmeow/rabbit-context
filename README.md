# rabbit-context

### Usage (5 steps)

##### Step 1
````jsx
import Context from 'rabbit-context'

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

##### Step 2
````jsx
const context = new Context(ProfileProvider) // or: const context = new Context({ProfileProvider})
````

##### Step 3
````jsx
const $InjectedComponent = context.inject(AReactComponent)
````

##### Step 4
````jsx
<context.Provider>
  <AnAncestorComponent />
</context.Provider>
````

##### Step 5
````jsx
<$InjectedComponent {...props} />
````

##### That's all usages of rabbit-context, enjoy!


### API

#### `Context.Provider`
`Context.Provider` is `extends React.Component`.
So, you can do anything same as you do in `React.Component`.
But **DO NOT** write any lifecycle and `render` in your `Context.Provider`.

#### `new Context(Providers: Context.Provider|object, smartTransform: boolean = true)`
You can construct `Context.Provider` in two ways.
1. `new Context(ProfileProvider)`
2. `new Context({ProfileProvider, ContactProvider})`

`smartTransform` will auto transform `ProfileProvider` and `ContactProvider` to `profile` and `contact` as `{profile, contact}` in second way when passing values to injected Components.

#### `context.inject(Component: React.Component): React.Component`
Return a wrapped Component that you can receive values as `props` from Providers.

## state, action
```ts
// state
const cells = useTypedSelector(({cells: {order, data}}) => {
    return order.map((id) => {
        return data[id]
    })
});


// action
const {updateCell} = useActions()
```
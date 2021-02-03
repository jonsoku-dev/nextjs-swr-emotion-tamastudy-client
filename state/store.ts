import { Context, createWrapper, MakeStore } from 'next-redux-wrapper';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';

import reducers, { RootState } from './reducers';

const makeStore: MakeStore<RootState> = (_: Context) =>
  createStore(reducers, composeWithDevTools(applyMiddleware(thunk)));

// export an assembled wrapper
export const wrapper = createWrapper<RootState>(makeStore, { debug: true });

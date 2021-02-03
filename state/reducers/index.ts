import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';

import cellsReducer, { CellsState } from './cellsReducer';

interface State {
  cells: CellsState;
}

const reducers = (state: State | undefined, action: any): State => {
  switch (action.type) {
    case HYDRATE:
      console.log('this is HYDRATE');
      return action.payload;
    default: {
      const combinedReducer = combineReducers({
        cells: cellsReducer
      });
      return combinedReducer(state, action);
    }
  }
};

export default reducers;

export type RootState = ReturnType<typeof reducers>;

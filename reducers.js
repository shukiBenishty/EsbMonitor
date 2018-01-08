// @flow
import _ from 'lodash';

const INITIAL_STATE = {
  storyId: '',
  eventId: 0,
  issued: Date(),
  status: '',
  filterValue: ''
};

const reducers = (state = INITIAL_STATE, action) => {

  switch( action.type ) {

    case 'NEW_EVENT': {
      state = _.assign({}, state, {
                                    storyId: action.data.storyId,
                                    eventId: action.data.eventId,
                                    issued: new Date(action.data.issued),
                                    status: action.data.status
                                 })
    }
    break;

    case 'FILTER_CHANGED': {
      state = _.assign({}, state, {
                                    filterValue: action.data.filterValue
                                 })
    }
    break;

  }

  return state;

};

export default reducers;

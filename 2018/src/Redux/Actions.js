export const Toggle = (actionType, propName) => {
  return {
    propName,
    type: actionType,
    applyChanges: state => {
      state[propName] = !state[propName];
      return {...state, [propName] : state[propName]};
    }
  };
};

export const Change = (actionType, changes) => {
  return {
    changes,
    type: actionType,
    applyChanges: state => {
      const newState = {};
      for (let key in state) 
        newState[key] = state[key];
      for (let key in changes)
        newState[key] = changes[key];
      return newState;
    }
  };
};

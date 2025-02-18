import { Action } from "Root/Constants";

const DEFAULT_STATE = {
    editor: true,
    gallery: true,
};

export default (state = DEFAULT_STATE, action) => {
    if(action.type === Action.UPDATE_EDITOR){
        if(action.applyChanges){
            return action.applyChanges(state);
        }
    }

    return state;
};

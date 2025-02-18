import { Action } from "Root/Constants";

const DEFAULT_STATE = "image";

export default (state = DEFAULT_STATE, action) => {
    if(action.type === Action.UPDATE_IMAGE){
        return action.image;
    }

    return state;
};

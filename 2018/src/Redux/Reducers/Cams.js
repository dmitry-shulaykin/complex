import {Action} from "Root/Constants"

const DEFAULT_STATE = []

export default (state = DEFAULT_STATE, action) => {
    if(action.type === Action.LOAD_SKETCH){
        return action.sketch.cams;
    }else if(action.type === Action.UPDATE_CAMERA){
        let newState = {};
        for(let i = 0; i < 4; i++){
            newState[i] = state[i];
        }
        newState['global'] = action.config;
        newState[action.id] = action.config;

        return newState;
    }else 
        return state;
}
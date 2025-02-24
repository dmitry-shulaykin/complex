import Model from './Model';
import Complex from './Complex';
import * as Curves from './Curves';
import { Parser, Formula } from './Parser';

export const buildModel = (code, params) => {
    try {
        const userFunction = eval(code);
        const model = userFunction(
          Model,
          Curves,
          Complex,
          Parser,
          Formula,
          params,
        );
    
        if (model instanceof Model) {
            return model;
        } else {
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
}
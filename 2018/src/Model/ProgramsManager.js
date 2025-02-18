import CubicProgram from "ThreePrograms/CubicProgram"
import PolygonProgram from "ThreePrograms/PolygonProgram"

class ProgramsManager{
    constructor(){
        this.programs = new Map();
    }

    getProgram(index){
        return this.programs.get(index);
    }

    updateProgram(index, config, model){
        const oldProgram = this.getProgram(index);
        if(oldProgram){
            oldProgram.clearScene();
            this.programs.delete(index);
        }

        let newProgram;
        if (config.renderMethod == "Cubes") {
            newProgram = new CubicProgram(
              model,
              config.mappings
            );
        } else {
            newProgram = new PolygonProgram(
                model,
                config.mappings
            );
        }

        this.programs.set(index, newProgram);
        return newProgram;
    }
}

export default new ProgramsManager();
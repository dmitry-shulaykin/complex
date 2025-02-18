import CubicProgram from "ThreePrograms/CubicProgram";
import PolygonProgram from "ThreePrograms/PolygonProgram";

import { ThreeProgramWidget, Header } from "Headers";

import React from "react";

export const programs = [
  {
    name: "Кубы",
    program: CubicProgram,
    header: <Header widget={ThreeProgramWidget} />
  },
  {
    name: "Полигоны",
    program: PolygonProgram,
    header: <Header widget={ThreeProgramWidget} />
  }
];

export const setupProgram = (programConfig, model) => {
  console.log(programConfig);
  if (programConfig.type == "three") {
    // axies mapping setting
    const axies = programConfig.axies;
    return new programs[
      programConfig.program ? programConfig.program : 0
    ].program(model, axies);
  } else return null;
};

export const getProgramNames = () => {
  return programs.map(program => program.name);
};

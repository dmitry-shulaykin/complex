import React from "react";

import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
// import { linkTo } from "@storybook/addon-links";

import CurveItem from "../src/UI/Components/CurveItem";
import GalleryItem from "../src/UI/Components/GalleryItem";


import { Circle, Hyperbola } from "../src/Model/Curves";

storiesOf("Curve Item", module).add("render test", () => (
  <CurveItem curve={new Hyperbola()} />
));

storiesOf("GalleryItem", module).add("render test", () => (
  <GalleryItem sketch={{}} />
));

// storiesOf("Gallery", module)
// .addDecorator(story => <Provider story={story()} />)
// .add("display items", () => (
//   <Gallery items={[]} />
// ));

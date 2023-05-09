import { compress } from "./plantuml/compress.js";
import { getPlantUrl } from "./plantuml/utils.js";
//import {getPlantSVG} from "./plantuml/localutils.js";
import {createServiceInteractionView} from './plantuml/c4/service-interaction-view.js'
import {createFlowSequenceView} from "./plantuml/c4/flow-sequence-view.js";

export { compress, getPlantUrl, createServiceInteractionView , createFlowSequenceView}

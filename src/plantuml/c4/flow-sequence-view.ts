import FlowDescriptor, {Step} from "@electronic-architect/ea-flows/src/model/FlowDescriptor.js";
import {createContainerFromName, createRelationshipFromNameWithIndex, getFooter, getHeader} from "./c4.js";
import {Actor} from "@electronic-architect/ea-flows/src/@types/fdTypes";

/**
 *
 * @param flow Flow to create view for
 * returns plantuml string of a c4 view showing sequences
 */
export function createFlowSequenceView(flow: FlowDescriptor) : string {

    let puml: string = '';
    let actorMap: Map<string,Actor> = new Map<string,Actor>();
    let relIndex = {index: 0} //use object so we can pass by ref

    puml += getHeader();

    flow.steps.forEach(step => {processContainerStep(step, actorMap)})

    puml += processActors(actorMap);

    flow.steps.forEach(step => {puml += processRelationshipStep(step, relIndex)})

    puml += getFooter();

    return puml;
}

/**
 * Because actors will repeat this functions updates a map keyed on actor name
 * @param step The step to process
 * updates the actor map
 */
function processContainerStep(step: Step, actorMap: Map<string,Actor>) {

    if (!actorMap.has(step.producer.name)) {
        actorMap.set(step.producer.name,step.producer);
    }
    if (!actorMap.has(step.consumer.name)) {
        actorMap.set(step.consumer.name,step.consumer);
    }
    step.steps?.forEach(step => {processContainerStep(step,actorMap)})
}


/**
 * @param step The actor map to process and create containers for
 * returns the c4 plantuml string
 */
function processActors(actorMap: Map<string,Actor>): string {

    let puml: string = '';

    actorMap.forEach((actor, key) => {
        puml += createContainerFromName(key, '');
    })

    return puml;

}


/**
 *
 * @param step The step to process to create relationships for
 * returns the plantuml relationship string for this step
 */
function processRelationshipStep(step: Step, relIndex: any): string {

    let puml: string = '';

    puml += createRelationshipFromNameWithIndex(step.producer.name, step.consumer.name, step.description, relIndex.index++);

    step.steps?.forEach(step => {puml += processRelationshipStep(step,relIndex)})

    return puml;
}

import {FlowDescriptor, Step} from "@electronic-architect/ea-flows/src/model/FlowDescriptor.js";
import {createContainerFromName, createRelationshipFromNameWithIndex, getFooter, getHeader} from "./c4.js";
import {Actor} from "@electronic-architect/ea-flows/src/@types/fdTypes";
import {ServiceDescriptor} from "@electronic-architect/ea-services/src/index.js";
import {FlowRepositoryGitHub} from "@electronic-architect/ea-flows/src/index.js";

/**
 *
 * @param flow Flow to create view for
 * returns plantuml string of a c4 view showing sequences
 */
export function createFlowSequenceView(flow: FlowDescriptor, services: ServiceDescriptor[], config: any) : string {

    let puml: string = '';
    let actorMap: Map<string,Actor> = new Map<string,Actor>();
    let relIndex = {index: 0} //use object so we can pass by ref

    puml += getHeader();

    flow.steps.forEach(step => {processContainerStep(step, actorMap, config)})

    puml += processActors(actorMap, services);

    flow.steps.forEach(step => {puml += processRelationshipStep(step, relIndex, config)})

    puml += getFooter();

    return puml;
}

/**
 * Because actors will repeat this functions updates a map keyed on actor name
 * @param step The step to process
 * updates the actor map
 */
function processContainerStep(step: Step, actorMap: Map<string,Actor>, config: any) {

    //if this step is a reference, load the flow
    if (step.$ref != null) {
        loadExternalFlow(step.$ref, config).then(flow => {

            flow.steps?.forEach(subStep => {processContainerStep(subStep,actorMap, config)})

        }).catch(error => {
            console.log(error)
        });
    } else {

        if (step.producer?.name != null) {
            if (!actorMap.has(step.producer.name)) {
                actorMap.set(step.producer.name,step.producer);
            }
        }
        if (step.consumer?.name != null) {
            if (!actorMap.has(step.consumer.name)) {
                actorMap.set(step.consumer.name,step.consumer);
            }
        }

    }

    step.steps?.forEach(step => {processContainerStep(step,actorMap, config)})
}

/**
 *
 * @param ref
 * returns a FlowDescriptor loaded externally
 */
function loadExternalFlow(ref: string, config: any): Promise<FlowDescriptor>{
    const repo = new FlowRepositoryGitHub()
    config.path = ref;
    return repo.getFlow(config);
}

/**
 * @param step The actor map to process and create containers for
 * returns the c4 plantuml string
 */
function processActors(actorMap: Map<string,Actor>, services: ServiceDescriptor[]): string {

    let puml: string = '';
    let containerName = '';

    actorMap.forEach((actor, key) => {
        //is there a $ref to a service descriptor?
        containerName = key;
        if (actor.$ref != null){
            const service = services.find((service) => service._path === actor.$ref)
            if (service != null){
                containerName = service.name;
            }

        }
        puml += createContainerFromName(containerName, '');
    })

    return puml;

}


/**
 *
 * @param step The step to process to create relationships for
 * returns the plantuml relationship string for this step
 */
function processRelationshipStep(step: Step, relIndex: any, config:any): string {

    let puml: string = '';

    if (step.$ref != null) {
        loadExternalFlow(step.$ref, config).then(flow => {
            flow.steps?.forEach(subStep => {
                processRelationshipStep(subStep, relIndex, config)
            })

        }).catch(error => {
            console.log("Referenced flow could not be loaded")
        });
    }

    if (step.producer?.name !=null && step.consumer?.name !=null) {
        puml += createRelationshipFromNameWithIndex(step.producer.name, step.consumer.name, step.description, relIndex.index++);
    }
    step.steps?.forEach(step => {puml += processRelationshipStep(step,relIndex, config)})

    return puml;
}

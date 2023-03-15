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
export const createFlowSequenceView = async(flow: FlowDescriptor, services: ServiceDescriptor[], config: any): Promise<string> =>{

    let puml: string = '';
    let actorMap: Map<string,Actor> = new Map<string,Actor>();
    let relIndex = {index: 0} //use object so we can pass by ref
    let promiseArray: Promise<any>[] = [];

    puml += getHeader();

    for (let step in flow.steps){
        promiseArray.push(processContainerStep(flow.steps[step], actorMap, config));
    }
    await Promise.all(promiseArray);

    puml += processActors(actorMap, services);

    for (let step in flow.steps){
        await processRelationshipStep(flow.steps[step], relIndex, config, actorMap, services).then(data=>puml+=data);
    }

    puml += getFooter();

    return Promise.resolve(puml);
}



/**
 * Because actors will repeat this functions updates a map keyed on actor name
 * @param step The step to process
 * updates the actor map
 */
const processContainerStep = async (step: Step, actorMap: Map<string,Actor>, config: any) => {

    let promiseArray: Promise<any>[] = [];
    //if this step is a reference, load the flow
    if (step.$ref != null) {
        promiseArray.push(loadExternalFlow(step.$ref, config).then(flow => {
            for (let subStep in flow.steps){
                promiseArray.push(processContainerStep(flow.steps[subStep],actorMap, config));
            }
        }))

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

    for (let subStep in step.steps){
        // @ts-ignore
        promiseArray.push(processContainerStep(step.steps[subStep],actorMap, config));
    }

    await Promise.all(promiseArray);
}

/**
 *
 * @param ref
 * returns a FlowDescriptor loaded externally
 */
const loadExternalFlow = async(ref: string, config: any): Promise<FlowDescriptor> =>{
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

    actorMap.forEach((actor, key) => {
        //is there a $ref to a service descriptor?
        const [containerName, description] = getContainerNameForActor(key, actorMap,services);
        puml += createContainerFromName(containerName, description);
    })

    return puml;

}


/**
 *
 * @param actorName
 * @param actorMap
 * @param services
 * return the name of the actor, looked up the service descriptors if a $ref was supplied
 */
function getContainerNameForActor(actorName: string, actorMap: Map<string,Actor>, services: ServiceDescriptor[]){
    let actor: Actor | undefined = actorMap.get(actorName);
    let containerName: string = actorName;
    let description = '';

    if (actor !=null) {
        if (actor.$ref != null){
            const service = services.find((service) => service._path === actor?.$ref)
            if (service != null){
                containerName = service.name;
                description = service.description;
            }

        }
    }
    return [containerName, description] as const;
}

/**
 *
 * @param step The step to process to create relationships for
 * returns the plantuml relationship string for this step
 */
const processRelationshipStep = async(step: Step, relIndex: any, config:any, actorMap: Map<string,Actor>, services: ServiceDescriptor[]): Promise<string> => {

    let puml: string = '';

    if (step.$ref != null) {
        const flow = await loadExternalFlow(step.$ref, config);
        for (let subStep in flow.steps){
            //we cannot use Promise.all as they may complete in the wrong order
            await processRelationshipStep(flow.steps[subStep], relIndex, config, actorMap, services).then(data=>{puml+=data});
        }

    }

    if (step.producer?.name !=null && step.consumer?.name !=null) {
        const [pName, pDescription] = getContainerNameForActor(step.producer.name, actorMap, services);
        const [cName, cDescription] = getContainerNameForActor(step.consumer.name, actorMap, services);
        puml += createRelationshipFromNameWithIndex(pName, cName, step.description, relIndex.index++);
    }


    for (let subStep in step.steps){
        //we cannot use Promise.all as they may complete in the wrong order
        // @ts-ignore
        await processRelationshipStep(step.steps[subStep],relIndex, config, actorMap, services).then(data => puml+=data);

    }

    return puml;
}

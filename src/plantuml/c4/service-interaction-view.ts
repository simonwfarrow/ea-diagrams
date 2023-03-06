import {ServiceDescriptor} from "@electronic-architect/ea-services/src/index.js";
import {createContainer, createContainerFromName, createRelationshipFromName, getFooter, getHeader} from "./c4.js";

/**
 *
 * @param service
 * returns a plantuml string of a single service and all defined interactions
 */
export function createServiceInteractionView(service: ServiceDescriptor) : string {

    let puml: string = '';

    puml += getHeader();

    puml += createContainer(service);

    // write out all the containers first as they must exist before relationships can be made
    for (const [key,interaction] of Object.entries(service.interactions)){
        puml += createContainerFromName(interaction.name, '');
    }

    // now write out all the relationships between the services
    for (const [key,interaction] of Object.entries(service.interactions)){
        switch (interaction.flow_direction) {
            case 'in':
                puml += createRelationshipFromName(interaction.name, service.name, interaction.description);
                break;
            case 'out':
                puml += createRelationshipFromName(service.name, interaction.name, interaction.description);
        }

    }

    puml += getFooter();

    return puml;
}

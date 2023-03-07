import {ServiceDescriptor} from '@electronic-architect/ea-services/src/@types/sdTypes.js';

/**
 *
 * @param service ServiceDescriptor to parse
 * returns a c4 plantuml string representation of a Service as a System
 */
export function createSystem(service: ServiceDescriptor): string {
    return `System(${formatName(service.name)}, \"${service.name}\", $descr=\"${service.description}\")\n`
}

/**
 *
 * @param service ServiceDescriptor to parse
 * returns a c4 plantuml string representation of a Service as a Container
 */
export function createContainer(service: ServiceDescriptor): string {
    return `Container(${formatName(service.name)}, \"${service.name}\", $descr=\"${service.description}\")\n`
}

/**
 *
 * @param name the name of the container
 * @param description description of the container
 * returns a c4 plantuml string representation of a named  Container
 */
export function createContainerFromName(name: string, description: string): string {
    return `Container(${formatName(name)}, \"${name}\", $descr=\"${description}\")\n`
}


/**
 *
 * @param fromService
 * @param toService
 * returns a c4 plantuml relationship between two named services
 */
export function createRelationshipFromName(fromService: string, toService: string, label: string): string {
    return `Rel(${formatName(fromService)}, ${formatName(toService)}, \"${label}\")\n`

}

/**
 *
 * @param fromService
 * @param toService
 * @param index
 * returns a c4 plantuml relationship between two named services
 */
export function createRelationshipFromNameWithIndex(fromService: string, toService: string, label: string, index: number): string {
    return `RelIndex(${index}, ${formatName(fromService)}, ${formatName(toService)}, \"${label}\")\n`

}

/**
 *
 * @param fromService
 * @param toService
 * returns a c4 plantuml relationship between two services
 */
export function createRelationship(fromService: ServiceDescriptor, toService: ServiceDescriptor, label: string): string {
    return `Rel(${formatName(fromService.name)}, ${formatName(toService.name)}, \"${label}\")\n`

}

/**
 * returns the c4 plantuml header
 */
export function getHeader(): string {
    return "@startuml\nskinparam backgroundColor transparent\n" +
        "!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml\n" +
        "!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml\n" +
        "!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml\n" +
        "!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml\n"
}

/**
 * returns the c4 plantuml footer
 */
export function getFooter(): string {
    return "@enduml"
}

/**
 *
 * @param name
 * returns name stripped of spaces and converted to lower case
 */
function formatName(name: string ) {
    return name.replace(/ /g, '').toLowerCase();
}

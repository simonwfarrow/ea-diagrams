import {ServiceDescriptor} from '@electronic-architect/ea-services/src/@types/sdTypes.js';

/**
 *
 * @param service ServiceDescriptor to parse
 * returns a c4 plantuml string representation of a Service as a System
 */
export function toSystem(service: ServiceDescriptor): string {
    return `System(${formatName(service.name)}, \"${service.name}\")\n`
}

/**
 *
 * @param fromService
 * @param toService
 * returns a c4 plantuml relationship between two services
 */
export function toRelationship(fromService: ServiceDescriptor, toService: ServiceDescriptor): string {
    return `Rel(${formatName(fromService.name)}, ${formatName(toService.name)})\n`

}

/**
 *
 * @param name
 * returns name stripped of spaces and converted to lower case
 */
function formatName(name: string ) {
    return name.replace(' ', '').toLowerCase();
}

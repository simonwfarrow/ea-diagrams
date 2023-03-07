import {expect} from "chai";
import FlowDescriptor from "@electronic-architect/ea-flows/src/model/FlowDescriptor.js";
import {createFlowSequenceView} from "./flow-sequence-view.js";

const fdStr : string  = 'id: example_flow\n' +
    'version: 1.0\n' +
    'name: Example Flow\n' +
    'description: This is an example flow\n' +
    'tags:\n' +
    '  - tag1\n' +
    '  - tag2\n' +
    'links:\n' +
    '  - name: Link 1\n' +
    '    url: https://google.co.uk\n' +
    '    description: Link to google\n' +
    'review:\n' +
    '  - name: Me\n' +
    '    date: 06/10/22\n' +
    'steps:\n' +
    '  - sequence: 1\n' +
    '    description: First Step\n' +
    '    note: |\n' +
    '      Multiline note\n' +
    '      example\n' +
    '    producer:\n' +
    '      name: Actor1\n' +
    '    consumer:\n' +
    '      name: Actor2\n' +
    '      $ref: \'service_descriptors/actor2.yml\'\n' +
    '    return:\n' +
    '      value: some response\n' +
    '      interaction:\n' +
    '        $ref: \'service_descriptors/actor2.yml#/interactions/example_response\'\n' +
    '        endpoint: response_topic\n' +
    '    interaction:\n' +
    '      $ref: \'service_descriptors/actor2.yml#/interactions/example_request\'\n' +
    '      endpoint: create_topic\n' +
    '    steps:\n' +
    '      - sequence: 1\n' +
    '        condition:\n' +
    '          name: example condition\n' +
    '        description: Another request\n' +
    '        producer:\n' +
    '          name: Actor2\n' +
    '          $ref: \'service_descriptors/actor2.yml\'\n' +
    '        consumer:\n' +
    '          name: actor3\n';

describe('The flow-sequence-view module', function() {
    it('generates a container c4 diagram from a flow descriptor', function () {

        let fd: FlowDescriptor  = new FlowDescriptor(fdStr);

        const result = createFlowSequenceView(fd);

        expect('@startuml\n' +
            'skinparam backgroundColor transparent\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml\n' +
            'Container(actor1, "Actor1", $descr="")\n' +
            'Container(actor2, "Actor2", $descr="")\n' +
            'Container(actor3, "actor3", $descr="")\n' +
            'RelIndex(0, actor1, actor2, "First Step")\n' +
            'RelIndex(1, actor2, actor3, "Another request")\n' +
            '@enduml').to.eq(result);

    })
})

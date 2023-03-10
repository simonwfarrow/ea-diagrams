import {expect} from "chai";
import {FlowDescriptor} from "@electronic-architect/ea-flows/src/model/FlowDescriptor.js";
import {createFlowSequenceView} from "./flow-sequence-view.js";
import {ServiceDescriptor} from "@electronic-architect/ea-services/src/index.js";
import {getGitHubGraphQLConn} from "@electronic-architect/ea-content/src/index.js";
import * as dotenv from 'dotenv';
dotenv.config()

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
    '      $ref: \'resources/service_descriptors/actor2.yml\'\n' +
    '    return:\n' +
    '      value: some response\n' +
    '      interaction:\n' +
    '        $ref: \'resources/service_descriptors/actor2.yml#/interactions/example_response\'\n' +
    '        endpoint: response_topic\n' +
    '    interaction:\n' +
    '      $ref: \'resources/service_descriptors/actor2.yml#/interactions/example_request\'\n' +
    '      endpoint: create_topic\n' +
    '    steps:\n' +
    '      - sequence: 1\n' +
    '        condition:\n' +
    '          name: example condition\n' +
    '        description: Another request\n' +
    '        producer:\n' +
    '          name: Actor2\n' +
    '          $ref: \'resources/service_descriptors/actor2.yml\'\n' +
    '        consumer:\n' +
    '          name: actor3\n' +
    '      - sequence: 2\n' +
    '        $ref: \'resources/architecture_flows/sequence/example_flow2.yml\'';

const sdStr : string  = '_path: resources/service_descriptors/actor2.yml\n' +
    'name: Example Service\n' +
    'description: Example of a service descriptor\n' +
    'type: platform\n' +
    'status: Live\n' +
    'code_repo: https://github.com/simonwfarrow/ea-resources\n' +
    'doc_repo: https://github.com/simonwfarrow/ea-resources\n' +
    'secrets_management:\n' +
    '  name: Vault\n' +
    '  repo: https://github.com/simonwfarrow/ea-resources\n' +
    'team: Home\n' +
    'technology:\n' +
    '  - name: Java\n' +
    '    type: language\n' +
    '    version: 11\n' +
    '  - name: Springboot\n' +
    '    type: framework\n' +
    '    version: 2.6.7\n' +
    '  - name: Docker\n' +
    '    type: container\n' +
    '    version: 2.4\n' +
    'quality_stage_gates:\n' +
    '  unit_test_coverage: 99%\n' +
    '  automated_acceptance_tests: yes\n' +
    '  load_tests: yes\n' +
    '  resiliency_tests: manual (DR performed once a year)\n' +
    '  independently_deployable: yes\n' +
    'build_tool:\n' +
    '  name: Gradle\n' +
    '  url: N/A\n' +
    'ci_pipelines: # array of CI pipelines\n' +
    '  - name: CV Build\n' +
    '    url: https://github.com/simonwfarrow/ea-resources\n' +
    'ops_dashboards: # array of operational dashboards i.e.\n' +
    '  - name: Dashboard Link\n' +
    '    url: https://github.com/simonwfarrow/ea-resources\n' +
    '    type: None\n' +
    'interactions:\n' +
    '  example_in:\n' +
    '    name: Service 2\n' +
    '    endpoints: \n' +
    '      in: https://github.com/simonwfarrow/ea-resources\n' +
    '    protocol: https\n' +
    '    timeout: 30s\n' +
    '    simulator_available: yes\n' +
    '    repo: https://github.com/simonwfarrow/ea-resources\n' +
    '    description: Calls our service\n' +
    '    flow_direction: in\n' +
    '    pact: None\n' +
    '  example_out:\n' +
    '    name: Service 3\n' +
    '    endpoints: \n' +
    '      in: https://github.com/simonwfarrow/ea-resources\n' +
    '    protocol: https\n' +
    '    timeout: 30s\n' +
    '    simulator_available: yes\n' +
    '    repo: https://github.com/simonwfarrow/ea-resources\n' +
    '    description: Our service call this service\n' +
    '    flow_direction: out\n' +
    '    pact: None\n' +
    'diagrams: # array of diagrams\n' +
    'deployment: # intended to capture where the service runs\n' +
    '  hosting: EC2\n' +
    '  aws_accounts:\n' +
    '    - name: Service Account\n' +
    '      number: 99999999\n' +
    '  deployment_repo:\n' +
    '  deployment_mechanism: \n' +
    '  regions: # array of aws regions the service runs out of and replica count i.e.\n' +
    '    - name: eu-west-1\n' +
    '      replicas: 3\n' +
    '    - name: eu-west-2\n' +
    '      replicas: 3\n' +
    '    - name: eu-central-1\n' +
    '      replicas: 3\n' +
    '  cd_pipelines: # array of CD pipelines\n' +
    '    - name: CD Pipeline\n' +
    '      url: https://pipeline\n' +
    'endpoint: # array of the public/private endpoints this service provides, could be a single link to the root resource\n' +
    '  name: Home\n' +
    '  url: https://github.com/simonwfarrow/ea-resources\n' +
    '  public: true\n' +
    '  data_classification: public\n' +
    '  authentication:\n' +
    '      - basic\n' +
    '      - jwt\n' +
    'security:\n' +
    '  transport:\n' +
    '    protocol: http\n' +
    '    encryption: tls\n' +
    '  at_rest_encryption: N/A';

describe('The flow-sequence-view module', function() {
    it('generates a container c4 diagram from a flow descriptor', function () {

        let fd: FlowDescriptor  = new FlowDescriptor(fdStr);
        let service = new ServiceDescriptor(sdStr,'resources/service_descriptors/actor2.yml');
        let services = [];
        services.push(service);

        let conn = getGitHubGraphQLConn(process.env.HOST || 'https://api.github.com' ,`Bearer ${process.env.TOKEN}`);
        const config = {
            connection: conn,
            owner: 'simonwfarrow',
            repo: 'ea-resources'
        };

        const result = createFlowSequenceView(fd, services, config);

        expect('@startuml\n' +
            'skinparam backgroundColor transparent\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml\n' +
            'Container(actor1, "Actor1", $descr="")\n' +
            'Container(exampleservice, "Example Service", $descr="")\n' +
            'Container(actor3, "actor3", $descr="")\n' +
            'RelIndex(0, actor1, actor2, "First Step")\n' +
            'RelIndex(1, actor2, actor3, "Another request")\n' +
            '@enduml').to.eq(result);

    })
})

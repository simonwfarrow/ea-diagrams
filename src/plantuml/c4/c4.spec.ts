import {expect} from "chai";
import {ServiceDescriptor} from "@electronic-architect/ea-services/src/index.js";
import {toRelationship, toSystem} from "./c4.js";

const sdStr : string  = 'name: Example Service\n' +
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

describe('The c4 module', function() {
    it('generates the system c4 plantuml string from a service descriptor', function () {

        let sd: ServiceDescriptor = new ServiceDescriptor(sdStr);

        const result = toSystem(sd);

        expect('System(exampleservice, "Example Service")\n').to.eq(result);

    }),
    it('generates the relationship c4 plantuml string for two services', function () {

        let sd1: ServiceDescriptor = new ServiceDescriptor(sdStr);
        let sd2: ServiceDescriptor = new ServiceDescriptor(sdStr);

        const result = toRelationship(sd1,sd2);

        expect('Rel(exampleservice, exampleservice)\n').to.eq(result);

    })
})

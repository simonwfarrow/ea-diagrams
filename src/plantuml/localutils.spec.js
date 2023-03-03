
import {getPlantSVG} from "./localutils.js";
import { assert} from "chai";
import * as fs from 'fs';

describe('The utils module', function() {

    after('remove files after tests', function() {
        //delete output files
        fs.rmSync('/tmp/test.puml');
        fs.rmSync('/tmp/test.svg');
    })


    it('creates an svg', function () {
        this.timeout(10000); //creating an svg is slow, set a high timeout
        const plantuml = '@startuml\n' +
            'skinparam backgroundColor transparent\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml\n' +
            '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml\n' +
            'Boundary(vpc-123,vpc-123-110.140.32.0/21){\n' +
            'Container(access3ds, Access 3DS)\n' +
            '}\n' +
            'SHOW_LEGEND()\n' +
            '@enduml\n'

        getPlantSVG(plantuml, '/tmp/test.puml');
        fs.access('/tmp/test.svg', fs.F_OK, (err) => {
            if (err) {
                assert.fail('svg not created')
            }
            assert(true,'svg created');
        })


    })

})




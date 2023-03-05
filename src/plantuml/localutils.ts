import {spawnSync} from 'node:child_process'
import * as fs from 'fs';

export function getPlantSVG(plantStr: string, path: string){
    //we use sync methods as we want to only return once the svg has been created
    //write planstr to file
    fs.writeFileSync(path, plantStr)
    //pass file to plantuml java process to create svg
    spawnSync('java', ['-Dcom.sun.net.ssl.checkRevocation=false ', '-jar', 'bin/plantuml.jar', '-tsvg', path]);

}

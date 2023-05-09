import {compress} from "./compress.js";
import {expect} from "chai";

const plantuml = '@startuml\n' +
    'skinparam backgroundColor transparent\n' +
    '!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml\n' +
    'AddRelTag("new_contract", $textColor="red", $lineColor="red", $sprite="&battery-empty", $legendSprite="&battery-empty", $legendText="New Contract")\n' +
    'AddRelTag("api_drafted", $textColor="orange", $lineColor="orange", $sprite="&pencil", $legendSprite="&pencil", $legendText="API Drafted")\n' +
    'AddRelTag("architecture_drafted", $textColor="grey", $lineColor="grey", $sprite="&map", $legendSprite="&map", $legendText="Architecture Drafted")\n' +
    'AddRelTag("qa_gates_passed", $textColor="purple", $lineColor="purple", $sprite="&shield", $legendSprite="&shield", $legendText="QA Gates Passed")\n' +
    'AddRelTag("try", $textColor="blue", $lineColor="blue", $sprite="&check", $legendSprite="&check", $legendText="Try")\n' +
    'AddRelTag("live", $textColor="green", $lineColor="green", $sprite="&battery-full", $legendSprite="&battery-full", $legendText="Live")\n' +
    'AddRelTag("default", $textColor="black", $lineColor="black", $sprite="&ban", $legendSprite="&ban", $legendText="No Status")\n' +
    'System_Boundary(s1,"Service Boundary") {\n' +
    'System(access3ds,"Access 3DS","Provides a 3DS card check")\n' +
    '}\n' +
    'System(tokensservice,"Tokens Service")\n' +
    'System(wpg,"WPG")\n' +
    'Rel(access3ds,tokensservice,"To retrieve the card details from a merchant token ",$tags="undefined")\n' +
    'Rel(access3ds,wpg,"Routing of card authentication currently go to WPG as the downstream gateway ",$tags="undefined")\n' +
    'SHOW_LEGEND()\n' +
    '@enduml';

describe('The compress module', function () {
    it('compresses the plantuml string', function () {
        const result = compress(plantuml)
        expect(result).to.eq('https://www.plantuml.com/plantuml/svg/XPHHRzem4CVV-HHUL4qWXQAfUvg4L4QhRbBNiSBKn-YmZyJ2iJFx38kcVVSv2L2IiEqD_kUx_yztyTqw0ai-LmEtbRe02pbR0z-crdWjvaOPoyY2TY64cWPlfERA2sGPKU4-J2OMzjUffCollKFBZQPmx9gRV58eq5NbiIEXv7eoVpzULDBtBu-J71oX3L8ohp9-qdLHCSo4U4QrWdGOQTmdLJKBdAAONLM7QfnfP55KYf8Qsuehh2ISHc_NGA5yESQyeB8-YobgiVnFV1Kyfj4Jxjdyw3mwPu929iB2XXgxCoGJMfHYX-fLF84LgBbK5uYwWGPbjlZCxWw6RHBBiv38oLly2r9giUm07QKJJWx51PQMUW0vyxjCz0EI50XTKe1pFPZ2sq9r-_Cgde1S9b692qpTG8FrRSOUAbEsQ4nRH6JB3iLQ-Ix3KJeHy0pvzW90Hs_yLy6YvQda3ljpGDqVHAFrljYDL-eV7smxt40yLfuj2e4Ry8fwjuV33SwlVz3EGFH5Vzrx9eOj2SYxuBqimtFEau_LpW1R3jsxE5gYtKcEx2X68_RhS708dADpDyB5qQp-oMxkbb4SBQpPIH7c2PN0E5Z1ciQF1h-FoMIsgCEuw_9njAh_ieFT2MQuBz8uUbay12NqvSoobyyiafMuGqOPDgO22QHoR6DD7c3oiDcoiBfOdSkY-8eWTTCet0mtePkYPrAxFnjFKgVCR9ggu8E19ic1fD6CUrljL5Mor8JABC0oS3M4C7ljo6BOnjMhsaDvsNJvwUjBydZ_SFzqDnmDRiDmmXhz0m00');
    })
})

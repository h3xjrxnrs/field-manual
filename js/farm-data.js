// FIELD MANUAL / FARM DESIGNER — data and documented planning assumptions.
// Sources: https://wiki.facepunch.com/rust/Farming_Basics
// https://www.rustrician.io/handbook/ ; https://rustpedia.com/item/large-planter-box
// Sprinklers use water, not a separate electrical connection. Composite kits
// group physical components for budgeting and must be assembled in game.
export const ITEMS = {
  planter:{name:'Large planter',short:'PLANTER',group:'Crops',layer:'floor',slots:9,cost:{Wood:200,Tarp:2}},
  smallPlanter:{name:'Small planter',short:'SMALL BED',group:'Crops',layer:'floor',slots:3,cost:{Wood:100,Tarp:1}},
  composter:{name:'Composter',short:'COMPOST',group:'Crops',layer:'utility',cost:{Wood:200,Tarp:2}},
  light:{name:'Ceiling light',short:'LIGHT',group:'Climate',layer:'ceiling',power:2,cost:{'Metal fragments':50}},
  sprinkler:{name:'Sprinkler',short:'SPRAY',group:'Climate',layer:'ceiling',waterDemand:2,cost:{'Metal fragments':75}},
  heater:{name:'Electric heater',short:'HEAT',group:'Climate',layer:'wall',power:3,cost:{'Metal fragments':200}},
  pump:{name:'Freshwater pump',short:'PUMP',group:'Water',layer:'utility',power:5,water:8,limit:4,cost:{Wood:250,'Metal fragments':200,Gears:1}},
  salt:{name:'Saltwater purification kit',short:'SALT KIT',group:'Water',layer:'utility',power:15,water:8,limit:4,cost:{Wood:600,'Metal fragments':775,Gears:2,Cloth:20},parts:{'Water pump':2,'Powered water purifier':1,'Fluid combiner':1},extra:'Kit occupies multiple real placements; both pumps need access to saltwater.'},
  barrel:{name:'Water barrel',short:'BARREL',group:'Water',layer:'utility',water:12,limit:6,capacity:20000,cost:{Wood:250,Tarp:1}},
  boosted:{name:'Barrel + pump switch',short:'BOOST',group:'Water',layer:'utility',water:12,limit:6,capacity:20000,power:1,cost:{Wood:250,Tarp:1,'Metal fragments':150},parts:{'Water barrel':1,'Fluid Switch & Pump':1}},
  small:{name:'Small battery',short:'BAT S',group:'Power',layer:'utility',output:15,charge:400,chargeLimit:60,cost:{'High quality metal':5}},
  medium:{name:'Medium battery',short:'BAT M',group:'Power',layer:'utility',output:50,charge:9000,chargeLimit:200,cost:{'High quality metal':5,'Tech trash':1}},
  large:{name:'Large battery',short:'BAT L',group:'Power',layer:'utility',output:100,charge:24000,chargeLimit:400,cost:{'High quality metal':10,'Tech trash':2}},
  solar:{name:'Large solar panel',short:'SOLAR',group:'Power',layer:'roof',generation:20,cost:{'High quality metal':5,'Tech trash':1}},
};
export const SETTINGS={lightRadius:3,waterRadius:3.2,heatRadius:3,solarHours:8,reserve:3};
export const CROPS=['Hemp','Corn','Potato','Pumpkin','Blue berry','Red berry','Green berry','Yellow berry','White berry','Black berry','Other'];

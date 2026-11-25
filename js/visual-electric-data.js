// FIELD MANUAL — original visual walkthroughs based on the existing electrical handbook.
import { guides } from './electric-data.js';
const ELEC='https://rustrician.io/handbook/';
const PATCH='https://rust.facepunch.com/news/waves-of-change';
const DEF='https://rust.facepunch.com/news/solid-foundations';
const FARM='https://wiki.facepunch.com/rust/Farming_Basics';
const scene=(title,text,objects,check,layout='parallel')=>({title,text,objects,check,layout,links:[]});
const link=(a,b,c,d,k='Power')=>[a,b,c,d,k];
const rows=(title,text,links,check)=>({title,text,links,check,objects:[],layout:'connections'});
const get=id=>guides.find(g=>g.id===id);
const rename={'Panel A':'Solar Panel A','Panel B':'Solar Panel B','Branch A':'Electrical Branch A','Branch B':'Electrical Branch B','Branch':'Electrical Branch','Splitter':'Electrical Splitter','Turret':'Auto Turret','Turret A':'Auto Turret A','Turret B':'Auto Turret B','Turret C':'Auto Turret C','Furnace':'Electric Furnace','HBHF':'HBHF Sensor','Barrel':'Water Barrel'};
const wires=(id,...indices)=>indices.map(i=>{const w=get(id).wires[i];const [a,b]=w.src.split(' · '),[c,d]=w.dst.split(' · ');return [rename[a]||a,a==='Splitter'?b.replace(/^Out (\d)$/,'Power Out $1'):b,rename[c]||c,d,w.type];});
const guide=(id,steps,extra={})=>{const old=get(id);return {id:'electric-'+id,category:'Electricity',title:old.title,summary:old.summary,parts:old.parts,level:old.level,tip:old.notes+' | '+old.power,refs:[ELEC,PATCH,...(old.category==='Defense'?[DEF]:[]),...(old.category==='Water'?[FARM]:[])],steps,...extra};};
export const electricVisualGuides=[
 guide('starter',[
 scene('Place the solar panel','Mount the panel where sunlight reaches it. Put the battery and switch in a protected location.',[['Solar Panel','Clear sky'],['Battery','Protected location'],['Switch','Initially off']],'Daylight output is visible.'),
 rows('Charge the battery','Connect the panel output to the battery input. Allow the battery to charge.',wires('starter',0),'Battery charge increases when generation exceeds load.'),
 rows('Wire the switch and light','Use the battery output for the switch. Connect the switch output to the light.',wires('starter',1,2),'Check both wires before switching on.'),
 scene('Test the circuit','Turn the switch on and inspect the lamp and battery Active Usage. Turn it off to verify control.',[['Battery','Check charge'],['Switch','On / off'],['Ceiling Light','Lights when on']],'Lamp stays lit when solar generation falls and charge remains.','sequence')]),
 guide('solar',[
 scene('Place both panels','Place and orient each panel for unobstructed sun exposure.',[['Solar Panel A','Clear exposure'],['Solar Panel B','Clear exposure'],['Root Combiner','Accessible']],'Both panels report generation in daylight.'),
 rows('Combine the sources','Connect each solar panel to its own root input.',wires('solar',0,1),'Both root inputs have power.'),
 rows('Charge the battery','Connect the combined output to the battery input.',wires('solar',2),'Combined power reaches the battery.'),
 scene('Check generation over time','Inspect morning, midday and evening generation. Check battery charging and output separately.',[['Solar Panel','Variable output'],['Root Combiner','Combined output'],['Battery','Charge reserve']],'Battery charge covers periods without sunlight.','sequence')]),
 guide('distribution',[
 scene('Set up the branches','Use a charged medium battery. Set Electrical Branch A to 10 and Branch B to 3. Keep defense disabled until authorized.',[['Battery','50 max output'],['Electrical Branch A','Branch Out = 10'],['Electrical Branch B','Branch Out = 3']],'Both branch settings are saved.'),
 rows('Wire the distribution trunk','Connect the battery to branch A, then carry remaining power from A to B.',wires('distribution',0,2),'Power Out, not Branch Out, feeds B.'),
 rows('Connect the two loads','Use the reserved outputs for the turret and furnace. Confirm the turret is authorized first.',wires('distribution',1,3),'Each device receives its intended power.'),
 scene('Inspect the circuit','Check the individual inputs and battery Active Usage. Allow extra headroom for control outputs if used.',[['Auto Turret','10 rW base'],['Electric Furnace','3 rW base'],['Battery','Inspect load']],'Both devices operate without overloading the battery.')]),
 guide('turret',[
 scene('Install the turret','Place the turret in game with the intended facing. Leave it unpowered.',[['Auto Turret','Power OFF'],['Switch','OFF'],['Battery','Charged']],'Turret is inactive while configuring.'),
 scene('Authorize your team','Open the turret interaction menu and authorize the intended players before applying power.',[['Auto Turret','Authorization menu'],['Player','Authorized']],'All intended teammates are authorized.'),
 scene('Load the in-game turret','Place a compatible in-game weapon and matching ammunition in the turret inventory.',[['Auto Turret','Inventory'],['Ammo','Matching type']],'Weapon and ammo are accepted.'),
 rows('Connect power through a switch','Connect the battery output to the switch, then the switch output to the turret.',wires('turret',0,1),'At least 10 rW at the turret input when on.'),
 scene('Verify normal operation','Activate from a safe position. Inspect status, authorization, ammunition and interference.',[['Switch','ON'],['Auto Turret','Active status']],'No unexpected interference or authorization issue.')]),
 guide('turret-bank',[
 scene('Prepare all three turrets','Place and authorize each turret, load the matching in-game ammo and keep power off.',[['Auto Turret A','Prepared'],['Auto Turret B','Prepared'],['Auto Turret C','Prepared']],'Each turret is ready before activation.'),
 rows('Wire the main supply','Connect a charged medium or large battery through the master switch into the electrical splitter.',wires('turret-bank',0,1),'Master switch stays off while wiring.'),
 rows('Connect one turret per output','Use a distinct splitter output for each turret.',wires('turret-bank',2,3,4),'All three outputs are individually connected.'),
 scene('Activate and verify','Turn on the master switch. Check the actual power at every turret and inspect their interference indicators.',[['Auto Turret A','≥10 rW'],['Auto Turret B','≥10 rW'],['Auto Turret C','≥10 rW']],'All three operate and receive sufficient power.')]),
 guide('turret-alarm',[
 scene('Prepare the turret','Start with a functioning authorized turret and a low-power indicator or alarm.',[['Auto Turret','Configured'],['Audio Alarm','Check draw'],['Battery','Extra headroom']],'The turret is already working normally.'),
 rows('Provide extra power','Connect a source with enough power for the turret and signal output.',wires('turret-alarm',0),'Input exceeds the base requirement.'),
 rows('Use the target signal','Connect Has Target to a compatible indicator. If the available signal is insufficient, use a separately powered logic circuit.',wires('turret-alarm',1),'Indicator can respond at the available output.'),
 scene('Test the status','Compare the target output in inactive and active states during a controlled in-game test.',[['Auto Turret','Has Target'],['Audio Alarm','Observe status']],'Indicator behavior matches the target signal.')]),
 guide('sam',[
 scene('Place the SAM site','Place it with clearance, and keep the circuit switched off during setup.',[['SAM Site','Unpowered'],['Switch','OFF'],['Battery','Charged']],'The site is accessible.'),
 scene('Configure targeting','Load the appropriate in-game ammunition and select the intended targeting mode.',[['SAM Site','Check mode'],['Ammo','SAM ammo']],'Mode and ammunition are correct.'),
 rows('Connect the dedicated circuit','Use a charged battery with sufficient output. Wire through a switch to the SAM site.',wires('sam',0,1),'At least 25 rW reaches the input.'),
 scene('Verify operation','Check targeting mode, ammunition and obstructions before use. Keep the cutoff accessible.',[['SAM Site','Status'],['Switch','Cutoff'],['Battery','Check load']],'Friendly aircraft policy and cutoff are understood.')]),
 guide('door',[
 scene('Install the door controller','Place the controller beside a compatible door. Keep a second exit available.',[['Door','Compatible'],['Door Controller','Adjacent']],'The controller is within pairing range.'),
 scene('Pair and secure','Follow the in-game pairing prompts, then restore the lock state as appropriate.',[['Door Controller','Pair'],['Door','Relock']],'The controller indicates successful pairing.','sequence'),
 rows('Wire remote control','Feed the controller through a switch. Keep the separate Open and Close inputs unused for this simple circuit.',wires('door',0,1),'Power reaches the controller when switched on.'),
 scene('Test opening and closing','Test both switch states from a safe side with another exit available.',[['Switch','On / off'],['Door Controller','Paired'],['Door','Open / close']],'Both states work without trapping you.','sequence')]),
 guide('sensor',[
 scene('Configure the sensor','Place the HBHF sensor and set its player authorization filters and detection range.',[['HBHF Sensor','Range / filters'],['Audio Alarm','Local indicator']],'The intended players match the configured filter.'),
 rows('Provide sensor power','Reserve sufficient power for sensor and signal. Feed the remaining power to the AND switch input A.',wires('sensor',0,1,2),'Main input and sensor supply are present.'),
 rows('Wire the trigger and alarm','Connect the sensor signal to input B of the AND switch. Route gate output to the alarm.',wires('sensor',3,4),'Gate output is adequate for the alarm when triggered.'),
 scene('Verify detection','Test with the intended player filters. Check actual gate output if the alarm does not sound.',[['HBHF Sensor','Detection'],['AND Switch','Both inputs'],['Audio Alarm','Response']],'Expected alarm activates and clears.','sequence')]),
 guide('smart-alarm',[
 scene('Pair the Smart Alarm','Place and pair it with the official Rust+ application using the in-game instructions.',[['Smart Alarm','Pairing'],['Phone','Official Rust+']],'The device appears in the official app.'),
 rows('Supply test power','Connect the alarm through a switch to a charged battery.',wires('smart-alarm',0,1),'Alarm input receives power when switched on.'),
 scene('Test notifications','Toggle the switch and verify that the official app receives the alert; check notification permissions if not.',[['Switch','Toggle'],['Smart Alarm','Triggered'],['Phone','Notification']],'A notification is delivered.','sequence'),
 scene('Optional detection circuit','Once the alarm works, use a compatible powered detection circuit instead of the manual switch. See Motion-triggered local alarm.',[['HBHF Sensor','Optional trigger'],['AND Switch','Powered gate'],['Smart Alarm','Output load']],'Test the replacement circuit before relying on alerts.','sequence')]),
 guide('timer',[
 scene('Set the timer duration','Open the timer interaction menu and choose the desired duration.',[['Timer','Set duration'],['Button','Trigger pulse'],['Ceiling Light','Output load']],'Duration is saved.'),
 rows('Supply the timer','Power the timer main input before sending any trigger signal.',wires('timer',0),'Main input is live.'),
 rows('Connect the trigger','Connect the button output to Toggle On. If your variant needs an external feed, supply it through a separate branch.',wires('timer',1),'Button pulse reaches Toggle On.'),
 rows('Connect the light','Wire timer output to the lamp.',wires('timer',2),'Lamp input is correctly wired.'),
 scene('Test the timed cycle','Press the button and check that the light turns on, remains on for the set duration, then turns off.',[['Button','Press once'],['Timer','Countdown'],['Ceiling Light','Automatic off']],'Light follows the configured duration.','sequence')]),
 guide('water',[
 scene('Place the pump','Find a valid freshwater intake position. Place the sprinkler above or near the intended bed.',[['River','Fresh water'],['Water Pump','Valid intake'],['Sprinkler','Above bed']],'Intake is not saltwater.'),
 rows('Power the pump','Supply at least 5 rW and enable it.',wires('water',0),'Pump runs normally.'),
 rows('Connect direct irrigation','Use the hose tool to connect pump output to sprinkler input.',[link('Water Pump','Water Out','Sprinkler','Water In','Water')],'Sprinkler receives fresh water.'),
 rows('Optional gravity buffer','As an alternative to direct irrigation, feed a barrel and route its output downhill. Use a powered fluid lift if the route rises.',[link('Water Pump','Water Out','Water Barrel','Water In','Water'),link('Water Barrel','Water Out','Sprinkler','Water In','Water')],'Water reaches the bed; check reservoir height.'),
 scene('Verify plant conditions','Inspect plants across the bed and adjust water delivery. Avoid prolonged overwatering or insufficient water.',[['Sprinkler','Active'],['Large Planter','Water level'],['Plant','Water condition']],'Water condition remains suitable.','coverage')]),
 guide('camera',[
 scene('Mount the camera','Place a deployable powered CCTV camera in a useful position in your own in-game base.',[['CCTV Camera','Viewing angle'],['Wall','Mount']],'Camera has a clear view.'),
 scene('Assign an identifier','Open the camera interaction menu and set a unique identifier.',[['CCTV Camera','Set identifier'],['Computer Station','Record identifier']],'Identifier is saved exactly.'),
 rows('Power the camera','Connect a charged battery or a suitable distribution output to the camera.',wires('camera',0),'Standard camera receives at least 3 rW.'),
 scene('View the feed','Use the Computer Station in game and add the camera identifier.',[['CCTV Camera','Powered'],['Computer Station','Add identifier']],'The in-game feed opens.','sequence')]),
 guide('debug',[
 scene('Check the source first','Inspect generation, battery charge and Active Usage before changing any wires.',[['Solar Panel','Output'],['Battery','Charge / load']],'Source has enough power.'),
 scene('Trace one path','With the Wire Tool, follow the existing circuit one link at a time. Identify the first input with unexpectedly low power.',[['Battery','Source'],['Wire Tool','Inspect ports'],['Ceiling Light','Load']],'First failed link is identified.','sequence'),
 scene('Inspect distribution','Check branch reservations and all connected splitter outputs.',[['Electrical Branch','Reserved output'],['Electrical Splitter','Connected outputs']],'Each load receives its required allocation.'),
 scene('Check industrial controls','If items are not moving, inspect conveyor state, filter, pipe direction, source stock and destination slots.',[['Conveyor','On / filter'],['Source Box','Stock'],['Destination Box','Free slots']],'The transfer path has no obvious blockage.'),
 scene('Isolate the faulty device','Disconnect the affected load safely, test with a known adequate source, then restore the original system. Reconnect essential defenses after testing.',[['Battery','Known supply'],['Wire Tool','Isolated test'],['Device','Check response']],'Device and original circuit faults are distinguished.','sequence')])
];

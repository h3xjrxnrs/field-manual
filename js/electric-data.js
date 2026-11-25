// FIELD MANUAL / ELECTRICITY HANDBOOK — authored reference and guide data.
export const components = [
  {
    "name": "Large Solar Panel",
    "category": "Power",
    "power": "0–20 output",
    "inputs": "Sunlight",
    "outputs": "Electric Output",
    "use": "Charge a battery during daylight. Rotate for sunlight and use a Root Combiner for multiple panels.",
    "note": "Output changes with sun angle and obstructions. Never budget peak production all day.",
    "short": "electric.solarpanel.large"
  },
  {
    "name": "Wind Turbine",
    "category": "Power",
    "power": "Variable output",
    "inputs": "Wind",
    "outputs": "Electric Output",
    "use": "Mount high in a clear area and route generation to a battery.",
    "note": "Generation varies with height and wind. Observe actual output.",
    "short": "generator.wind.scrap"
  },
  {
    "name": "Small Generator",
    "category": "Power",
    "power": "40 output",
    "inputs": "Low Grade Fuel",
    "outputs": "Electric Output",
    "use": "Provide dispatchable backup power. Fill fuel and switch on.",
    "note": "Fuel runs out; do not rely on it unattended without a reserve.",
    "short": "electric.fuelgenerator.small"
  },
  {
    "name": "Small Rechargeable Battery",
    "category": "Power",
    "power": "15 max output",
    "inputs": "Power In",
    "outputs": "Power Out",
    "use": "Buffer a starter circuit or one turret.",
    "note": "Capacity and output are different; check charge and active usage.",
    "short": "electric.battery.rechargable.small"
  },
  {
    "name": "Medium Rechargeable Battery",
    "category": "Power",
    "power": "50 max output",
    "inputs": "Power In",
    "outputs": "Power Out",
    "use": "Supply a mid-sized production or defense circuit.",
    "note": "Do not exceed the output rating, even when fully charged.",
    "short": "electric.battery.rechargable.medium"
  },
  {
    "name": "Large Rechargeable Battery",
    "category": "Power",
    "power": "100 max output",
    "inputs": "Power In",
    "outputs": "Power Out",
    "use": "Supply several independent circuits with branches.",
    "note": "Charging is lossy; leave headroom and avoid circular charging.",
    "short": "electric.battery.rechargable.large"
  },
  {
    "name": "Root Combiner",
    "category": "Power",
    "power": "0",
    "inputs": "Root Power 1 / 2",
    "outputs": "Combined Power Out",
    "use": "Merge compatible power sources before a battery.",
    "note": "Not a general-purpose OR gate; ordinary logic outputs may not be compatible.",
    "short": "electrical.combiner"
  },
  {
    "name": "Wire Tool",
    "category": "Tools",
    "power": "None",
    "inputs": "Electrical output",
    "outputs": "Electrical input",
    "use": "Select the source port, route the wire and attach to destination.",
    "note": "Use different wire colors for power and signals; verify direction.",
    "short": "wiretool"
  },
  {
    "name": "Pipe Tool",
    "category": "Tools",
    "power": "None",
    "inputs": "Industrial output",
    "outputs": "Industrial input",
    "use": "Connect item-moving components.",
    "note": "Pipes are directional and cannot pass through building blocks.",
    "short": "pipetool"
  },
  {
    "name": "Hose Tool",
    "category": "Tools",
    "power": "None",
    "inputs": "Fluid output",
    "outputs": "Fluid input",
    "use": "Connect water devices and sprinklers.",
    "note": "Water is not an electrical wire; uphill flow may require pumping.",
    "short": "hosetool"
  },
  {
    "name": "Electrical Branch",
    "category": "Logic",
    "power": "0",
    "inputs": "Power In",
    "outputs": "Branch Out / Power Out",
    "use": "Reserve a configured amount for one load; pass the remainder downstream.",
    "note": "Set enough for the device and any signal outputs used.",
    "short": "electrical.branch"
  },
  {
    "name": "Splitter",
    "category": "Logic",
    "power": "0",
    "inputs": "Power In",
    "outputs": "Power Out 1 / 2 / 3",
    "use": "Share power among connected outputs.",
    "note": "Adding an output changes the amount available to the others.",
    "short": "electric.splitter"
  },
  {
    "name": "Switch",
    "category": "Logic",
    "power": "0",
    "inputs": "Power In",
    "outputs": "Power Out",
    "use": "Turn an entire circuit or group on and off manually.",
    "note": "Do not put essential defense on a convenient switch that can be turned off accidentally.",
    "short": "electric.switch"
  },
  {
    "name": "Smart Switch",
    "category": "Logic",
    "power": "0 (logic)",
    "inputs": "Power In / Switch On / Switch Off",
    "outputs": "Power Out",
    "use": "Use a manual switch or optionally pair with official Rust+ for remote control.",
    "note": "Test local operation first; remote control requires pairing and connectivity.",
    "short": "electric.smartswitch"
  },
  {
    "name": "AND Switch",
    "category": "Logic",
    "power": "0",
    "inputs": "Input A / B",
    "outputs": "Power Out",
    "use": "Pass power when both inputs are powered; use as an interlock.",
    "note": "A weak input may be enough as a condition but the output must still supply the load.",
    "short": "electric.andswitch"
  },
  {
    "name": "OR Switch",
    "category": "Logic",
    "power": "0",
    "inputs": "Input A / B",
    "outputs": "Power Out",
    "use": "Select an active input for either-condition logic.",
    "note": "Does not sum two power sources.",
    "short": "electric.orswitch"
  },
  {
    "name": "XOR Switch",
    "category": "Logic",
    "power": "0",
    "inputs": "Input A / B",
    "outputs": "Power Out",
    "use": "Pass power when exactly one input is active.",
    "note": "Both inputs powered means no output.",
    "short": "electric.xorswitch"
  },
  {
    "name": "Blocker",
    "category": "Logic",
    "power": "0",
    "inputs": "Power In / Block Passthrough",
    "outputs": "Power Out",
    "use": "Pass main power until a blocking signal is present.",
    "note": "Loss of the control signal can turn the output on; plan fail-safe behavior.",
    "short": "electric.blocker"
  },
  {
    "name": "Memory Cell",
    "category": "Logic",
    "power": "0 (logic)",
    "inputs": "Power In / Set / Reset / Toggle",
    "outputs": "Output / Inverted Output",
    "use": "Latch a state for alarms or two-mode systems.",
    "note": "Control pulses do not replace the main power input.",
    "short": "electrical.memorycell"
  },
  {
    "name": "Timer",
    "category": "Logic",
    "power": "0 (logic)",
    "inputs": "Power In / Toggle On",
    "outputs": "Power Out",
    "use": "Keep a device on for a configured interval.",
    "note": "Provide main power before triggering; test repeated pulses.",
    "short": "electric.timer"
  },
  {
    "name": "RAND Switch",
    "category": "Logic",
    "power": "0 (logic)",
    "inputs": "Power In / Set / Reset",
    "outputs": "Power Out",
    "use": "Create randomized logic for games and noncritical effects.",
    "note": "Do not use randomness for a circuit that must reliably stay on.",
    "short": "electric.random.switch"
  },
  {
    "name": "Button",
    "category": "Logic",
    "power": "Pulse",
    "inputs": "Power In (optional)",
    "outputs": "Power Out",
    "use": "Create a short control pulse for a timer or memory cell.",
    "note": "Do not use as a sustained source for a heavy load.",
    "short": "electric.button"
  },
  {
    "name": "Counter",
    "category": "Logic",
    "power": "0 (logic)",
    "inputs": "Power In / Increment / Decrement / Clear",
    "outputs": "Power Out (mode dependent)",
    "use": "Display a value or count events and use its target mode.",
    "note": "Configure the mode and test reset before depending on it.",
    "short": "electric.counter"
  },
  {
    "name": "Digital Clock",
    "category": "Logic",
    "power": "Check live ports",
    "inputs": "Power / clock controls",
    "outputs": "Alarm signals (mode dependent)",
    "use": "Use scheduled in-game signals for time-based circuits.",
    "note": "Check whether clock mode matches the schedule you expect.",
    "short": "digitalclock"
  },
  {
    "name": "Pressure Pad",
    "category": "Sensors",
    "power": "Signal",
    "inputs": "Power In (optional)",
    "outputs": "Power Out",
    "use": "Trigger a circuit when stepped on.",
    "note": "Placement and who can step on it matter; test before using as an alarm.",
    "short": "electric.pressurepad"
  },
  {
    "name": "Laser Detector",
    "category": "Sensors",
    "power": "Signal",
    "inputs": "Power In",
    "outputs": "Power Out",
    "use": "Detect a crossing and trigger a signal.",
    "note": "Keep beam path unobstructed; it is not an area sensor.",
    "short": "electric.laserdetector"
  },
  {
    "name": "HBHF Sensor",
    "category": "Sensors",
    "power": "1",
    "inputs": "Power In",
    "outputs": "Power Out",
    "use": "Detect nearby players with authorization settings.",
    "note": "Output depends on detection; use a separately powered control circuit if more power is needed.",
    "short": "electric.hbhfsensor"
  },
  {
    "name": "RF Broadcaster",
    "category": "Sensors",
    "power": "Check live draw",
    "inputs": "Power In",
    "outputs": "Radio signal",
    "use": "Transmit a chosen radio frequency while powered.",
    "note": "Radio is not private; use a test frequency for local builds.",
    "short": "electric.rf.broadcaster"
  },
  {
    "name": "RF Receiver",
    "category": "Sensors",
    "power": "Check live draw",
    "inputs": "Power In / radio signal",
    "outputs": "Power Out",
    "use": "Pass a signal when receiving the selected frequency.",
    "note": "Matching frequency is required; another transmitter can affect it.",
    "short": "electric.rf.receiver"
  },
  {
    "name": "RF Transmitter",
    "category": "Sensors",
    "power": "Handheld",
    "inputs": "Player action",
    "outputs": "Radio signal",
    "use": "Manually transmit on a configured frequency.",
    "note": "Check receiver frequency and range; never treat it as private authentication.",
    "short": "rf.detonator"
  },
  {
    "name": "RF Pager",
    "category": "Sensors",
    "power": "Handheld",
    "inputs": "Radio signal",
    "outputs": "Sound / vibration",
    "use": "Notify the carrying player when a matching signal arrives.",
    "note": "Set frequency and confirm the pager is enabled.",
    "short": "rf_pager"
  },
  {
    "name": "Smart Alarm",
    "category": "Sensors",
    "power": "Check live draw",
    "inputs": "Power In",
    "outputs": "Rust+ notification",
    "use": "Send an official Rust+ notification when activated.",
    "note": "Pair in the app and verify delivery; do not treat it as a continuous siren.",
    "short": "electric.smartalarm"
  },
  {
    "name": "CCTV Camera",
    "category": "Sensors",
    "power": "3",
    "inputs": "Power In (deployable)",
    "outputs": "Video feed",
    "use": "Watch a configured camera with a Computer Station.",
    "note": "Assign a unique camera identifier and keep the feed powered.",
    "short": "cctv.camera"
  },
  {
    "name": "Computer Station",
    "category": "Sensors",
    "power": "No wired supply normally",
    "inputs": "Camera identifier",
    "outputs": "Screen",
    "use": "View available camera feeds from inside the game.",
    "note": "A camera identifier does not guarantee access or power.",
    "short": "computerstation"
  },
  {
    "name": "PTZ CCTV Camera",
    "category": "Sensors",
    "power": "Check variant",
    "inputs": "Power In",
    "outputs": "Video feed",
    "use": "View a steerable camera where the variant is available.",
    "note": "Availability and controls depend on the camera variant.",
    "short": "cctv.camera.ptz"
  },
  {
    "name": "Auto Turret",
    "category": "Defense",
    "power": "10",
    "inputs": "Power In",
    "outputs": "Has Target / Low Ammo / No Ammo",
    "use": "Protect a base with a weapon, ammunition and authorized users.",
    "note": "Turn off before setup; check interference and signal power if using outputs.",
    "short": "autoturret"
  },
  {
    "name": "SAM Site",
    "category": "Defense",
    "power": "25",
    "inputs": "Power In / mode control",
    "outputs": "Detection signals",
    "use": "Defend airspace; configure targeting mode before use.",
    "note": "Supply SAM ammo and verify friendly aircraft behavior.",
    "short": "samsite"
  },
  {
    "name": "Tesla Coil",
    "category": "Defense",
    "power": "Up to 25",
    "inputs": "Power In",
    "outputs": "—",
    "use": "Create a powered in-game electrical hazard.",
    "note": "Use controlled access and power only as needed; avoid accidental friendly damage.",
    "short": "electric.teslacoil"
  },
  {
    "name": "Door Controller",
    "category": "Defense",
    "power": "1 when operating",
    "inputs": "Power In / Open / Close",
    "outputs": "Passthrough",
    "use": "Pair with a nearby door and control its state using signals.",
    "note": "Test with a safe exit; the lock and pairing state matter.",
    "short": "electric.doorcontroller"
  },
  {
    "name": "Audio Alarm",
    "category": "Utilities",
    "power": "Check live draw",
    "inputs": "Power In",
    "outputs": "Sound",
    "use": "Announce a local event audibly.",
    "note": "A sound is not a Rust+ notification; use a Smart Alarm for that.",
    "short": "electric.audioalarm"
  },
  {
    "name": "Flasher Light",
    "category": "Utilities",
    "power": "Check live draw",
    "inputs": "Power In",
    "outputs": "Light",
    "use": "Signal an alarm or machine state visually.",
    "note": "Use a separate powered load when a sensor output is too weak.",
    "short": "electric.flasherlight"
  },
  {
    "name": "Siren Light",
    "category": "Utilities",
    "power": "Check live draw",
    "inputs": "Power In",
    "outputs": "Light / sound",
    "use": "Create a visible warning in a base.",
    "note": "Test output and location before relying on it.",
    "short": "electric.sirenlight"
  },
  {
    "name": "Ceiling Light",
    "category": "Utilities",
    "power": "2",
    "inputs": "Power In",
    "outputs": "Passthrough",
    "use": "Light rooms or crops; daisy-chain only with adequate supply.",
    "note": "Verify remaining power and actual plant light condition.",
    "short": "ceilinglight"
  },
  {
    "name": "Industrial Wall Light",
    "category": "Utilities",
    "power": "Check variant",
    "inputs": "Power In",
    "outputs": "Passthrough (if available)",
    "use": "Provide local illumination with colored variants.",
    "note": "Some variants have different ports or are cosmetic; inspect item.",
    "short": "industrial.wall.light"
  },
  {
    "name": "Search Light",
    "category": "Utilities",
    "power": "10",
    "inputs": "Power In",
    "outputs": "Light",
    "use": "Illuminate a large area manually.",
    "note": "Reserve enough power; not a plant-condition guarantee.",
    "short": "searchlight"
  },
  {
    "name": "Electric Heater",
    "category": "Utilities",
    "power": "3",
    "inputs": "Power In",
    "outputs": "Heat",
    "use": "Warm crops and cold rooms.",
    "note": "Check temperature in game rather than assuming every nearby plant is covered.",
    "short": "electric.heater"
  },
  {
    "name": "Fridge",
    "category": "Utilities",
    "power": "5",
    "inputs": "Power In / item ports via adaptor",
    "outputs": "Storage",
    "use": "Keep food in a powered refrigerator and integrate sorting.",
    "note": "Power requirements have changed across patches; verify cooling in game.",
    "short": "fridge"
  },
  {
    "name": "Elevator",
    "category": "Utilities",
    "power": "Check live draw",
    "inputs": "Power In / floor controls",
    "outputs": "Movement",
    "use": "Move between stacked floors.",
    "note": "Leave an independent way out and test all floor calls.",
    "short": "elevator"
  },
  {
    "name": "Modular Car Lift",
    "category": "Utilities",
    "power": "Check live draw",
    "inputs": "Power In",
    "outputs": "Vehicle service",
    "use": "Repair or modify a modular car at its lift.",
    "note": "Keep the vehicle positioned correctly and verify the lift is powered.",
    "short": "modularcarlift"
  },
  {
    "name": "Igniter",
    "category": "Utilities",
    "power": "2",
    "inputs": "Power In",
    "outputs": "Ignition",
    "use": "Ignite compatible nearby deployables on demand.",
    "note": "Use a short controlled pulse when appropriate; confirm proximity.",
    "short": "electric.igniter"
  },
  {
    "name": "Reactive Target",
    "category": "Utilities",
    "power": "Check live draw",
    "inputs": "Power In / reset control",
    "outputs": "Hit signal",
    "use": "Build an in-game target practice circuit.",
    "note": "Test resetting and count output before adding a counter.",
    "short": "target.reactive"
  },
  {
    "name": "Electric Furnace",
    "category": "Industrial",
    "power": "3",
    "inputs": "Power In / adaptor item input",
    "outputs": "Adaptor item output",
    "use": "Smelt ore on electricity without wood.",
    "note": "No charcoal produced; separate input and output filters.",
    "short": "electric.furnace"
  },
  {
    "name": "Storage Adaptor",
    "category": "Industrial",
    "power": "0",
    "inputs": "Industrial In",
    "outputs": "Industrial Out",
    "use": "Add pipe access to compatible storage, furnaces or lockers.",
    "note": "A locker uses a separate adaptor for each compartment.",
    "short": "storageadaptor"
  },
  {
    "name": "Industrial Conveyor",
    "category": "Industrial",
    "power": "1 base",
    "inputs": "Power In / Industrial In / on-off signals",
    "outputs": "Industrial Out / Filter Pass / Filter Fail",
    "use": "Move items between inventories with filters and quantity controls.",
    "note": "Allow extra signal power when using status ports; keep destination space free.",
    "short": "industrial.conveyor"
  },
  {
    "name": "Industrial Splitter",
    "category": "Industrial",
    "power": "0",
    "inputs": "Industrial In",
    "outputs": "Industrial Out 1 / 2 / 3",
    "use": "Fan out a pipe network toward several destinations.",
    "note": "It does not filter items or move them without a conveyor.",
    "short": "industrial.splitter"
  },
  {
    "name": "Industrial Combiner",
    "category": "Industrial",
    "power": "0",
    "inputs": "Industrial In 1 / 2 / 3",
    "outputs": "Industrial Out",
    "use": "Merge separate source paths.",
    "note": "Verify pipe direction; a combiner does not generate movement.",
    "short": "industrial.combiner"
  },
  {
    "name": "Industrial Crafter",
    "category": "Industrial",
    "power": "1 base",
    "inputs": "Power In / Industrial In / Blueprint In",
    "outputs": "Industrial Out / Blueprint Out",
    "use": "Craft a supplied blueprint on a suitable workbench.",
    "note": "Provide blueprint, materials, correct bench tier and output space.",
    "short": "industrial.crafter"
  },
  {
    "name": "Hopper",
    "category": "Industrial",
    "power": "Check live item",
    "inputs": "Item collection",
    "outputs": "Industrial path (via supported connection)",
    "use": "Collect items where supported by the deployed model.",
    "note": "Confirm exact storage/adaptor behavior in the current build.",
    "short": "hopper"
  },
  {
    "name": "Water Pump",
    "category": "Water",
    "power": "5",
    "inputs": "Power In / water source",
    "outputs": "Fluid Output",
    "use": "Extract water from a suitable body of water.",
    "note": "Salt water requires treatment for farming; route with Hose Tool.",
    "short": "waterpump"
  },
  {
    "name": "Powered Water Purifier",
    "category": "Water",
    "power": "Check live draw",
    "inputs": "Power In / Water In",
    "outputs": "Water Out",
    "use": "Convert salt water to fresh water.",
    "note": "Compare actual input and output rate with sprinkler demand.",
    "short": "poweredwaterpurifier"
  },
  {
    "name": "Fluid Switch & Pump",
    "category": "Water",
    "power": "Control power",
    "inputs": "Fluid In / electrical controls",
    "outputs": "Fluid Out",
    "use": "Control water delivery and pump against gravity.",
    "note": "Check direction and power when lifting water.",
    "short": "fluid.switch"
  },
  {
    "name": "Fluid Splitter",
    "category": "Water",
    "power": "0",
    "inputs": "Fluid In",
    "outputs": "Fluid Out 1 / 2 / 3",
    "use": "Split water among branches.",
    "note": "Sharing does not increase total flow.",
    "short": "fluid.splitter"
  },
  {
    "name": "Fluid Combiner",
    "category": "Water",
    "power": "0",
    "inputs": "Fluid In 1 / 2 / 3",
    "outputs": "Fluid Out",
    "use": "Merge water sources.",
    "note": "Do not mix salt and fresh water unintentionally.",
    "short": "fluid.combiner"
  },
  {
    "name": "Sprinkler",
    "category": "Water",
    "power": "Water only",
    "inputs": "Fluid In",
    "outputs": "Fluid passthrough (where available)",
    "use": "Water planters using a hose, not an electric wire.",
    "note": "Measure coverage and soil water in game.",
    "short": "sprinkler"
  },
  {
    "name": "Water Barrel",
    "category": "Water",
    "power": "0",
    "inputs": "Fluid In",
    "outputs": "Fluid Out",
    "use": "Store a buffer of water.",
    "note": "Gravity and remaining water affect delivery.",
    "short": "water.barrel"
  },
  {
    "name": "Water Catcher (small / large)",
    "category": "Water",
    "power": "0",
    "inputs": "Rain collection",
    "outputs": "Fluid Out",
    "use": "Gather water without electrical generation.",
    "note": "Rain is variable; use a buffer and confirm output.",
    "short": "water.catcher.small"
  },
  {
    "name": "Telephone",
    "category": "Utilities",
    "power": "Check variant",
    "inputs": "Player interaction",
    "outputs": "Call",
    "use": "Make in-game calls using the telephone system.",
    "note": "Not a substitute for a powered alarm or voice chat.",
    "short": "telephone"
  },
  {
    "name": "Boom Box / Portable Boom Box",
    "category": "Utilities",
    "power": "Check variant",
    "inputs": "Power / player controls",
    "outputs": "Audio",
    "use": "Play supported in-game audio.",
    "note": "Availability can depend on DLC; portable and placed versions differ.",
    "short": "boombox"
  },
  {
    "name": "Neon Signs (small / medium / large / animated)",
    "category": "Utilities",
    "power": "Check variant",
    "inputs": "Power In",
    "outputs": "Light",
    "use": "Create powered signs and status indicators.",
    "note": "DLC and animated variants differ; use actual item power.",
    "short": "sign.neon.125x125"
  },
  {
    "name": "Decorative Lights (string / fluorescent / chandelier)",
    "category": "Utilities",
    "power": "Check variant",
    "inputs": "Power In when wired",
    "outputs": "Light",
    "use": "Decorate or illuminate rooms.",
    "note": "Some lights are seasonal or use different power systems; inspect the variant.",
    "short": ""
  }
];
export const guides = [
  {
    "id": "starter",
    "title": "Your first power circuit",
    "category": "Power",
    "level": "Starter",
    "summary": "A solar panel, rechargeable battery and light — the foundation of every base circuit.",
    "parts": [
      "1 Solar Panel",
      "1 Small Battery",
      "1 Switch",
      "1 Ceiling Light",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Solar Panel · Electric Output",
        "dst": "Battery · Power In"
      },
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Switch · Power In"
      },
      {
        "type": "Power",
        "src": "Switch · Power Out",
        "dst": "Ceiling Light · Power In"
      }
    ],
    "steps": [
      "Place the solar panel in an unobstructed location.",
      "Wire the panel into the battery and allow it to charge.",
      "Wire battery output to the switch, then the light.",
      "Turn the switch on and check that the light stays on when generation falls."
    ],
    "check": [
      "Check solar output during daylight.",
      "Check battery charge and Active Usage.",
      "Check wire direction."
    ],
    "notes": "A battery can charge while supplying a circuit. Peak solar output is not constant.",
    "power": "2 rW load"
  },
  {
    "id": "solar",
    "title": "Two solar panels & battery charging",
    "category": "Power",
    "level": "Starter",
    "summary": "Combine generation before charging a battery.",
    "parts": [
      "2 Solar Panels",
      "1 Root Combiner",
      "1 Medium Battery",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Panel A · Electric Output",
        "dst": "Root Combiner · Root Power 1"
      },
      {
        "type": "Power",
        "src": "Panel B · Electric Output",
        "dst": "Root Combiner · Root Power 2"
      },
      {
        "type": "Power",
        "src": "Root Combiner · Combined Power Out",
        "dst": "Battery · Power In"
      }
    ],
    "steps": [
      "Place both panels with clear exposure.",
      "Connect each panel to a different root input.",
      "Send combined output to the battery input.",
      "Observe generation across a full daylight cycle."
    ],
    "check": [
      "Check both inputs individually.",
      "Check combined output and charge level."
    ],
    "notes": "Adding panels increases potential charging power, not battery max output.",
    "power": "Up to 40 rW generation"
  },
  {
    "id": "distribution",
    "title": "Distribute power with branches",
    "category": "Power",
    "level": "Starter",
    "summary": "Reserve fixed power for two circuits without losing the rest.",
    "parts": [
      "1 Charged Medium Battery",
      "2 Electrical Branches",
      "1 Electric Furnace",
      "1 Auto Turret",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Branch A · Power In"
      },
      {
        "type": "Power",
        "src": "Branch A · Branch Out (10)",
        "dst": "Turret · Power In"
      },
      {
        "type": "Power",
        "src": "Branch A · Power Out",
        "dst": "Branch B · Power In"
      },
      {
        "type": "Power",
        "src": "Branch B · Branch Out (3)",
        "dst": "Furnace · Power In"
      }
    ],
    "steps": [
      "Set branch A to 10.",
      "Set branch B to 3.",
      "Connect the output labeled Power Out of A to B.",
      "Connect loads and inspect actual power."
    ],
    "check": [
      "Do not confuse Branch Out with Power Out.",
      "Check battery output rating.",
      "Check turret authorization before turning on."
    ],
    "notes": "Additional turret signal circuits may need power headroom.",
    "power": "13 rW base load"
  },
  {
    "id": "one-furnace",
    "title": "Single electric furnace",
    "category": "Industrial",
    "level": "Starter",
    "summary": "Smelt ore without wood, using a basic electrical circuit.",
    "parts": [
      "1 Charged Battery",
      "1 Electrical Branch",
      "1 Electric Furnace",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Branch · Power In"
      },
      {
        "type": "Power",
        "src": "Branch · Branch Out (3)",
        "dst": "Furnace · Power In"
      }
    ],
    "steps": [
      "Place the furnace.",
      "Set the branch to 3 and wire the furnace.",
      "Insert ore and turn the furnace on.",
      "Collect finished metal or sulfur."
    ],
    "check": [
      "Check at least 3 rW at the furnace.",
      "Check ore and empty output slots."
    ],
    "notes": "No charcoal is generated. Provide a separate wood-burning system if charcoal is needed.",
    "power": "3 rW"
  },
  {
    "id": "furnace-bank",
    "title": "Three automatic electric furnaces",
    "category": "Industrial",
    "level": "Intermediate",
    "summary": "Drop ore in one box and collect finished materials in another.",
    "parts": [
      "3 Electric Furnaces",
      "2 Boxes",
      "5 Storage Adaptors",
      "2 Industrial Conveyors",
      "1 Industrial Splitter",
      "1 Industrial Combiner",
      "2 Electrical Branches",
      "1 Electrical Splitter",
      "Charged Battery",
      "Wire & Pipe Tools"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Branch A · Power In"
      },
      {
        "type": "Power",
        "src": "Branch A · Branch Out (9)",
        "dst": "Electrical Splitter · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Output 1",
        "dst": "Furnace 1 · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Output 2",
        "dst": "Furnace 2 · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Output 3",
        "dst": "Furnace 3 · Power In"
      },
      {
        "type": "Power",
        "src": "Branch A · Power Out",
        "dst": "Branch B · Power In"
      },
      {
        "type": "Power",
        "src": "Branch B · Branch Out (1)",
        "dst": "Ore Conveyor · Power In"
      },
      {
        "type": "Power",
        "src": "Branch B · Power Out",
        "dst": "Output Conveyor · Power In"
      },
      {
        "type": "Pipe",
        "src": "Ore Box adaptor · Industrial Out",
        "dst": "Ore Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Ore Conveyor · Industrial Out",
        "dst": "Industrial Splitter · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Industrial Splitter · Out 1",
        "dst": "Furnace 1 adaptor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Industrial Splitter · Out 2",
        "dst": "Furnace 2 adaptor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Industrial Splitter · Out 3",
        "dst": "Furnace 3 adaptor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Furnace 1 adaptor · Industrial Out",
        "dst": "Industrial Combiner · In 1"
      },
      {
        "type": "Pipe",
        "src": "Furnace 2 adaptor · Industrial Out",
        "dst": "Industrial Combiner · In 2"
      },
      {
        "type": "Pipe",
        "src": "Furnace 3 adaptor · Industrial Out",
        "dst": "Industrial Combiner · In 3"
      },
      {
        "type": "Pipe",
        "src": "Industrial Combiner · Industrial Out",
        "dst": "Output Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Output Conveyor · Industrial Out",
        "dst": "Finished Box adaptor · Industrial In"
      }
    ],
    "steps": [
      "Attach one adaptor to each box and furnace.",
      "Build the ore and output pipe paths separately.",
      "Set the ore conveyor to Metal Ore, Sulfur Ore and High Quality Metal Ore.",
      "Set output filters to Metal Fragments, Sulfur and High Quality Metal.",
      "Supply power as shown and switch on both conveyors and all furnaces.",
      "Test with a small ore stack before filling the input box."
    ],
    "check": [
      "Each furnace must receive 3 rW.",
      "Both conveyors need power and must be switched on.",
      "Input filters must contain ore, output filters finished products.",
      "Check free destination slots and pipe direction."
    ],
    "notes": "The last branch passes remaining power to the output conveyor; it needs at least 1 rW. This layout assumes no status-output loads.",
    "power": "11 rW base load"
  },
  {
    "id": "sorting",
    "title": "Automatic loot sorting",
    "category": "Industrial",
    "level": "Intermediate",
    "summary": "A single dump box feeds resource, component and gear storage.",
    "parts": [
      "4 Boxes",
      "4 Storage Adaptors",
      "3 Industrial Conveyors",
      "1 Industrial Splitter",
      "1 Electrical Splitter",
      "Charged Battery",
      "Wire & Pipe Tools"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Electrical Splitter · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Out 1",
        "dst": "Resource Conveyor · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Out 2",
        "dst": "Component Conveyor · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Out 3",
        "dst": "Gear Conveyor · Power In"
      },
      {
        "type": "Pipe",
        "src": "Dump Box adaptor · Industrial Out",
        "dst": "Industrial Splitter · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Industrial Splitter · Out 1",
        "dst": "Resource Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Industrial Splitter · Out 2",
        "dst": "Component Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Industrial Splitter · Out 3",
        "dst": "Gear Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Resource Conveyor · Industrial Out",
        "dst": "Resource Box adaptor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Component Conveyor · Industrial Out",
        "dst": "Component Box adaptor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Gear Conveyor · Industrial Out",
        "dst": "Gear Box adaptor · Industrial In"
      }
    ],
    "steps": [
      "Install adaptors on all four boxes.",
      "Split the dump box pipe into three independent conveyor paths.",
      "Configure the resource conveyor for resources or explicit item names.",
      "Configure the component conveyor for components; set gear to the desired weapons/clothing items or categories.",
      "Avoid overlapping filters. Select any-match behavior for alternatives if the UI offers it.",
      "Power the conveyors, turn them on and test one item from each group."
    ],
    "check": [
      "Make sure every desired item matches exactly one intended route.",
      "Unmatched items remain in the dump box.",
      "A full destination stops that path; keep room for overflow."
    ],
    "notes": "Add more paths with extra splitters and conveyors. Filters decide destinations, not the splitter.",
    "power": "3 rW base load"
  },
  {
    "id": "crafting",
    "title": "Automatic crafting station",
    "category": "Industrial",
    "level": "Intermediate",
    "summary": "Feed a blueprint-based crafter and store the output.",
    "parts": [
      "1 Compatible Workbench",
      "1 Industrial Crafter",
      "2 Boxes",
      "2 Storage Adaptors",
      "2 Conveyors",
      "1 Electrical Splitter",
      "Charged Battery",
      "Wire & Pipe Tools"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Electrical Splitter · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Out 1",
        "dst": "Input Conveyor · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Out 2",
        "dst": "Crafter · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Out 3",
        "dst": "Output Conveyor · Power In"
      },
      {
        "type": "Pipe",
        "src": "Material Box adaptor · Industrial Out",
        "dst": "Input Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Input Conveyor · Industrial Out",
        "dst": "Crafter · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Crafter · Industrial Out",
        "dst": "Output Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Output Conveyor · Industrial Out",
        "dst": "Product Box adaptor · Industrial In"
      }
    ],
    "steps": [
      "Attach the crafter to a workbench of the required tier.",
      "Insert the desired blueprint manually.",
      "Filter input to ingredients for that recipe.",
      "Filter output to the crafted item.",
      "Turn on conveyors and crafter; test a small batch."
    ],
    "check": [
      "Check blueprint and workbench tier.",
      "Check every ingredient and destination space.",
      "Do not feed unrelated materials into the crafter."
    ],
    "notes": "Use conveyor maximum targets to prevent overfilling or wasting ingredients.",
    "power": "3 rW base load"
  },
  {
    "id": "upkeep",
    "title": "Automatic TC restock",
    "category": "Industrial",
    "level": "Intermediate",
    "summary": "Transfer selected upkeep materials from a supply box to the Tool Cupboard.",
    "parts": [
      "1 Supply Box",
      "2 Storage Adaptors",
      "1 Conveyor",
      "Charged Battery",
      "Wire & Pipe Tools"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Conveyor · Power In"
      },
      {
        "type": "Pipe",
        "src": "Supply Box adaptor · Industrial Out",
        "dst": "Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Conveyor · Industrial Out",
        "dst": "TC adaptor · Industrial In"
      }
    ],
    "steps": [
      "Attach an adaptor to the supply box and TC.",
      "Configure only actual upkeep materials used by your base.",
      "Set a maximum stock target per material if desired.",
      "Power the conveyor, turn it on and verify the TC inventory."
    ],
    "check": [
      "Never reverse the TC path into a loot dump.",
      "Keep enough stock in the supply box.",
      "Check upkeep after testing."
    ],
    "notes": "This transfers resources, not guaranteed upkeep; the TC must still contain the required amounts.",
    "power": "1 rW base load"
  },
  {
    "id": "lockers",
    "title": "Auto refill a locker",
    "category": "Industrial",
    "level": "Intermediate",
    "summary": "Store gear in selected locker compartments.",
    "parts": [
      "1 Supply Box",
      "1 Locker",
      "4 Storage Adaptors",
      "3 Conveyors",
      "1 Industrial Splitter",
      "1 Electrical Splitter",
      "Charged Battery",
      "Wire & Pipe Tools"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Electrical Splitter · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Out 1",
        "dst": "Conveyor A · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Out 2",
        "dst": "Conveyor B · Power In"
      },
      {
        "type": "Power",
        "src": "Electrical Splitter · Out 3",
        "dst": "Conveyor C · Power In"
      },
      {
        "type": "Pipe",
        "src": "Supply adaptor · Industrial Out",
        "dst": "Industrial Splitter · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Industrial Splitter · Out 1",
        "dst": "Conveyor A · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Industrial Splitter · Out 2",
        "dst": "Conveyor B · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Industrial Splitter · Out 3",
        "dst": "Conveyor C · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Conveyor A · Industrial Out",
        "dst": "Locker adaptor A · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Conveyor B · Industrial Out",
        "dst": "Locker adaptor B · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Conveyor C · Industrial Out",
        "dst": "Locker adaptor C · Industrial In"
      }
    ],
    "steps": [
      "Install an adaptor on each locker compartment.",
      "Give each conveyor a gear filter and sensible max quantities.",
      "Power the system and test one compartment at a time.",
      "Verify gear goes into compatible slots."
    ],
    "check": [
      "Each locker compartment requires its own adaptor.",
      "Check for conflicting filters and full slots."
    ],
    "notes": "This refills storage; it does not automatically equip players.",
    "power": "3 rW base load"
  },
  {
    "id": "shop",
    "title": "Vending machine restock",
    "category": "Industrial",
    "level": "Intermediate",
    "summary": "Send sale stock from a protected supply box to a vending machine.",
    "parts": [
      "1 Supply Box",
      "1 Vending Machine",
      "2 Storage Adaptors",
      "1 Conveyor",
      "Charged Battery",
      "Wire & Pipe Tools"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Conveyor · Power In"
      },
      {
        "type": "Pipe",
        "src": "Supply Box adaptor · Industrial Out",
        "dst": "Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Conveyor · Industrial Out",
        "dst": "Vending adaptor · Industrial In"
      }
    ],
    "steps": [
      "Configure the vending machine trade in game.",
      "Filter the conveyor to sale stock only.",
      "Set a maximum target amount.",
      "Turn on and verify that stock arrives."
    ],
    "check": [
      "Check sale configuration separately.",
      "Do not mix sale stock and payment collection filters."
    ],
    "notes": "An optional payment extraction line must use an explicit payment-only filter; avoid extracting your own sale stock.",
    "power": "1 rW base load"
  },
  {
    "id": "turret",
    "title": "Install one auto turret",
    "category": "Defense",
    "level": "Starter",
    "summary": "A reliable turret circuit with a safe setup order.",
    "parts": [
      "1 Charged Battery (15+ output)",
      "1 Switch",
      "1 Auto Turret",
      "Compatible in-game weapon",
      "Matching ammo",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Switch · Power In"
      },
      {
        "type": "Power",
        "src": "Switch · Power Out",
        "dst": "Turret · Power In"
      }
    ],
    "steps": [
      "Place the turret facing the intended area and leave power off.",
      "Authorize yourself and teammates via the turret interface.",
      "Insert a compatible weapon and matching ammunition.",
      "Connect power through the switch and activate from a safe position."
    ],
    "check": [
      "Confirm 10 rW at Power In.",
      "Check authorization and ammo.",
      "Check obstruction and interference."
    ],
    "notes": "Vanilla interference limits nearby active turrets; server settings can differ. See Facepunch Solid Foundations.",
    "power": "10 rW base load"
  },
  {
    "id": "turret-bank",
    "title": "Three turrets on one circuit",
    "category": "Defense",
    "level": "Intermediate",
    "summary": "Use one battery and a splitter to power three independent turrets.",
    "parts": [
      "1 Medium or Large Battery",
      "1 Switch",
      "1 Electrical Splitter",
      "3 Auto Turrets",
      "3 Weapons and ammo",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Switch · Power In"
      },
      {
        "type": "Power",
        "src": "Switch · Power Out",
        "dst": "Splitter · Power In"
      },
      {
        "type": "Power",
        "src": "Splitter · Out 1",
        "dst": "Turret A · Power In"
      },
      {
        "type": "Power",
        "src": "Splitter · Out 2",
        "dst": "Turret B · Power In"
      },
      {
        "type": "Power",
        "src": "Splitter · Out 3",
        "dst": "Turret C · Power In"
      }
    ],
    "steps": [
      "Prepare and authorize all three turrets while off.",
      "Wire the switch and splitter.",
      "Connect one turret per output.",
      "Activate and verify each turret receives at least 10 rW."
    ],
    "check": [
      "Check power on all three outputs.",
      "Check ammo and authorized players on each turret.",
      "Watch for interference indicator."
    ],
    "notes": "For ordinary PC vanilla, the documented baseline is 12 active turrets within 40 m; check current server behavior. Signal loads require extra planning.",
    "power": "30 rW base load"
  },
  {
    "id": "turret-alarm",
    "title": "Turret target warning",
    "category": "Defense",
    "level": "Intermediate",
    "summary": "Create a local warning using the turret’s target signal.",
    "parts": [
      "1 Battery with headroom",
      "1 Auto Turret",
      "1 Audio Alarm or indicator",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Turret · Power In"
      },
      {
        "type": "Signal",
        "src": "Turret · Has Target",
        "dst": "Alarm or indicator · Power In"
      }
    ],
    "steps": [
      "Prepare the turret normally.",
      "Supply more than its 10 rW base requirement to allow signal outputs.",
      "Wire Has Target to a suitable low-power indicator or alarm.",
      "Test detection and ensure the turret still has power."
    ],
    "check": [
      "If the signal cannot power the alarm, use it as a logic trigger for a separately powered circuit.",
      "Check the signal does not fire for authorized users."
    ],
    "notes": "Low Ammo and No Ammo can be used for separate maintenance indicators; check available signal strength.",
    "power": "10 rW + signal/load allowance"
  },
  {
    "id": "sam",
    "title": "SAM site power",
    "category": "Defense",
    "level": "Intermediate",
    "summary": "A dedicated power circuit for air defense.",
    "parts": [
      "1 Charged Medium or Large Battery",
      "1 Switch",
      "1 SAM Site",
      "SAM Ammo",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Switch · Power In"
      },
      {
        "type": "Power",
        "src": "Switch · Power Out",
        "dst": "SAM Site · Power In"
      }
    ],
    "steps": [
      "Place the SAM site.",
      "Load SAM ammo and choose the intended targeting mode.",
      "Wire the switch and supply at least 25 rW.",
      "Test operation and verify friendly aircraft policy."
    ],
    "check": [
      "Check battery output and ammo.",
      "Check mode and obstructions."
    ],
    "notes": "Keep an accessible cutoff switch and do not assume friendly aircraft are automatically safe.",
    "power": "25 rW base load"
  },
  {
    "id": "door",
    "title": "Remote door control",
    "category": "Defense",
    "level": "Starter",
    "summary": "Control a paired door with a switch.",
    "parts": [
      "1 Battery",
      "1 Switch or Smart Switch",
      "1 Door Controller",
      "1 Compatible Door",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Switch · Power In"
      },
      {
        "type": "Power",
        "src": "Switch · Power Out",
        "dst": "Door Controller · Power In"
      }
    ],
    "steps": [
      "Install the controller next to a compatible door.",
      "Pair it using the game interaction; follow the lock/unlock prompts and relock when done.",
      "Wire power via a switch.",
      "Test open and close from a safe side of the doorway."
    ],
    "check": [
      "Verify pairing and lock status.",
      "Keep another exit while testing."
    ],
    "notes": "For separate Open and Close signal inputs, consult the component ports. Rust+ remote control is optional.",
    "power": "1 rW operating load"
  },
  {
    "id": "sensor",
    "title": "Motion-triggered local alarm",
    "category": "Defense",
    "level": "Intermediate",
    "summary": "Use a sensor to trigger a separately powered alarm via logic.",
    "parts": [
      "1 Battery",
      "1 Electrical Branch",
      "1 HBHF Sensor",
      "1 AND Switch",
      "1 Audio Alarm",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Branch · Power In"
      },
      {
        "type": "Power",
        "src": "Branch · Branch Out (sensor headroom)",
        "dst": "HBHF · Power In"
      },
      {
        "type": "Power",
        "src": "Branch · Power Out",
        "dst": "AND Switch · Input A"
      },
      {
        "type": "Signal",
        "src": "HBHF · Power Out",
        "dst": "AND Switch · Input B"
      },
      {
        "type": "Power",
        "src": "AND Switch · Power Out",
        "dst": "Audio Alarm · Power In"
      }
    ],
    "steps": [
      "Configure the HBHF authorization filters.",
      "Reserve enough power to operate the sensor and its signal.",
      "Supply the other AND input with enough power for the alarm.",
      "Test with a player matching the sensor settings and adjust the branch."
    ],
    "check": [
      "Sensor signal must reach the gate.",
      "Test actual gate output with the wire tool.",
      "Check alarm power and sensor range."
    ],
    "notes": "Signal outputs are not a reliable source for heavy devices. Verify the gate behavior and actual output on the server.",
    "power": "Sensor + alarm draw + signal headroom"
  },
  {
    "id": "smart-alarm",
    "title": "Smart Alarm / Rust+ notification",
    "category": "Defense",
    "level": "Starter",
    "summary": "Send a notification using the official Rust+ app.",
    "parts": [
      "1 Battery",
      "1 Switch",
      "1 Smart Alarm",
      "Wire Tool",
      "Official Rust+ app (optional external pairing)"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Switch · Power In"
      },
      {
        "type": "Power",
        "src": "Switch · Power Out",
        "dst": "Smart Alarm · Power In"
      }
    ],
    "steps": [
      "Place and pair the Smart Alarm with the official app.",
      "Supply power through a switch for the first test.",
      "Toggle it and confirm notification delivery.",
      "Replace the switch with a suitable powered detection circuit if desired."
    ],
    "check": [
      "Check pairing and notification permissions.",
      "Check that the alarm input receives power."
    ],
    "notes": "Field Manual does not connect to Rust+, the game server or the user account.",
    "power": "Check live alarm draw"
  },
  {
    "id": "timer",
    "title": "Timed lighting",
    "category": "Utilities",
    "level": "Starter",
    "summary": "Turn a light on for a limited interval using a timer.",
    "parts": [
      "1 Battery",
      "1 Timer",
      "1 Button",
      "1 Ceiling Light",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Timer · Power In"
      },
      {
        "type": "Signal",
        "src": "Button · Power Out",
        "dst": "Timer · Toggle On"
      },
      {
        "type": "Power",
        "src": "Timer · Power Out",
        "dst": "Ceiling Light · Power In"
      }
    ],
    "steps": [
      "Set the desired timer duration.",
      "Supply main timer power.",
      "Connect the button pulse to Toggle On.",
      "Connect the light and test the button."
    ],
    "check": [
      "Main timer input must have power.",
      "Check button pulse and time setting."
    ],
    "notes": "If a particular button configuration requires a power feed, supply it through a separate branch.",
    "power": "2 rW lighting load + control allowance"
  },
  {
    "id": "water",
    "title": "Pump and sprinkler irrigation",
    "category": "Water",
    "level": "Starter",
    "summary": "Feed fresh water to sprinklers from a powered pump.",
    "parts": [
      "1 Battery",
      "1 Water Pump",
      "1 Water Barrel (optional buffer)",
      "1 Sprinkler",
      "Wire & Hose Tools"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Water Pump · Power In"
      },
      {
        "type": "Water",
        "src": "Water Pump · Fluid Out",
        "dst": "Barrel · Fluid In"
      },
      {
        "type": "Water",
        "src": "Barrel · Fluid Out",
        "dst": "Sprinkler · Fluid In"
      }
    ],
    "steps": [
      "Place the pump at a valid freshwater source.",
      "Supply at least 5 rW and turn it on.",
      "Use the hose tool to route water to the buffer and sprinkler.",
      "Check flow and plant water condition."
    ],
    "check": [
      "Confirm fresh water and pump operation.",
      "If water must travel uphill, add a suitable powered fluid pump.",
      "Adjust irrigation based on actual soil water."
    ],
    "notes": "Sprinklers need water rather than their own electrical power. A saltwater intake requires purification.",
    "power": "5 rW pump + optional lift"
  },
  {
    "id": "cold",
    "title": "Powered fridge sorting",
    "category": "Industrial",
    "level": "Starter",
    "summary": "Move food from a dump box into powered cold storage.",
    "parts": [
      "1 Box",
      "1 Fridge",
      "2 Storage Adaptors",
      "1 Conveyor",
      "1 Electrical Branch",
      "Charged Battery",
      "Wire & Pipe Tools"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "Branch · Power In"
      },
      {
        "type": "Power",
        "src": "Branch · Branch Out (5)",
        "dst": "Fridge · Power In"
      },
      {
        "type": "Power",
        "src": "Branch · Power Out",
        "dst": "Conveyor · Power In"
      },
      {
        "type": "Pipe",
        "src": "Food Box adaptor · Industrial Out",
        "dst": "Conveyor · Industrial In"
      },
      {
        "type": "Pipe",
        "src": "Conveyor · Industrial Out",
        "dst": "Fridge adaptor · Industrial In"
      }
    ],
    "steps": [
      "Power the fridge and attach adaptors.",
      "Set the conveyor to food items that belong in the fridge.",
      "Connect pipes and turn the conveyor on.",
      "Verify transfer and cooling."
    ],
    "check": [
      "Check fridge and conveyor power separately.",
      "Check compatible food filters and free slots."
    ],
    "notes": "Keep other loot filters separate.",
    "power": "6 rW base load"
  },
  {
    "id": "camera",
    "title": "CCTV & Computer Station",
    "category": "Defense",
    "level": "Starter",
    "summary": "Set up a deployable camera and view it in game.",
    "parts": [
      "1 Deployable CCTV Camera",
      "1 Computer Station",
      "Charged Battery",
      "Wire Tool"
    ],
    "wires": [
      {
        "type": "Power",
        "src": "Battery · Power Out",
        "dst": "CCTV Camera · Power In"
      }
    ],
    "steps": [
      "Place the camera with the desired viewing angle.",
      "Give it a unique identifier through its interaction menu.",
      "Connect power to the camera.",
      "Enter the identifier at the Computer Station and check the feed."
    ],
    "check": [
      "Check camera power and identifier.",
      "Confirm it is a deployable powered camera variant."
    ],
    "notes": "Only in-game camera functions are covered. No external surveillance or hidden data.",
    "power": "3 rW for standard camera"
  },
  {
    "id": "debug",
    "title": "Troubleshoot a broken circuit",
    "category": "Power",
    "level": "Starter",
    "summary": "Find the first failed link before rebuilding an entire system.",
    "parts": [
      "Wire Tool",
      "Optional charged test battery"
    ],
    "wires": [],
    "steps": [
      "Check charge and the source output.",
      "Trace each wire from the source toward the device, checking port labels and available power.",
      "Inspect branch settings and connected splitter outputs.",
      "For industrial systems, check conveyor on/off state, filters, pipe direction and free slots.",
      "Isolate one device with a known adequate supply to distinguish power faults from device setup."
    ],
    "check": [
      "Check one subsystem at a time.",
      "Compare in-game Active Usage with expected loads.",
      "Reconnect essential defenses after testing."
    ],
    "notes": "Do not assume zero-power logic means zero input is needed; control circuits still require signals.",
    "power": "Diagnostic only"
  }
];

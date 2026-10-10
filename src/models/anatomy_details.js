// Comprehensive Anatomical & Physiological Encyclopedia for Full Human Body
// Contains in-depth medical explanations, vital metrics, system connections, and functions.

export const ANATOMY_ENCYCLOPEDIA = {
  'Heart': {
    system: 'Cardiovascular System',
    subTitle: 'The Central Muscular Double-Pump',
    function: 'Pumps oxygenated blood into systemic arterial circulation and directs deoxygenated blood to the lungs for re-oxygenation. Generates rhythmic contraction cycles through the sinoatrial node.',
    detailedWork: 'The heart operates through synchronized atrial and ventricular diastole/systole phases. Blood enters the right atrium via the venae cavae, moves into the right ventricle, and is pumped into pulmonary arteries. Once reoxygenated in the lungs, blood enters the left atrium and passes to the left ventricle, which delivers systemic cardiac output at high pressure through the ascending aorta.',
    metrics: [
      { label: 'Cardiac Output', value: '5.0 – 7.2 L/min' },
      { label: 'Daily Output', value: '~7,500 Liters / day' },
      { label: 'Beats per Day', value: '~100,000 beats' },
      { label: 'Chambers', value: '4 (2 Atria, 2 Ventricles)' }
    ],
    connections: 'Connected to Arteries (Aorta), Veins (Vena Cava, Pulmonary Veins), and Lungs.'
  },
  'Arteries': {
    system: 'Circulatory / Vascular System',
    subTitle: 'Oxygen-Rich High-Pressure Arterial Highways',
    function: 'Distributes oxygen-rich, nutrient-dense arterial blood away from the left ventricle under high hydrostatic pressure to every tissue, muscle, organ, and cellular bed in the body.',
    detailedWork: 'Arterial walls feature thick muscular and elastic tunica media layers that absorb systolic pressure peaks (the Windkessel effect) and maintain continuous perfusion through elastic recoil during diastole. They branch into arterioles that regulate systemic vascular resistance and local capillary delivery.',
    metrics: [
      { label: 'Total Length', value: '~100,000 km of vessels' },
      { label: 'Blood Volume', value: '15% of systemic blood' },
      { label: 'Normal Pressure', value: '120/80 mmHg' },
      { label: 'Main Trunk', value: 'Ascending / Descending Aorta' }
    ],
    connections: 'Originates at Left Ventricle of Heart; feeds capillaries across brain, liver, kidneys, and extremities.'
  },
  'Veins': {
    system: 'Circulatory / Vascular System',
    subTitle: 'Low-Pressure Venous Return Reservoir',
    function: 'Collects deoxygenated metabolic waste-laden blood and carbon dioxide from systemic capillary beds, channeling it back to the right atrium of the heart.',
    detailedWork: 'Veins function as the capacitance reservoir of the circulatory system. Due to lower pressure, they utilize one-way bicuspid valves combined with skeletal muscle pumps and respiratory thoracic pressure swings to overcome gravity and drive upward blood flow.',
    metrics: [
      { label: 'Blood Reservoir', value: '~65% of total blood volume' },
      { label: 'Main Inflow', value: 'Superior & Inferior Vena Cava' },
      { label: 'Valves', value: 'Endothelial bicuspid flap valves' },
      { label: 'Oxygen Saturation', value: '~75% SvO2' }
    ],
    connections: 'Collects from systemic capillaries; empties directly into Right Atrium of Heart.'
  },
  'Lungs': {
    system: 'Respiratory System',
    subTitle: 'Pulmonary Ventilation & Alveolar Gas Exchange',
    function: 'Facilitates exchange of vital oxygen into hemoglobin while exhaling metabolic carbon dioxide waste. Balances physiological blood pH via carbonic acid regulation.',
    detailedWork: 'During inhalation, the diaphragm contracts downward, expanding the thoracic cavity and drawing air across the bronchial tree down into ~300 million tiny alveoli. Across the 0.5-micrometer alveolar-capillary membrane, passive diffusion transfers O2 into red blood cells while CO2 transfers out for exhalation.',
    metrics: [
      { label: 'Alveoli Count', value: '~300–480 Million' },
      { label: 'Internal Surface', value: '~70–100 m² (tennis court)' },
      { label: 'Daily Air Flow', value: '~11,000 Liters / day' },
      { label: 'Breathing Rate', value: '12–20 breaths / min' }
    ],
    connections: 'Receives deoxygenated blood from Pulmonary Artery; returns oxygenated blood to Left Atrium.'
  },
  'Brain': {
    system: 'Central Nervous System (CNS)',
    subTitle: 'Central Command & Cognitive Controller',
    function: 'Regulates consciousness, decision making, memory, sensory interpretation, voluntary motor coordination, autonomic bodily homeostasis, and neuroendocrine signaling.',
    detailedWork: 'Consists of the cerebrum (frontal, parietal, temporal, and occipital lobes), the cerebellum (motor timing & balance), and the brainstem (autonomic regulation of breathing and heart rate). Trillions of synaptic connections transmit information electrochemically using neurotransmitters.',
    metrics: [
      { label: 'Neuron Count', value: '~86 Billion neurons' },
      { label: 'Synapses', value: 'Over 100 Trillion' },
      { label: 'Energy Consumption', value: '~20% of total bodily caloric burn' },
      { label: 'Weight', value: '~1.4 kg (3 lbs)' }
    ],
    connections: 'Directly linked to Spinal Cord, Peripheral Nerves, Cranial Nerves, and Pituitary Gland.'
  },
  'Liver': {
    system: 'Digestive & Metabolic System',
    subTitle: 'The Master Chemical Processing Factory',
    function: 'Performs over 500 vital biochemical functions including nutrient synthesis, glycogen storage, plasma protein production, drug detoxification, and bile secretion.',
    detailedWork: 'Receives a dual blood supply: oxygenated blood from the hepatic artery and nutrient-rich venous blood from the intestines via the hepatic portal vein. Hepatocytes filter toxins, convert glucose into glycogen, produce albumin and clotting factors, and break down old erythrocytes.',
    metrics: [
      { label: 'Metabolic Roles', value: '500+ discrete chemical jobs' },
      { label: 'Weight', value: '~1.5 kg (heaviest internal organ)' },
      { label: 'Bile Production', value: '800 – 1,000 mL / day' },
      { label: 'Blood Perfusion', value: '~1.4 Liters / min' }
    ],
    connections: 'Fed by Hepatic Portal Vein from stomach & intestines; delivers bile to Gallbladder/Duodenum.'
  },
  'Stomach': {
    system: 'Gastrointestinal System',
    subTitle: 'Acidic Enzymatic Chemical Digestion Vault',
    function: 'Breaks down ingested food mechanically via peristaltic churning and chemically via hydrochloric acid and pepsinogen into nutrient chyme.',
    detailedWork: 'The stomach gastric glands produce hydrochloric acid, yielding an acidic pH between 1.5 and 2.0. This environment denatures dietary proteins and kills ingested pathogens while activating the enzyme pepsin. The stomach mucosal barrier produces thick alkaline mucus to protect its own wall from acid digestion.',
    metrics: [
      { label: 'Gastric Acid pH', value: '1.5 – 2.0 (highly acidic)' },
      { label: 'Capacity', value: '~1.0 – 1.5 Liters' },
      { label: 'Turnover Time', value: 'Food remains 2 to 4 hours' },
      { label: 'Enzymes', value: 'Pepsin, Gastric Lipase, Intrinsic Factor' }
    ],
    connections: 'Receives bolus from Esophagus; empties chyme into Duodenum (Small Intestine).'
  },
  'Intestines': {
    system: 'Digestive & Absorptive System',
    subTitle: '7-Meter Nutrient & Fluid Absorption Superhighway',
    function: 'Absorbs 90% of dietary nutrients, vitamins, electrolytes, and water into the bloodstream through microscopic mucosal villi, while passing indigestible fiber to the colon.',
    detailedWork: 'The small intestine (duodenum, jejunum, ileum) spans ~6 meters, lined with circular folds and microvilli that create a massive absorptive surface. Pancreatic enzymes and bile emulsify lipids and carbohydrates for absorption. The large intestine reabsorbs water and compacts waste with gut microbiome assistance.',
    metrics: [
      { label: 'Total Length', value: '~7 meters (22 feet)' },
      { label: 'Absorptive Area', value: '~30 m²' },
      { label: 'Transit Time', value: '24 – 72 hours' },
      { label: 'Microbiome', value: '38 Trillion symbiotic microbes' }
    ],
    connections: 'Receives from Stomach; drains nutrients via Portal Vein to Liver; terminates at Rectum.'
  },
  'Kidneys': {
    system: 'Renal & Excretory System',
    subTitle: 'Blood Filtration & Osmotic Electrolyte Balancer',
    function: 'Filters circulating blood to remove urea, creatinine, and toxins, balancing extracellular fluid volume, systemic blood pressure, and red blood cell production.',
    detailedWork: 'Each kidney contains roughly 1 million functional filtration units called nephrons. Blood flows through the glomerulus where ~180 liters of fluid are filtered daily. Tubules selectively reabsorb 99% of water, glucose, and essential electrolytes back into the blood, concentrating the remaining 1.5 liters into urine.',
    metrics: [
      { label: 'Nephrons', value: '~1 Million per kidney' },
      { label: 'Filtered Blood', value: '~180 Liters / day' },
      { label: 'Urine Produced', value: '~1.5 Liters / day' },
      { label: 'Blood Flow', value: '20% of resting cardiac output' }
    ],
    connections: 'Fed by Renal Arteries directly from Abdominal Aorta; drains urine into Ureters and Bladder.'
  },
  'Bladder': {
    system: 'Urinary System',
    subTitle: 'Distensible Urine Storage Reservoir',
    function: 'Stores urine produced continuously by the kidneys until conscious micturition.',
    detailedWork: 'Lined with transitional epithelium that flattens as urine volume increases, allowing the bladder wall to stretch smoothly without increasing internal pressure. Contraction of the detrusor muscle under autonomic and somatic nerve control empties urine via the urethra.',
    metrics: [
      { label: 'Capacity', value: '400 – 600 mL' },
      { label: 'First Urge', value: 'Triggered at ~150–200 mL' },
      { label: 'Wall Muscle', value: 'Detrusor smooth muscle' },
      { label: 'Epithelium', value: 'Urothelium (transitional)' }
    ],
    connections: 'Receives urine via bilateral Ureters from Kidneys; voids through Urethra.'
  },
  'Nervous system': {
    system: 'Nervous & Sensory Network',
    subTitle: 'Electrical Signaling and Reflex Circuitry',
    function: 'Transmits sensory signals from bodily tissues to the brain and relays motor impulses and autonomic commands back out to muscles and glands.',
    detailedWork: 'Composed of the spinal cord (the main central biological fiber-optic cable running down the vertebral column) and peripheral nerves including the cranial, brachial, and sciatic nerves. Action potentials travel along myelinated axons at up to 120 meters per second.',
    metrics: [
      { label: 'Nerve Fiber Length', value: '~72 Kilometers total' },
      { label: 'Signal Velocity', value: 'Up to 120 m/s (270 mph)' },
      { label: 'Spinal Nerves', value: '31 pairs' },
      { label: 'Major Branches', value: 'Sciatic, Vagus, Phrenic, Brachial' }
    ],
    connections: 'Links Brain to all organs, muscles, sensory skin receptors, and skeletal tissues.'
  },
  'Skeleton': {
    system: 'Musculoskeletal System',
    subTitle: 'Structural Frame, Organ Vault & Blood Cell Foundry',
    function: 'Provides mechanical scaffolding and movement levers, shields vital organs, acts as the primary reservoir for calcium and phosphate, and produces blood cells.',
    detailedWork: 'Divided into the axial skeleton (skull, vertebral column, ribs, sternum) and the appendicular skeleton (limbs, pelvic and pectoral girdles). Within the spongy trabecular bone, red bone marrow performs hematopoiesis, generating billions of red blood cells, white blood cells, and platelets daily.',
    metrics: [
      { label: 'Total Bones', value: '206 articulated bones' },
      { label: 'Longest Bone', value: 'Femur (~50 cm)' },
      { label: 'Smallest Bone', value: 'Stapes in inner ear (~3 mm)' },
      { label: 'Hematopoiesis', value: '200 Billion new RBCs / day' }
    ],
    connections: 'Encloses Brain, Spinal Cord, Heart, and Lungs; anchors all skeletal muscle groups.'
  },
  'Skin': {
    system: 'Integumentary System',
    subTitle: 'The Human Protective Shield & Thermal Regulator',
    function: 'Protects inner tissues against mechanical trauma, ultraviolet radiation, and microbial pathogens. Regulates body temperature via perspiration and synthesizes Vitamin D.',
    detailedWork: 'Composed of three layers: epidermis (keratinized waterproof cellular barrier), dermis (collagen, blood vessels, nerve endings, sweat glands, hair follicles), and subcutaneous hypodermis (fatty insulating layer). Sweating and arteriolar vasoconstriction/vasodilation regulate body temperature.',
    metrics: [
      { label: 'Surface Area', value: '1.8 – 2.0 m²' },
      { label: 'Weight', value: '~4 kg (16% of body weight)' },
      { label: 'Skin Cells Shed', value: '~30,000–40,000 dead cells / min' },
      { label: 'Layers', value: '3 (Epidermis, Dermis, Hypodermis)' }
    ],
    connections: 'Covers entire exterior surface; densely innervated by peripheral sensory nerves.'
  }
};

const gcdCalculation = ({
  speed,
} = {}) => {
  // From theoryjerks site:
  // Math.floor(Math.floor(100 * 100 *
  // (Math.floor(2500 * (1000 - Math.floor(130 * this.delta/levelMod))/1000)/1000))/100)/100;

  const levelMods = [
    [1, 10000, 20, 56, 56, 86, 52, 2],
    [2, 10000, 21, 57, 57, 101, 54, 2],
    [3, 10000, 22, 60, 60, 109, 56, 3],
    [4, 10000, 24, 62, 62, 116, 58, 3],
    [5, 10000, 26, 65, 65, 123, 60, 3],
    [6, 10000, 27, 68, 68, 131, 62, 3],
    [7, 10000, 29, 70, 70, 138, 64, 4],
    [8, 10000, 31, 73, 73, 145, 66, 4],
    [9, 10000, 33, 76, 76, 153, 68, 4],
    [10, 10000, 35, 78, 78, 160, 70, 5],
    [11, 10000, 36, 82, 82, 174, 73, 5],
    [12, 10000, 38, 85, 85, 188, 75, 5],
    [13, 10000, 41, 89, 89, 202, 78, 6],
    [14, 10000, 44, 93, 93, 216, 81, 6],
    [15, 10000, 46, 96, 96, 230, 84, 7],
    [16, 10000, 49, 100, 100, 244, 86, 7],
    [17, 10000, 52, 104, 104, 258, 89, 8],
    [18, 10000, 54, 109, 109, 272, 93, 9],
    [19, 10000, 57, 113, 113, 286, 95, 9],
    [20, 10000, 60, 116, 116, 300, 98, 10],
    [21, 10000, 63, 122, 122, '333?', 102, 10],
    [22, 10000, 67, 127, 127, 366, 105, 11],
    [23, 10000, 71, 133, 133, 399, 109, 12],
    [24, 10000, 74, 138, 138, 432, 113, 13],
    [25, 10000, 78, 144, 144, 465, 117, 14],
    [26, 10000, 81, 150, 150, '498?', 121, 15],
    [27, 10000, 85, 155, 155, 531, 125, 16],
    [28, 10000, 89, 162, 162, 564, 129, 17],
    [29, 10000, 92, 168, 168, '597?', 133, 18],
    [30, 10000, 97, 173, 173, 630, 137, 19],
    [31, 10000, 101, 181, 181, 669, 143, 20],
    [32, 10000, 106, 188, 188, 708, 148, 22],
    [33, 10000, 110, 194, 194, 747, 153, 23],
    [34, 10000, 115, 202, 202, 786, 159, 25],
    [35, 10000, 119, 209, 209, 825, 165, 27],
    [36, 10000, 124, 215, 215, 864, 170, 29],
    [37, 10000, 128, 223, 223, 903, 176, 31],
    [38, 10000, 134, 229, 229, 942, 181, 33],
    [39, 10000, 139, 236, 236, 981, 186, 35],
    [40, 10000, 144, 244, 244, 1020, 192, 38],
    [41, 10000, 150, 253, 253, 1088, 200, 40],
    [42, 10000, 155, 263, 263, 1156, 207, 43],
    [43, 10000, 161, 272, 272, 1224, 215, 46],
    [44, 10000, 166, 283, 283, 1292, 223, 49],
    [45, 10000, 171, 292, 292, '1360?', 231, 52],
    [46, 10000, 177, 302, 302, '1428?', 238, 55],
    [47, 10000, 183, 311, 311, 1496, 246, 58],
    [48, 10000, 189, 322, 322, '1564?', 254, 62],
    [49, 10000, 196, 331, 331, 1632, 261, 66],
    [50, 10000, 202, 341, 341, 1700, 269, 70],
    [51, 10000, 204, 342, 393, 1774, 270, 84],
    [52, 10000, 205, 344, 444, 1851, 271, 99],
    [53, 10000, 207, 345, 496, '1931?', 273, 113],
    [54, 10000, 209, 346, 548, 2015, 274, 128],
    [55, 10000, 210, 347, 600, 2102, 275, 142],
    [56, 10000, 212, 349, 651, 2194, 276, 157],
    [57, 10000, 214, 350, 703, 2289, 278, 171],
    [58, 10000, 215, 351, 755, 2388, 279, 186],
    [59, 10000, 217, 352, 806, 2492, 280, 200],
    [60, 10000, 218, 354, 858, 2600, 282, 215],
    [61, 10000, 224, 355, 941, 2700, 283, 232],
    [62, 10000, 228, 356, 1032, 2800, 284, 250],
    [63, 10000, 236, 357, 1133, 2900, 286, 269],
    [64, 10000, 244, 358, 1243, 3000, 287, 290],
    [65, 10000, 252, 359, 1364, 3100, 288, 313],
    [66, 10000, 260, 360, 1497, 3200, 290, 337],
    [67, 10000, 268, 361, 1643, 3300, 292, 363],
    [68, 10000, 276, 362, 1802, 3400, 293, 392],
    [69, 10000, 284, 363, 1978, 3500, 294, 422],
    [70, 10000, 292, 364, 2170, 3600, 295, 455],
    [71, 10000, 296, 365, 2263, '??', '??', 466],
    [72, 10000, 300, 366, 2360, '??', '??', '??'],
    [73, 10000, 305, 367, 2461, '??', '??', '??'],
    [74, 10000, 310, 368, 2566, '??', '??', '??'],
    [75, 10000, 315, 370, 2676, '??', '??', '??'],
    [76, 10000, 320, 372, 2790, '??', '??', '??'],
    [77, 10000, 325, 374, 2910, '??', '??', '??'],
    [78, 10000, 330, 376, 3034, '??', '??', '??'],
    [79, 10000, 355, 378, 3164, '??', '??', '??'],
    [80, 10000, 340, 380, 3300, '??', '??', 569],
  ];

  const base = levelMods[player.level - 1][3];
  const delta = speed - base;
  const levelMod = levelMods[player.level - 1][4];

  // console.log(speed);

  recast.shadowfang = Math.floor(Math.floor(10000 * (Math.floor((70000 * (1000 - Math.floor(130
    * (delta / levelMod)))) / 1000) / 1000)) / 100) * 10;

  recast.gcd = Math.floor(Math.floor(10000 * (Math.floor((2500 * (1000 - Math.floor(130
    * (delta / levelMod)))) / 1000) / 1000)) / 100) * 10; // Modified to output in ms
  console.log(`calculated standard GCD as ${recast.gcd}`);
  return recast.gcd;
};

const loadInitialState = () => {

  delete toggle.combo;
  //
  // if (player.job === 'BLM') {
  //   blmJobChange();
  // } else if (player.job === 'BRD') {
  //   brdJobChange();
  // } else if (player.job === 'DNC') {
  //   dncJobChange();
  // } else if (player.job === 'DRK') {
  //   drkJobChange();
  // } else if (player.job === 'GNB') {
  //   gnbJobChange();
  // } else if (player.job === 'MCH') {
  //   mchJobChange();
  // } else if (player.job === 'MNK') {
  //   mnkJobChange();
  // } else if (player.job === 'NIN') {
  //   ninJobChange();
  // } else if (player.job === 'PLD') {
  //   pldJobChange();
  // } else if (player.job === 'RDM') {
  //   rdmOnJobChange();
  // } else if (player.job === 'SAM') {
  //   samJobChange();
  // } else if (player.job === 'SCH') {
  //   schJobChange();
  // } else if (player.job === 'WAR') {
  //   warJobChange();
  // } else if (player.job === 'WHM') {
  //   whmJobChange();
  // }
};


const clearUI = () => {

  for (const property in timeout) {
    if (timeout.hasOwnProperty(property)) {
      clearTimeout(timeout[property]);
    }
  }
  for (property in interval) {
    if (interval.hasOwnProperty(property)) {
      clearInterval(interval[property]);
    }
  }

  iconArrayA = [];
  iconArrayB = [];
  iconArrayC = [];
  countdownArrayA = [];
  countdownArrayB = [];
  countdownArrayC = [];
  syncIcons({ array: iconArrayA });
  syncIcons({ array: iconArrayB });
  syncIcons({ array: iconArrayC });
  document.getElementById('countdown-a').innerHTML = '';
  document.getElementById('countdown-b').innerHTML = '';
  document.getElementById('countdown-c').innerHTML = '';
};


const countTargets = ({
  name,
  property = name.replace(/[\s'-:]/g, '').toLowerCase(),
} = {}) => {
  const countTargetsDelay = 1000;
  if (Date.now() - previous[property] > countTargetsDelay) {
    previous[property] = Date.now();
    count.targets = 1;
  } else {
    count.targets += 1;
  }
};

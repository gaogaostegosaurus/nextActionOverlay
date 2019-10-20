"use strict";

var blmFireSpam = "Fire";
var blmFireIcon = "none";
var blmFireMP = 1600;
var blmThunderMP = 200;
var blmThunderIcon = "none";

var blmFireTime = 2800;

var blmAstralMinimumMP = 200;
var blmUmbralMinimumMP = 0;
var blmRotationBufferTime = 5000;
var blmProcBufferTime = 5000;
var blmCasting = "";
var blmInstant = "";
var blmInstantIcon = "";
var blmSwiftcasted = 0;
var blmPreviousTargets = 0;

var blmFireCostModifier = 1;
var blmBlizzardCostModifier = 1;


var blmActions = [
  "Blizzard", "Blizzard II", "Blizzard III", "Blizzard IV",
  "Fire", "Fire II", "Fire III", "Fire IV",
  "Thunder", "Thunder II", "Thunder III", "Thunder IV",
  "Freeze", "Flare", "Despair",
  "Foul", "Xenoglossy",
  "Enochian", "Ley Lines", "Sharpcast", "Manafont",
  "Swiftcast", "Lucid Dreaming"
];

function blmJobChange() {

  // Minimum Astral Phase MP
  if (player.level >= 72) {
    blmAstralMinimumMP = 800;  // Despair + Blizzard IV
  }
  else if (player.level >= 40) {
    blmAstralMinimumMP = 200;  // Blizzard IV
  }
  else {
    blmAstralMinimumMP = 0;  // Transpose probably
  }

  // Any phase
  nextid.enochian = 0;  // ENOCHAAAAAAN
  nextid.thundercloud = 1;
  nextid.firestarter = 1;
  nextid.xenoglossy = 1;
  nextid.instantAction = 1;
  nextid.weaveAction = 2;

  nextid.thunder = 10;  // Appears when necessary at front of rotation
  nextid.thunder2 = nextid.thunder;  // See above
  nextid.foul = 10;

  // Astral
  nextid.firespam = 11;
  // nextid.firespam1 = 10;
  // nextid.firespam2 = nextid.firespam1 + 1;
  // nextid.firespam3 = nextid.firespam1 + 2;
  nextid.instant = 16;
  nextid.flare = 17;
  nextid.despair = 17;
  nextid.manafont = 18;
  nextid.transpose = 19;
  nextid.fire = nextid.transpose;
  nextid.blizzard3 = nextid.transpose;
  nextid.freezeUmbral3 = nextid.transpose;

  // Umbral
  nextid.blizzard = 11;
  nextid.blizzard2 = 11;
  nextid.blizzard4 = 11;
  nextid.freeze = 11;
  nextid.fire3 = 19;
  nextid.coldflare = nextid.fire3;

  // oGCD
  nextid.leylines = 21;
  nextid.sharpcast = 22;
  nextid.triplecast = 23;
  nextid.swiftcast = 24;

  countdownid.thunder = 0;
  countdownid.thundercloud = 1;
  countdownid.firestarter = 2;

  // Set up traited actions
  if (player.level >= 45) {
    icon.thunder = icon.thunder3;
    duration.thunder = duration.thunder3;
  }
  else {
    icon.thunder = "000457";
    duration.thunder = 18000;
  }

  if (player.level >= 64) {
    icon.thunder2 = icon.thunder4;
    duration.thunder2 = duration.thunder4;
  }
  else {
    icon.thunder2 = "000468";
    duration.thunder2 = 12000;
  }

  if (player.level >= 74) {
    recast.sharpcast = 30000;
  }
  else {
    recast.sharpcast = 60000;
  }

  // AoE Helpers
  previous.blizzard2 = 0;
  previous.fire2 = 0;
  previous.thunder2 = 0;
  previous.freeze = 0;
  previous.flare = 0;
  previous.foul = 0;

  enemyTargets = 1;

  blmNext();

}

function blmPlayerChangedEvent() {

  // Pause updates while casting
  if (blmCasting == "") {
    blmNext();
  }

  // Calculate MP cost modifiers
  if (player.jobDetail.umbralStacks == 3) {
    blmFireCostModifier = 2;
    blmBlizzardCostModifier = 0.25;
  }
  else if (player.jobDetail.umbralStacks == 2) {
    blmFireCostModifier = 2;
    blmBlizzardCostModifier = 0.25;
  }
  else if (player.jobDetail.umbralStacks == 1) {
    blmFireCostModifier = 2;
    blmBlizzardCostModifier = 0.5;
  }
  else if (player.jobDetail.umbralStacks == -3) {
    blmFireCostModifier = 0.25;
    blmBlizzardCostModifier = 0;
  }
  else if (player.jobDetail.umbralStacks == -2) {
    blmFireCostModifier = 0.25;
    blmBlizzardCostModifier = 0.5;
  }
  else if (player.jobDetail.umbralStacks == -1) {
    blmFireCostModifier = 0.5;
    blmBlizzardCostModifier = 0.75;
  }
  else {
    blmFireCostModifier = 1;
    blmBlizzardCostModifier = 1;
  }

  // Find server MP ticks
  if (previous.currentMP < player.currentMP) {
    previous.currentMP = player.currentMP;
    previous.serverTick = Date.now();
  }

}

function blmTargetChangedEvent() {

  // if (previous.targetID != target.ID) {
  //
  //   // console.log("Target changed: " + target.ID);
  //   if (player.jobDetail.umbralStacks > 0) {
  //     blmThunder(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks, blmAstralMinimumMP);
  //   }
  //   else if (player.jobDetail.umbralStacks < 0) {
  //     blmThunder(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks, blmUmbralMinimumMP);
  //   }
  //   else {
  //     blmThunder(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks, 0);
  //   }
  //
  //   previous.targetID = target.ID;
  // }

}

function blmStartsUsing() {
  blmCasting = startsLog.groups.actionName;
  blmNext();
}

function blmAction() {

  // No longer casting if an action has resolved
  blmCasting = "";
  // console.log("no longer casting");

  // console.log("Umbral Stacks: " + player.jobDetail.umbralStacks);
  // console.log("Umbral Hearts: " + player.jobDetail.umbralHearts);
  // console.log("Enochian: " + player.jobDetail.enochian);

  if (blmActions.indexOf(actionLog.groups.actionName) > -1) {

    // oGCDs

    if ("Enochian" == actionLog.groups.actionName) {
      removeIcon("enochian");
      addRecast("enochian");
    }

    else if ("Sharpcast" == actionLog.groups.actionName) {
      addStatus("sharpcast");
      addRecast("sharpcast");
    }

    else if ("Manafont" == actionLog.groups.actionName) {
      addRecast("manafont");
    }

    else if ("Transpose" == actionLog.groups.actionName) {
      removeIcon("transpose");
      addRecast("transpose");
    }

    else if ("Triplecast" == actionLog.groups.actionName) {
      blmInstant = "Triplecast";
      addStatus("triplecast");
      addRecast("triplecast");
    }

    else if ("Swiftcast" == actionLog.groups.actionName) {
      blmInstant = "Swiftcast";
      addStatus("swiftcast");
      addRecast("swiftcast");
    }

    else {

      if ("Fire" == actionLog.groups.actionName) {
        enemyTargets = 1;
      }

      else if ("Fire II" == actionLog.groups.actionName) {
        countTargets("fire2");
      }

      else if ("Fire III" == actionLog.groups.actionName) {
      }

      else if ("Fire IV" == actionLog.groups.actionName) {
      }

      else if ("Blizzard" == actionLog.groups.actionName) {
        enemyTargets = 1;
      }

      else if ("Blizzard II" == actionLog.groups.actionName) {
        countTargets("blizzard2");
      }

      else if ("Blizzard III" == actionLog.groups.actionName) {
        enemyTargets = 1;
      }

      else if (["Thunder", "Thunder III"].indexOf(actionLog.groups.actionName) > -1) {
        enemyTargets = 1;
        addStatus("thunder", duration.thunder, actionLog.groups.targetID);
      }

      else if (["Thunder II", "Thunder IV"].indexOf(actionLog.groups.actionName) > -1) {
        countTargets("thunder2");
        addStatus("thunder2", duration.thunder2, actionLog.groups.targetID);
      }

      else if ("Freeze" == actionLog.groups.actionName) {
        countTargets("freeze");
      }

      else if ("Flare" == actionLog.groups.actionName) {
        countTargets("flare");
      }

      else if ("Foul" == actionLog.groups.actionName) {
        countTargets("foul");
      }

      if (Math.min(checkStatus("swiftcast"), checkStatus("triplecast")) <= 0 && blmSwiftcasted == 1) {
        console.log("Used Swiftcast or Triplecast on " + actionLog.groups.actionName + " (maybe)");
        blmSwiftcasted = 0;
        removeIcon("weaveAction");
      }
    }

    // See if last spell was instant cast via Swiftcast or Triplecast
    if (Math.min(checkStatus("swiftcast"), checkStatus("triplecast")) > 0) {
      blmSwiftcasted = 1;
    }

    blmNext();

    // console.log(enemyTargets);

  }
}

function blmCancelled() {
  blmCasting = "";
  blmNext();
}

function blmStatus() {

  if (effectLog.groups.targetID == player.ID) {

    if (effectLog.groups.effectName == "Thundercloud") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("thundercloud", parseInt(effectLog.groups.effectDuration) * 1000);
        addCountdownBar("thundercloud", checkStatus("thundercloud"), "removeCountdownBar");
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("thundercloud", effectLog.groups.targetID);
      }
    }

    else if (effectLog.groups.effectName == "Firestarter") {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("firestarter", parseInt(effectLog.groups.effectDuration) * 1000);
        addCountdownBar("firestarter", checkStatus("firestarter"), "removeCountdownBar");
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("firestarter", effectLog.groups.targetID);
        // removeIcon("firestarter");
      }
    }

  }

  else {

    // console.log(effectLog.groups.targetID + effectLog.groups.gainsLoses + effectLog.groups.effectName);

    if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(effectLog.groups.effectName) > -1) {
      if (effectLog.groups.gainsLoses == "gains") {
        addStatus("thunder", parseInt(effectLog.groups.effectDuration) * 1000, effectLog.groups.targetID);
        addCountdownBar("thunder", checkStatus("thunder", effectLog.groups.targetID), "removeCountdownBar");
      }
      else if (effectLog.groups.gainsLoses == "loses") {
        removeStatus("thunder", effectLog.groups.targetID);
      }
    }

  }
}

function blmNext() {

  if ("Fire" == blmCasting) {
    if (player.jobDetail.umbralStacks < 0) {
      blmAstralRotation(player.currentMP - 800 * blmFireCostModifier, 15000, 0);
    }
    else {
      blmAstralRotation(player.currentMP - 800 * blmFireCostModifier, 15000, Math.min(player.jobDetail.umbralStacks + 1, 3));
    }
  }

  else if ("Fire II" == blmCasting) {
    if (player.jobDetail.umbralStacks < 0) {
      blmAstralRotation(player.currentMP - 1500 * blmFireCostModifier, 15000, 0);
    }
    else {
      blmAstralRotation(player.currentMP - 1500 * blmFireCostModifier, 15000, Math.min(player.jobDetail.umbralStacks + 1, 3));
    }
  }

  else if ("Fire III" == blmCasting) {
    blmAstralRotation(player.currentMP - 2000 * blmFireCostModifier, 15000, 3 );
  }

  else if ("Flare" == blmCasting) {
    if (player.jobDetail.umbralHearts > 0) {
      blmAstralRotation(player.currentMP * 0.34, 15000, 3);
    }
    else {
      blmAstralRotation(0, 15000, 3);
    }
  }

  else if ("Despair" == blmCasting) {
    if (player.jobDetail.umbralHearts > 0) {
      blmAstralRotation(player.currentMP * 0.34, 15000, 3);
    }
    else {
      blmAstralRotation(0, 15000, 3);
    }
  }

  else if ("Blizzard" == blmCasting) {
    if (player.jobDetail.umbralStacks > 0) {
      blmAstralRotation(player.currentMP - 400 * blmBlizzardCostModifier, 15000, 0);
    }
    else {
      blmAstralRotation(player.currentMP - 400 * blmBlizzardCostModifier, 15000, Math.max(player.jobDetail.umbralStacks - 1, -3));
    }
  }

  else if ("Blizzard II" == blmCasting) {
    if (player.jobDetail.umbralStacks > 0) {
      blmAstralRotation(player.currentMP - 800 * blmBlizzardCostModifier, 15000, 0);
    }
    else {
      blmAstralRotation(player.currentMP - 800 * blmBlizzardCostModifier, 15000, Math.max(player.jobDetail.umbralStacks - 1, -3));
    }
  }

  else if ("Freeze" == blmCasting) {
    blmUmbralRotation(player.currentMP - 1000 * blmBlizzardCostModifier, 15000, -3);
  }

  else if ("Blizzard III" == blmCasting) {
    blmUmbralRotation(player.currentMP - 800 * blmBlizzardCostModifier, 15000, -3);
  }

  // All other cases
  else if (player.jobDetail.umbralStacks < 0) { // In Umbral
    blmUmbralRotation(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks);
  }
  else { // Starting out or in Astral
    blmAstralRotation(player.currentMP, player.jobDetail.umbralMilliseconds, player.jobDetail.umbralStacks);
  }

}

// Astral Fire
function blmAstralRotation(currentMP, blmAstralTime, blmAstralStacks) {

  // LEVELING ROTATIONS

  // Single-Target
  // Sub-40: {F1 spam} Transpose T1 {B1 until max MP} Transpose
  // 40-59:  B3 T3 {optional B1 for MP tick} F3 {F1 spam until low MP} repeat. Use F3p and T3p as you get them, but don't cancel casts to use procs
  // 60-71: B3 B4 T3 F3 F4x3 F1 F4x3 repeat. Foul whenever
  // 72+: B3 B4 T3 F3 F4x3 F1 F4x3 Despair repeat
  // Same as 60-71 with Despair at the end
  // Same as 80 just without Xeno. See guide for better details

  // AOE
  // 18-34: {F2 spam} Transpose {B2 until max MP} Transpose repeat. Keep up T2 dot
  // 35-49: Spam Freeze. Keep up T2 dot
  // 50-59: Freeze T2 F3 F2 F2 Flare Transpose repeat
  // 60-67: Freeze T2 F3 {F4 2-3 times} Flare Transpose repeat
  // Save 800 MP for Flare. Use 50-59 AOE Rotation at 5+ enemies
  // 68-71: Freeze T4 F3 Flare Flare Transpose repeat
  // 72+: Freeze T4 F3 Flare Flare repeat
  // Same as 80. See guide for better details
  // For all aoe, use Thundercloud procs on T2/T4 as you get them. Swift/Triple Flares. Manafont for an extra Flare. Foul after Transpose or Freeze

  // Picks Fire spell
  if (player.level >= 68 && enemyTargets >= 3) {
    blmFireSpam = "none";
  }
  else if (player.level >= 60 && enemyTargets >= 5) {
    blmFireSpam = "Fire II";
  }
  else if (player.level >= 60) {
    blmFireSpam = "Fire IV";
  }
  else if (player.level >= 50 && enemyTargets >= 3) {
    blmFireSpam = "Fire II";
  }
  else if (player.level >= 35 && enemyTargets >= 3) {
    blmFireSpam = "none";
  }
  else if (player.level >= 18 && enemyTargets >= 3) {
    blmFireSpam = "Fire II";
  }
  else {
    blmFireSpam = "Fire";
  }

  // Fire spam data
  if (blmFireSpam == "Fire") {
    blmFireIcon = "fire";
    blmFireMP = 800 * blmFireCostModifier;
    blmFireTime = 2500;
  }
  else if (blmFireSpam == "Fire II") {
    blmFireIcon = "fire2";
    blmFireMP = 1500 * blmFireCostModifier;
    blmFireTime = 3000;
  }
  else if (blmFireSpam == "Fire IV") {
    blmFireIcon = "fire4";
    blmFireMP = 800 * blmFireCostModifier;
    blmFireTime = 2800;
  }
  else {
    blmFireIcon = "fire";
    blmFireMP = 100000 * blmFireCostModifier;
    blmFireTime = 150000;
  }

  // Calculate Fire spam count
  count.firespam = Math.min(
    (currentMP + player.jobDetail.umbralHearts * (blmFireMP / 2) - blmAstralMinimumMP) / blmFireMP,  // "how much MP for fire spam spells"
    (blmAstralTime - blmRotationBufferTime) / blmFireTime // how much time for fire spam spells
  )

  blmEnochian(blmAstralTime);
  blmInstantFiller(currentMP, blmAstralTime, blmAstralStacks);
  blmThunder(currentMP, blmAstralTime, blmAstralStacks, blmAstralMinimumMP);

  // Firespam
  if (blmFireSpam == "none") {
    removeIcon("firespam");
  }
  else {
    if (count.firespam > 1) {
      newAddIcon({
        name: "firespam",
        img: blmFireIcon,
      });
    }
    else {
      removeIcon("firespam");
    }
  }

  // MP to 0 spells
  if (blmAstralStacks == 3) {
    if (player.level >= 50
    && enemyTargets >= 3
    && currentMP >= 800) {
      addIcon("flare");
    }
    else if (player.level >= 72
    && currentMP - count.firespam * 1600 >= blmAstralMinimumMP
    && currentMP - count.firespam * 1600 < 1600 + blmAstralMinimumMP) {
      addIcon("despair");
    }
    else {
      removeIcon("flare");
    }
  }
  else {
    removeIcon("flare");
  }

  // Change to Umbral Ice
  if (enemyTargets >= 3) {
    if (player.level >= 72) {
      addIcon("freezeUmbral3");
    }
    else {
      addIcon("transpose");
    }
  }
  else {
    if (player.level >= 60
    && blmAstralStacks == 3
    && (currentMP + player.jobDetail.umbralHearts * 800 - 1600 - blmAstralMinimumMP) / 1600 > (blmAstralTime - blmRotationBufferTime) / 2800) {
      addIcon("fire");
    }
    else if (blmCasting == "Blizzard III") {
      removeIcon("blizzard3");
    }
    else {
      addIcon("blizzard3");
    }
  }
}

// Umbral Ice
function blmUmbralRotation(currentMP, blmUmbralTime, blmUmbralStacks) {

  // LEVELING ROTATIONS

  // Single-Target
  // Sub-40: {F1 spam} Transpose T1 {B1 until max MP} Transpose
  // 40-59:  B3 T3 {optional B1 for MP tick} F3 {F1 spam until low MP} repeat. Use F3p and T3p as you get them, but don't cancel casts to use procs
  // 60-71: B3 B4 T3 F3 F4x3 F1 F4x3 repeat. Foul whenever
  // 72+: B3 B4 T3 F3 F4x3 F1 F4x3 Despair repeat
  // Same as 60-71 with Despair at the end
  // Same as 80 just without Xeno. See guide for better details

  // AOE
  // 18-34: {F2 spam} Transpose {B2 until max MP} Transpose repeat. Keep up T2 dot
  // 35-49: Spam Freeze. Keep up T2 dot
  // 50-59: Freeze T2 F3 F2 F2 Flare Transpose repeat
  // 60-67: Freeze T2 F3 {F4 2-3 times} Flare Transpose repeat
  // Save 800 MP for Flare. Use 50-59 AOE Rotation at 5+ enemies
  // 68-71: Freeze T4 F3 Flare Flare Transpose repeat
  // 72+: Freeze T4 F3 Flare Flare repeat
  // Same as 80. See guide for better details
  // For all aoe, use Thundercloud procs on T2/T4 as you get them. Swift/Triple Flares. Manafont for an extra Flare. Foul after Transpose or Freeze

  if (player.jobDetail.umbralStacks <= -3) {
    blmUmbralMinimumMP = 3800;
  }
  else if (player.jobDetail.umbralStacks <= -2) {
    blmUmbralMinimumMP = 5300;
  }
  else if (player.jobDetail.umbralStacks <= -1) {
    blmUmbralMinimumMP = 6800;
  }

  blmEnochian(blmUmbralTime);
  blmInstantFiller(currentMP, blmUmbralTime, blmUmbralStacks);
  blmThunder(currentMP, blmUmbralTime, blmUmbralStacks, blmUmbralMinimumMP);

  // AoE
  if (enemyTargets >= 3) {
    if (player.level >= 50) {
      if (blmCasting == "Freeze") {
        removeIcon("freeze");
      }
      // AoE uses Freeze to transition to Umbral III
      else if (player.jobDetail.umbralStacks != -3) {
        addIcon("freeze");
      }
      else {
        removeIcon("freeze");
      }
    }
    else if (player.level >= 35) {
      addIcon("freeze");
    }
    else {
      if (player.currentMP == 10000) {
        removeIcon("blizzard2");
      }
      else if (player.currentMP >= blmUmbralMinimumMP && Date.now() - previous.serverTick > 3000 - 2500) {
        removeIcon("blizzard2");
      }
      else {
        addIcon("blizzard2");
      }
    }
  }

  // Single target
  else {

    // Blizzard IV (post 58)
    if (player.level >= 58) {
      if (blmCasting == "Blizzard IV") {
        removeIcon("blizzard4");
      }
      else if (player.jobDetail.umbralHearts == 3) {
        removeIcon("blizzard4");
      }
      else if (player.jobDetail.enochian || checkRecast("enochian") < 0) {
        addIcon("blizzard4");
      }
      else {
        removeIcon("blizzard4");
      }
    }

    // Blizzard spam (pre 58)
    else {
      if (player.currentMP == 10000) {
        removeIcon("blizzard");
      }
      else if (player.currentMP >= blmUmbralMinimumMP && Date.now() - previous.serverTick > 3000 - 2500) {
        removeIcon("blizzard");
      }
      else {
        addIcon("blizzard");
      }
    }
  }

  // Transition spell (Fire III, etc.)
  // Only show transitions at full MP
  if (player.currentMP == 10000 ||
  (player.currentMP >= blmUmbralMinimumMP && Date.now() - previous.serverTick > 1500)) {

    if (player.level >= 72
    && enemyTargets >= 5
    && player.jobDetail.umbralHearts > 0) {
      addIcon("coldflare");  // "Cold flare"
    }
    else {
      if (player.level >= 40) {
        addIcon("fire3");
      }
      else if (player.level < 34) {
        addIcon("transpose");
      }
    }
  }
  else {
    removeIcon("transpose");
  }
}

// Enochian
function blmEnochian(rotationTime) {
  if (!player.jobDetail.enochian
  && player.level >= 56
  && checkRecast("enochian") <= 0
  && rotationTime > blmRotationBufferTime) {
    addIcon("enochian");
  }
  else {
    removeIcon("enochian");
  }
}

// Looks for instants for weaving
function blmInstantFiller(currentMP, rotationTime, rotationStacks) {

  // Check for Instants to weave behind

  // Thundercloud gets priority use during AoE - ignore rest
  if (enemyTargets >= 3) {
    if (checkStatus("thundercloud") > 0
    && rotationTime > 2500 + blmRotationBufferTime) {
      blmInstant = "Thundercloud";
      addIcon("thundercloud", blmThunderIcon);
      removeIcon("thunder");
    }
    else {
      blmInstant = "";
    }
  }

  // Thundercloud if Thundercloud effect is about to expire
  else if (checkStatus("thundercloud") > 0
  && checkStatus("thundercloud") < blmProcBufferTime
  && rotationTime > 2500 + blmRotationBufferTime) {
    blmInstant = "Thundercloud";
    addIcon("thundercloud", blmThunderIcon);
    removeIcon("thunder");
  }

  // Use Thundercloud if Thunder effect is about to expire
  else if (checkStatus("thundercloud") > 0
  && target.ID.length == 8
  && target.ID.startsWith("4")
  && checkStatus("thunder", target.ID) <= 0
  && rotationTime > 2500 + blmRotationBufferTime) {
    blmInstant = "Thundercloud";
    addIcon("thundercloud", blmThunderIcon);
    removeIcon("thunder");
  }

  // Xenoglossy - avoid overcapping
  else if (player.level >= 80
  && player.jobDetail.foulCount > 1
  && rotationTime > 2500 + blmRotationBufferTime) {
    addIcon("xenoglossy");
    blmInstant = "Xenoglossy";
  }

  // Firestarter
  else if (checkStatus("firestarter") >= 1000
  && rotationStacks > 0
  && rotationTime > 2500) {
    blmInstant = "Firestarter";
  }

  // Xenoglossy
  else if (player.level >= 80
  && player.jobDetail.foulCount > 0
  && rotationTime > 2500 + blmRotationBufferTime) {
    blmInstant = "Xenoglossy";
  }

  // Thundercloud
  else if (checkStatus("thundercloud") >= 1000
  && rotationTime > 2500 + blmRotationBufferTime) {
    blmInstant = "Thundercloud";
  }

  else {
    blmInstant = "";
  }

  if (blmInstant == "Thundercloud") {
    blmInstantIcon = blmThunderIcon;
  }
  else if (blmInstant == "Firestarter") {
    blmInstantIcon = "firestarter";
  }
  else if (blmInstant == "Xenoglossy") {
    blmInstantIcon = "xenoglossy";
  }

  // Add weaveable action if instant is available

  if (blmInstant != "") {

    // Manafont
    if (player.level >= 30
    && checkRecast("manafont") < 1000
    && rotationStacks >= 3
    && currentMP <= 7000) {
      addIcon("instantAction", blmInstantIcon);
      addIcon("weaveAction", "manafont");
    }

    // Sharpcast
    else if (player.level >= 54
    && checkRecast("sharpcast") < 1000) {
      addIcon("instantAction", blmInstantIcon);
      addIcon("weaveAction", "sharpcast");
    }

    // Triplecast
    else if (checkRecast("triplecast") < 1000
    && rotationStacks >= 3
    && currentMP >= 1600 * 3 + 800) {
      addIcon("instantAction", blmInstantIcon);
      addIcon("weaveAction", "triplecast");
    }

    // Leylines
    else if (checkRecast("leylines") < 1000) {
      addIcon("instantAction", blmInstantIcon);
      addIcon("weaveAction", "leylines");
    }

    // Swiftcast
    else if (checkRecast("swiftcast") < 1000
    && rotationStacks >= 3) {
      addIcon("instantAction", blmInstantIcon);
      addIcon("weaveAction", "swiftcast");
    }

    else {
      removeIcon("weaveAction");
    }
  }
}

// Thunder
function blmThunder(currentMP, rotationTime, rotationStacks, rotationMinimumMP) {

  if (enemyTargets >= 3) {
    if (player.level >= 64) {
      blmThunderMP = 800;
      blmThunderIcon = "thunder4";
    }
    else if (player.level >= 26) {
      blmThunderMP = 400;
      blmThunderIcon = "thunder2";
    }
    else {
      blmThunderMP = 100000;
      blmThunderIcon = "thunder";
    }
  }
  else {
    if (player.level >= 45) {
      blmThunderMP = 400;
      blmThunderIcon = "thunder3";
    }
    else {
      blmThunderMP = 200;
      blmThunderIcon = "thunder";
    }
  }

  // Hide if casting already
  if (["Thunder", "Thunder II", "Thunder III", "Thunder IV"].indexOf(blmCasting) > -1) {
    removeIcon("thunder");
  }

  // Not enough MP
  else if (currentMP < blmThunderMP + rotationMinimumMP) {
    removeIcon("thunder");
  }

  // Hide in Umbral Ice if not at full stacks yet
  else if (player.level >= 40
  && player.umbralStacks < 0
  && player.umbralStacks > -3) {
    removeIcon("thunder");
  }
  else if (player.level >= 20
  && player.umbralStacks < 0
  && player.umbralStacks > -2) {
    removeIcon("thunder");
  }

  // Hardcast Thunder
  else if (target.ID) {
    if (checkStatus("thundercloud") < 0
    && target.ID.length == 8
    && target.ID.startsWith("4")
    && checkStatus("thunder", target.ID) <= 2500
    && rotationTime > 2500 + blmRotationBufferTime) {
      addIcon("thunder", blmThunderIcon);
    }
  }

  else {
    removeIcon("thunder");
  }

}

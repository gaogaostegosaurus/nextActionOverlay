"use strict";

// GCD Combo
// Jumps Dives and pew pew
// Other cooldowns
// player.jobDetail.bloodMilliseconds + " | " + player.jobDetail.lifeMilliseconds + " | " + player.jobDetail.eyesAmount

var drgBlood;
var drgLife;
var drgGaze;

var diveStatus = 0;
var chaosStatus = 0;
var fangStatus = 0;
var heavyStatus = 0;
var wheelStatus = 0;

var jumpTimeout;
var spineshatterTimeout;
var dragonfireTimeout;

var bloodCooldown = 0; // Blood for Blood
var dragonCooldown = 0; // Blood of the Dragon 
var dragonfireCooldown = 0;
var geirskogulCooldown = 0;
var jumpCooldown = 0;
var nastrondCooldown = 0;
var sightCooldown = 0; // Dragon Sight
var spineshatterCooldown = 0;
var surgeCooldown = 0; // Life Surge

var drgActionList = "True Thrust|Vorpal Thrust|Impulse Drive|Heavy Thrust|Piercing Talon|Full Thrust|Disembowel|Chaos Thrust|Fang And Claw|Wheeling Thrust|Sonic Thrust";
var drgCooldownList = "Life Surge|Blood For Blood|Jump|Spineshatter Dive|Dragonfire Dive|Battle Litany|Blood Of The Dragon|Geirskogul|Dragon Sight|Nastrond";
var drgSelfStatusList = "Heavy Thrust|Sharper Fang And Claw|Enhanced Wheeling Thrust|Dive Ready";
var drgTargetStatusList = "Chaos Thrust";

function drgPlayerChangedEvent(e) {
  
  if (player.jobDetail.bloodMilliseconds == 0 && player.jobDetail.lifeMilliseconds == 0 && player.level >= 54 && dragonCooldown - Date.now() < 0) {
    removeIcon("nextAction5"); 
    removeIcon("nextAction6");
    addIcon("nextAction11","002581");
  }
  
  else if ((player.jobDetail.bloodMilliseconds > 0 || player.jobDetail.lifeMilliseconds > 0) && player.level >= 54) {

    removeIcon("nextAction11","002581");
    
    clearTimeout(jumpTimeout);
    clearTimeout(spineshatterTimeout);
    
    if ((player.level >= 68 && jumpCooldown - Date.now() < 0 && diveStatus - Date.now() < 0) || (player.level < 68 && jumpCooldown - Date.now() < 0)) {
      addIcon("nextAction12","002576"); 
    }
    else {
      removeIcon("nextAction12");
    }
    
    if ((player.level >= 68 && spineshatterCooldown - Date.now() < 0 && diveStatus - Date.now() < 0)  || (player.level < 68 && spineshatterCooldown - Date.now() < 0)) {
      addIcon("nextAction13","002580"); 
    }
    else {
      removeIcon("nextAction13");
    }
    
    if (diveStatus - Date.now() > 0 && player.jobDetail.eyesAmount < 3) {
      addIcon("nextAction14","002588");
    }
    else {
      removeIcon("nextAction14");
    }
    
    if (geirskogulCooldown - Date.now() < 0 && player.jobDetail.bloodMilliseconds > 0 && player.jobDetail.eyesAmount < 3) {
      addIcon("nextAction15","002583");
    }
    else if (geirskogulCooldown - Date.now() < 0 && player.jobDetail.bloodMilliseconds > 24000 && player.jobDetail.eyesAmount == 3) {
      addIcon("nextAction15","002583");
    }
    else if (nastrondCooldown - Date.now() < 0 && player.jobDetail.lifeMilliseconds > 0) {
      addIcon("nextAction15","002589");
    }
    else {
      removeIcon("nextAction15");
    }
    
  }
  else {
    removeIcon("nextAction11","002581");
  }
  
}

function drgLogEvent(e,i) {
  
  actionLine.drg = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + drgActionList + '):','i'));
  cooldownLine.drg = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:[\\dA-F]{8}:' + player.name + ':[\\dA-F]{2,8}:(' + drgCooldownList + '):','i'));
  
  selfGainsStatusLine = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') gains the effect of (' + drgSelfStatusList + ') from (' + player.name + ') for (.*) Seconds\\.'));
  selfLosesStatusLine = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(' + player.name + ') loses the effect of (' + drgSelfStatusList + ') from (' + player.name + ')\\.'));
  targetGainsStatusLine = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(.*) gains the effect of (' + drgTargetStatusList + ') from (' + player.name + ') for (.*) Seconds\\.'));
  targetLosesStatusLine = e.detail.logs[i].match(RegExp(' [\\dA-F]{2}:(.*) loses the effect of (' + drgTargetStatusList + ') from (' + player.name + ')\\.'));
  
  if (actionLine.drg) {
    
    if (actionLine.drg[1] == "True Thrust") {
      fullCombo();
      removeIcon("nextAction1");
      removeIcon("nextAction2");
    }
    
    else if (actionLine.drg[1] == "Impulse Drive") {
      chaosCombo();
      removeIcon("nextAction1");
      removeIcon("nextAction2");
    }
    
    else if (actionLine.drg[1] == "Vorpal Thrust" && previous.action == "True Thrust" && player.level >= 26) { // Check to see if mid-combo first
      removeIcon("nextAction3");
    }
    
    else if (actionLine.drg[1] == "Disembowel" && previous.action == "Impulse Drive" && player.level >= 50) {
      removeIcon("nextAction3");
    }
    
    else if (actionLine.drg[1] == "Full Thrust" && previous.action == "Vorpal Thrust" && player.level >= 56 && (player.jobDetail.bloodMilliseconds > 0 || player.jobDetail.lifeMilliseconds > 0)) {
      removeIcon("nextAction4");
      removeIcon("nextAction21"); // Life Surge
    }
    
    else if (actionLine.drg[1] == "Chaos Thrust" && previous.action == "Disembowel" && player.level >= 58 && (player.jobDetail.bloodMilliseconds > 0 || player.jobDetail.lifeMilliseconds > 0)) {
      removeIcon("nextAction4");
    }
    
    else if (actionLine.drg[1] == "Fang And Claw" && previous.action == "Full Thrust" && player.level >= 64 && (player.jobDetail.bloodMilliseconds > 0 || player.jobDetail.lifeMilliseconds > 0)) {
      removeIcon("nextAction5");
    }
    
    else if (actionLine.drg[1] == "Wheeling Thrust" && previous.action == "Chaos Thrust" && player.level >= 64 && (player.jobDetail.bloodMilliseconds > 0 || player.jobDetail.lifeMilliseconds > 0)) {
      removeIcon("nextAction5");
    }
    
    else { // Combo breakerrrrr
      delete toggle.combo;
      drgCombo();
    }
    previous.action = actionLine.drg[1];
  }
  
  if (cooldownLine.drg) {
    
    if (cooldownLine.drg[1] == "Life Surge") {
      surgeCooldown = Date.now() + 50 * 1000;
    }
    
    else if (cooldownLine.drg[1] == "Blood For Blood") {
      bloodCooldown = Date.now() + 80 * 1000;
    }
    
    else if (cooldownLine.drg[1] == "Jump") {
      jumpCooldown = Date.now() + 30 * 1000;
      if (player.jobDetail.bloodMilliseconds == 0) {
        removeIcon("nextAction12");
        //clearTimeout(jumpTimeout);
        //jumpTimeout = setTimeout(addIcon, 30 * 1000 - 1000, "nextAction12", "002576"); 
      }
    }
    
    else if (cooldownLine.drg[1] == "Spineshatter Dive") {
      spineshatterCooldown = Date.now() + 60 * 1000;
      if (player.jobDetail.bloodMilliseconds == 0) {
        removeIcon("nextAction13");
        //addicon
        //clearTimeout(spineshatterTimeout);
        //spineshatterTimeout = setTimeout(addIcon, 60 * 1000 - 1000, "nextAction13", "002580"); 
      }
    }
    
    else if (cooldownLine.drg[1] == "Dragonfire Dive") {
      dragonfireCooldown = Date.now() + 120 * 1000;
      removeIcon("nextAction16");
      //clearTimeout(dragonfireTimeout);
      //dragonfireTimeout = setTimeout(addIcon, 120 * 1000 - 1000, "nextAction14", "002578"); 
    }
    
    else if (cooldownLine.drg[1] == "Battle Litany") {
      litanyCooldown = Date.now() + 180 * 1000;
    }
    
    else if (cooldownLine.drg[1] == "Blood Of The Dragon") {
      dragonCooldown = Date.now() + 30 * 1000;
      if (toggle.combo == 1 && previous.action != "Full Thrust" && player.level >= 56) {
        addIcon("nextAction5","002582");
        if (player.level >= 64) {
          addIcon("nextAction6","002584");
        }
      }
      else if (toggle.combo == 2 && previous.action != "Chaos Thrust" && player.level >= 58) {
        addIcon("nextAction5","002584");
        if (player.level >= 64) {
          addIcon("nextAction6","002582");
        }
      }
    }
    
    else if (cooldownLine.drg[1] == "Dragon Sight") {
      sightCooldown = Date.now() + 180 * 1000;
    }
    
    else if (cooldownLine.drg[1] == "Geirskogul") {
      geirskogulCooldown = Date.now() + 30 * 1000;
    }
    
    else if (cooldownLine.drg[1] == "Nastrond") {
      nastrondCooldown = Date.now() + 10 * 1000;
    }
    
  }
  
  if (selfGainsStatusLine) {
    
    if (selfGainsStatusLine[2] == "Heavy Thrust") {
      heavyStatus = Date.now() + parseInt(selfGainsStatusLine[4] * 1000);
    }
    
    else if (selfGainsStatusLine[2] == "Dive Ready") {
      diveStatus =  Date.now() + parseInt(selfGainsStatusLine[4] * 1000);
    }
  }
  
  if (selfLosesStatusLine) {
    
    if (selfLosesStatusLine[2] == "Heavy Thrust") {
      heavyStatus = 0;
    }
    
    else if (selfLosesStatusLine[2] == "Dive Ready") {
      removeIcon("nextAction15");
      diveStatus = 0;
    }
  }
  
  if (targetGainsStatusLine) {
    
    if (targetGainsStatusLine[2] == "Chaos Thrust") {
      chaosStatus = Date.now() + parseInt(targetGainsStatusLine[4]) * 1000;
    }
  }
  
  if (targetLosesStatusLine) {
    
    if (targetLosesStatusLine[2] == "Chaos Thrust") {
      chaosStatus = 0;
    }
  }
}

function drgCombo() {  // Leaves out step 1 because Spenders can't and don't need to see previous action 
  if (heavyStatus - Date.now() < 12500 && player.level >= 10 && actionLine.drg[1] != "Heavy Thrust") {
    addIcon("nextAction1","000311");
  }
  else {
    removeIcon("nextAction1");
  }
  
  if (piercingStatus - Date.now() < 15000 && player.level >= 38 && actionLine.drg[1] != "Disembowel" && previous.action != "Impulse Drive") {
    chaosCombo();
  }

  else if (chaosStatus - Date.now() < 15000 && player.level >= 50 && actionLine.drg[1] != "Chaos Thrust" && previous.action != "Disembowel" ) {
    chaosCombo();
  }
  
  else { 
    fullCombo();
  }
}

function fullCombo() {
  toggle.combo = 1;
  if (player.level >= 18 && surgeCooldown - Date.now() < 0) {
    addIcon("nextAction21","000304");
  }
  addIcon("nextAction2","000310");
  if (player.level >= 4) {
    addIcon("nextAction3","000312");
    if (player.level >= 26) {
      addIcon("nextAction4","000314");
      if (player.level >= 56 && (player.jobDetail.bloodMilliseconds > 0 || player.jobDetail.lifeMilliseconds > 0)) {
        addIcon("nextAction5","002582");
        if (player.level >= 64) {
          addIcon("nextAction6","002584");
        }
      }
      else {
        removeIcon("nextAction5");
        removeIcon("nextAction6");
      }
    }
    else {
      removeIcon("nextAction4");
    }
  }
  else {
    removeIcon("nextAction3");
  }
}


function chaosCombo() {
  toggle.combo = 2;
  addIcon("nextAction2","000313");
  if (player.level >= 38) {
    addIcon("nextAction3","000317");
    if (player.level >= 50) {
      addIcon("nextAction4","000308");
      if (player.level >= 58 && (player.jobDetail.bloodMilliseconds > 0 || player.jobDetail.lifeMilliseconds > 0)) {
        addIcon("nextAction5","002584");
        if (player.level >= 64) {
          addIcon("nextAction6","002582");
        }
      }
      else {
        removeIcon("nextAction5");
        removeIcon("nextAction6");
      }
    }
    else {
      removeIcon("nextAction4");
    }
  }
  else {
    removeIcon("nextAction3");
  }
}

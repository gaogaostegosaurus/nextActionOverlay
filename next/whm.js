"use strict";

actionList.whm = [

  // Role actions
  "Lucid Dreaming",

  // oGCD actions
  "Presence Of Mind", "Benediction", "Asylum", "Assize", "Thin Air", "Tetragrammaton", "Divine Benison",

  // GCD actions
  "Aero", "Regen", "Aero II", "Dia"
];

function whmJobChange() {

  // Set up UI
  nextid.freecure = 0;
  nextid.regen = 1;
  nextid.aero = 2;
  nextid.assize = 3;
  nextid.divinebenison = 4;
  nextid.tetragrammaton = 5;
  nextid.benediction = 6;
  nextid.asylum = 7;
  nextid.luciddreaming = 10;
  nextid.thinair = 10;
  nextid.presenceofmind = 11;

  countdownid.regen = 0;
  countdownid.aero = 0;

  // Set up icons
  if (player.level >= 72) {
    icon.aero = icon.dia;
  }
  else if (player.level >= 46) {
    icon.aero = icon.aero2;
  }
  else {
    icon.aero = "000401";
  }

  if (checkStatus("freecure", player.ID) > 0) {
    addIcon("freecure");
  }
  else {
    removeIcon(nextid.freecure)
  }

  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.8
  && checkRecast("luciddreaming") < 0) {
    addIcon("luciddreaming");
  }
  else if (player.level >= 58
  && player.currentMP / player.maxMP < 0.8
  && checkRecast("thinair") < 0) {
    addIcon("thinair");
  }
  else {
    removeIcon(nextid.luciddreaming)
  }

  if (player.level >= 30
  && checkRecast("presenceofmind") < 0) {
    addIcon("presenceofmind");
  }
  else {
    removeIcon(nextid.presenceofmind)
  }

  if (player.level >= 50
  && checkRecast("benediction") < 0) {
    addIcon("benediction");
  }
  else {
    removeIcon(nextid.benediction)
  }

  if (player.level >= 52
  && checkRecast("asylum") < 0) {
    addIcon("asylum");
  }
  else {
    removeIcon(nextid.asylum)
  }

  if (player.level >= 56
  && checkRecast("assize") < 0) {
    addIcon("assize");
  }
  else {
    removeIcon(nextid.assize)
  }

  if (player.level >= 60
  && checkRecast("tetragrammaton") < 0) {
    addIcon("tetragrammaton");
  }
  else {
    removeIcon(nextid.tetragrammaton)
  }

  if (player.level >= 66
  && checkRecast("divinebenison") < 0) {
    addIcon("divinebenison");
  }
  else {
    removeIcon(nextid.divinebenison)
  }
}

function whmPlayerChangedEvent() {

  // MP recovery - Lucid and Thin Air share same spot
  if (player.level >= 24
  && player.currentMP / player.maxMP < 0.8
  && checkRecast("luciddreaming") < 0) {
    addIcon("luciddreaming");
  }
  else if (player.level >= 58
  && player.currentMP / player.maxMP < 0.8
  && checkRecast("thinair") < 0) {
    addIcon("thinair");
  }
  else {
    removeIcon("luciddreaming");
  }
}

function whmTargetChangedEvent() {

  // Ideally tries to keep Regen up on player tank characters
//   if (player.level >= 35
//   && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1
//   && checkStatus("regen", target.ID) < 0) {
//     addIcon("regen");
//   }
//   else {
//     removeIcon(nextid.regen)
//   }

  if (previous.targetID != target.ID) {

    // 0 = no target, 1... = player? E... = non-combat NPC?
    if (target.ID.startsWith("1")
    && ["PLD", "WAR", "DRK", "GNB"].indexOf(target.job) > -1) {
      addCountdownBar("regen", checkStatus("regen", target.ID), "icon");
    }
    else if (target.ID.startsWith("4")) {
      addCountdownBar("aero", checkStatus("aero", target.ID), "icon");
    }
    else {
      removeCountdownBar("aero");
    }
    previous.targetID = target.ID;
  }
}

function whmAction() {

  if (actionList.whm.indexOf(actionGroups.actionname) > -1) {

    if (actionGroups.actionname == "Lucid Dreaming") {
      removeIcon("luciddreaming");
      addRecast("luciddreaming");
    }

    else if (actionGroups.actionname == "Presence Of Mind") {
      removeIcon("presenceofmind");
      addRecast("presenceofmind");
    }

    else if (actionGroups.actionname == "Benediction") {
      removeIcon("benediction");
      addRecast("benediction");
    }

    else if (actionGroups.actionname == "Asylum") {
      removeIcon("asylum");
      addRecast("asylum");
    }

    else if (actionGroups.actionname == "Assize") {
      removeIcon("assize");
      addRecast("assize");
    }

    else if (actionGroups.actionname == "Thin Air") {
      removeIcon("thinair");
      addRecast("thinair");
    }

    else if (actionGroups.actionname == "Tetragrammaton") {
      removeIcon("tetragrammaton");
      addRecast("tetragrammaton");
    }

    else if (actionGroups.actionname == "Divine Benison") {
      removeIcon("divinebenison");
      addRecast("divinebenison");
    }

    else if (actionGroups.actionname == "Regen") {
      removeIcon("regen");
      addCountdownBar("aero", checkStatus("aero", target.ID), "icon");
      addStatus("regen", duration.regen, actionGroups.targetID);
    }

    else if (["Aero", "Aero II", "Dia"].indexOf(actionGroups.actionname) > -1) {
      removeIcon("aero");
      addCountdownBar("aero", checkStatus("aero", target.ID), "icon");
      addStatus("aero", duration.aero, actionGroups.targetID);
    }
  }
}

function whmStatus() {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Freecure") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("freecure", parseInt(statusGroups.duration) * 1000);
        addIcon("freecure");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("freecure");
        removeIcon("freecure");
      }
    }
  }

  else {

    if (statusGroups.statusname == "Regen") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("regen", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        removeIcon("regen");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("regen", statusGroups.targetID);
      }
    }

    else if (["Aero", "Aero II", "Dia"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("aero", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        removeIcon("aero");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("aero", statusGroups.targetID);
      }
    }
  }
}

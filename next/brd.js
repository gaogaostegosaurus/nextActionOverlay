"use strict";

actionList.brd = [
  "Heavy Shot", "Straight Shot", "Venomous Bite", "Windbite", "Iron Jaws", "Caustic Bite", "Stormbite", "Refulgent Arrow",
  "Quick Nock",
  "Raging Strikes", "Barrage", "Battle Voice", "The Wanderer\'s Minuet", "Empyreal Arrow", "Sidewinder",
  "Mage\'s Ballad", "Army\'s Paeon",
];

function brdJobChange() {

  nextid.ironjaws = 0;
  nextid.windbite = 1;
  nextid.venomousbite = 2;
  nextid.straightshot = 3;
  nextid.refulgentarrow = nextid.straightshot;
  nextid.heavyshot = 4;
  nextid.burstshot = nextid.heavyshot;
  nextid.quicknock = nextid.heavyshot;
  nextid.ballad = 10;
  nextid.paeon = nextid.ballad;
  nextid.minuet = nextid.ballad;
  nextid.ragingstrikes = 11;
  nextid.barrage = 12;
  nextid.pitchperfect = 13;
  nextid.empyrealarrow = 14;
  nextid.sidewinder = 15;
  nextid.shadowbite = nextid.sidewinder;

  countdownid.ironjaws = 0;
  countdownid.windbite = 0;
  countdownid.venomousbite = 1;
  countdownid.paeon = countdownid.ballad;
  countdownid.ballad = 2;
  countdownid.paeon = 3;
  countdownid.minuet = 4;
  countdownid.empyrealarrow = 5;
  countdownid.ragingstrikes = 6;
  countdownid.barrage = 7;
  countdownid.sidewinder = 8;
  countdownid.shadowbite = countdownid.sidewinder;

  if (player.level >= 64) {
    icon.venomousbite = icon.causticbite;
    icon.windbite = icon.stormbite;
  }
  else {
    icon.venomousbite = "000363";
    icon.windbite = "000367";
  }

  if (player.level >= 70) {
    icon.straightshot = icon.refulgentarrow;
  }
  else {
    icon.straightshot = "000359";
  }

  if (player.level >= 76) {
    icon.heavyshot = icon.burstshot;
  }
  else {
    icon.heavyshot = "000358";
  }

  previous.empyrealarrow = 0;
  previous.quicknock = 0;
  previous.rainofdeath = 0;
  previous.shadowbite = 0;
  previous.apexarrow = 0;
}


function brdPlayerChangedEvent() {

  // Pitch Perfect
  if (previous.song == "minuet") {
    if (player.jobDetail.songProcs == 3) {
      addIcon("pitchperfect");
    }
    else if (player.jobDetail.songProcs > 0
    && player.jobDetail.songMilliseconds < 3000) {
      addIcon("pitchperfect");
    }
    else {
      removeIcon("pitchperfect");
    }
  }
  else {
    removeIcon("pitchperfect");
  }

  // Don't use EA without song after 68
  if (player.level >= 68
  && player.jobDetail.songMilliseconds <= 0) {
    removeCountdownBar("empyrealarrow");
  }
}

function brdTargetChangedEvent() { // Checks DoTs after switching targets
  if (previous.targetID != target.ID) { // Prevent this from repeatedly being called on movement or whatever

    // If not a target then clear things out
    if (target.ID == 0 || target.ID.startsWith("1") || target.ID.startsWith("E")) {  // 0 = no target, 1... = player? E... = non-combat NPC?
      removeCountdownBar("venomousbite");
      removeCountdownBar("windbite");
    }

    // else if (player.level >= 54
    // && Math.min(checkStatus("venomousbite", target.ID), checkStatus("windbite", target.ID)) > 0) {
    //   removeCountdownBar("windbite");
    //   removeCountdownBar("venomousbite");
    //   addCountdownBar("ironjaws", Math.min(checkStatus("venomousbite", target.ID), checkStatus("windbite", target.ID)));
    //   // addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", target.ID), checkStatus("windbite", target.ID)) - 5000, nextid.ironjaws, icon.ironjaws);
    // }

    else {
      addCountdownBar("venomousbite", checkStatus("venomousbite", target.ID));
      if (player.level >= 18) {
        addCountdownBar("windbite", checkStatus("windbite", target.ID));
      }
    }
    previous.targetID = target.ID;
  }
}

function brdAction() {

  // statustime added to actions because just going by buff gain/loss lines is super slow

  if (["Straight Shot", "Refulgent Arrow"].indexOf(actionGroups.actionname) > -1) {
    removeIcon("straightshot");
  }

  else if (["Venomous Bite", "Caustic Bite"].indexOf(actionGroups.actionname) > -1
  && actionGroups.result.length > 2) {
    addStatus("venomousbite", duration.venomousbite, actionGroups.targetID);
    addCountdownBar("venomousbite", checkStatus("venomousbite", actionGroups.targetID));
    // if (player.level >= 54
    // && checkStatus("windbite", actionGroups.targetID) > 0) {
    //   addCountdownBar("windbite", )
    // }
    // else {
    //   removeIcon("ironjaws");
    //   clearTimeout(timeout.ironjaws);
    //   addIconBlinkTimeout("venomousbite", 30000, nextid.venomousbite, icon.venomousbite);
    // }
  }

  else if (["Windbite", "Stormbite"].indexOf(actionGroups.actionname) > -1
  && actionGroups.result.length > 2) {
    addStatus("windbite", duration.windbite, actionGroups.targetID);
    addCountdownBar("windbite", checkStatus("windbite", actionGroups.targetID));
    // if (player.level >= 54
    // && checkStatus("venomousbite", actionGroups.targetID) > 0) {
    //   removeIcon("venomousbite");
    //   clearTimeout(timeout.venomousbite);
    //   clearTimeout(timeout.windbite);
    //   addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", actionGroups.targetID), checkStatus("windbite", actionGroups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
    // }
    // else {
    //   removeIcon("ironjaws");
    //   clearTimeout(timeout.ironjaws);
    //   addIconBlinkTimeout("windbite", 30000, nextid.windbite, icon.windbite);
    // }
  }

  else if ("Iron Jaws" == actionGroups.actionname) {
    // removeIcon("ironjaws");
    // if (checkStatus("venomousbite", actionGroups.targetID) > 0
    // && checkStatus("windbite", actionGroups.targetID) > 0) {
    //   addStatus("venomousbite", 30000, actionGroups.targetID);
    //   addStatus("windbite", 30000, actionGroups.targetID);
    //   // removeIcon("venomousbite");
    //   // removeIcon("windbite");
    //   // clearTimeout(timeout.venomousbite);
    //   // clearTimeout(timeout.windbite);
    //   // addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", actionGroups.targetID), checkStatus("windbite", actionGroups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
    // }
    if (checkStatus("venomousbite", actionGroups.targetID) > 0) {
      addStatus("venomousbite", duration.venomousbite, actionGroups.targetID);
      addCountdownBar("venomousbite", checkStatus("venomousbite", actionGroups.targetID));
      // removeIcon("venomousbite");
      // clearTimeout(timeout.ironjaws);
      // addIconBlinkTimeout("venomousbite", 30000, nextid.venomousbite, icon.venomousbite);
    }
    if (checkStatus("windbite", actionGroups.targetID) > 0) {
      addStatus("windbite", duration.windbite, actionGroups.targetID);
      addCountdownBar("windbite", checkStatus("windbite", actionGroups.targetID));
      // removeIcon("windbite");
      // clearTimeout(timeout.ironjaws);
      // addIconBlinkTimeout("windbite", 30000, nextid.windbite, icon.windbite);
    }
  }

  else if ("Quick Nock" == actionGroups.actionname) {
    if (Date.now() - previous.quicknock > 1000) {
      previous.quicknock = Date.now();
      count.aoe = 1;
    }
    else {
      count.aoe = count.aoe + 1;
    }
  }

  else if ("Rain Of Death" == actionGroups.actionname) {
    if (Date.now() - previous.rainofdeath > 1000) {
      previous.rainofdeath = Date.now();
      count.aoe = 1;
    }
    else {
      count.aoe = count.aoe + 1;
    }
  }

  else if ("Raging Strikes" == actionGroups.actionname) {
    addCountdownBar("ragingstrikes");
    // addIconBlinkTimeout("ragingstrikes",recast.ragingstrikes,nextid.ragingstrikes,icon.ragingstrikes);
    // if (player.level >= 38
    // && checkStatus("straightshotready") < 0) {
    //   addIconBlinkTimeout("barrage", checkCooldown("barrage"), nextid.barrage, icon.barrage);
    // }
  }

  else if ("Barrage" == actionGroups.actionname) {
    addCountdownBar("barrage");
  }

  else if ("Battle Voice" == actionGroups.actionname) {
    addCountdownBar("battlevoice");
    // addRecast("battlevoice");
    // removeIcon("battlevoice");
    // addIconBlinkTimeout("battlevoice",recast.battlevoice,nextid.battlevoice,icon.battlevoice);
  }

  else if ("Sidewinder" == actionGroups.actionname) {
    addCountdownBar("sidewinder");
    // addRecast("sidewinder");
    // removeIcon("sidewinder");
    // addIconBlinkTimeout("sidewinder",recast.sidewinder,nextid.sidewinder,icon.sidewinder);
  }

  else if ("Shadowbite" == actionGroups.actionname) {
    addCountdownBar("sidewinder");
    // addRecast("sidewinder"); // Same cooldown as SW
    // removeIcon("sidewinder");
    // addIconBlinkTimeout("sidewinder",recast.sidewinder,nextid.sidewinder,icon.sidewinder);
    if (Date.now() - previous.shadowbite > 1000) {
      previous.shadowbite = Date.now();
      count.aoe = 1;
    }
    else {
      count.aoe = count.aoe + 1;
    }
  }

  else if ("Mage's Ballad" == actionGroups.actionname) {
    addCountdownBar("ballad");
    // removeIcon("ballad");
    // addRecast("ballad");
    // addStatus("song", 30000);
    // previous.song = "ballad";
    // if (player.level >= 52) {
    //   if (count.aoe > 6) {
    //     if (checkCooldown("paeon") <= checkCooldown("minuet")) {
    //       addIconBlinkTimeout("paeon", Math.max(checkCooldown("paeon"), 30000), nextid.paeon, icon.paeon);
    //     }
    //     else {
    //       addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet"), 30000), nextid.minuet, icon.minuet);
    //     }
    //   }
    //   else {
    //     if (checkCooldown("minuet") <= checkCooldown("paeon")) {
    //       addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet"), 30000), nextid.minuet, icon.minuet);
    //     }
    //     else {
    //       addIconBlinkTimeout("paeon", Math.max(checkCooldown("paeon"), 30000), nextid.paeon, icon.paeon);
    //     }
    //   }
    // }
    // else if (player.level >= 40) {
    //   addIconBlinkTimeout("paeon", Math.max(checkCooldown("paeon"), 30000), nextid.paeon, icon.paeon);
    // }
    // else {
    //   addIconBlinkTimeout("ballad", checkCooldown("ballad"), nextid.ballad, icon.ballad);
    // }
    if (player.level >= 68) {
      addCountdownBar("empyrealarrow", checkCooldown("empyrealarrow"));
      // addIconTimeout("empyrealarrow",checkCooldown("empyrealarrow"),nextid.empyrealarrow,icon.empyrealarrow);
    }
  }

  else if ("Army's Paeon" == actionGroups.actionname) {
    addCountdownBar("paeon");
    // removeIcon("paeon");
    // addRecast("paeon");
    // addStatus("song", 30000);
    // previous.song = "paeon";
    // if (player.level >= 52) {
    //   if (count.aoe > 2) { // Min AP time for 3-6 targets
    //     if (checkCooldown("ballad") <= checkCooldown("minuet")) {
    //       addIconBlinkTimeout("ballad", Math.max(checkCooldown("ballad"), checkCooldown("minuet") - 30000, 20000), nextid.ballad, icon.ballad);
    //     }
    //     else {
    //       if (count.aoe > 6) { // Max AP time if many targets
    //         addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet"), 30000), nextid.minuet, icon.minuet);
    //       }
    //       else { // Min AP time if 1-2 targets
    //         addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet"), checkCooldown("ballad") - 30000, 20000), nextid.minuet, icon.minuet);
    //       }
    //     }
    //   }
    //   else {
    //     if (checkCooldown("minuet") <= checkCooldown("ballad")) {
    //       addIconBlinkTimeout("minuet", Math.max(checkCooldown("minuet"), checkCooldown("ballad") - 30000, 20000), nextid.minuet, icon.minuet);
    //     }
    //     else {
    //       addIconBlinkTimeout("ballad", Math.max(checkCooldown("ballad"), checkCooldown("minuet") - 30000, 20000), nextid.ballad, icon.ballad);
    //     }
    //   }
    // }
    // else {
    //   addIconBlinkTimeout("ballad", Math.max(checkCooldown("ballad"), 30000), nextid.ballad, icon.ballad);
    // }
    if (player.level >= 68) {
      addCountdownBar("empyrealarrow", checkCooldown("empyrealarrow"));
    }
  }

  else if ("The Wanderer's Minuet" == actionGroups.actionname) {
    addCountdownBar("paeon");
    // removeIcon("minuet");
    // addRecast("minuet");
    // addStatus("song", 30000);
    // previous.song = "minuet";
    // if (checkCooldown("ballad") <= checkCooldown("paeon")) { // Mage's always beats Paeon
    //   addIconBlinkTimeout("ballad", Math.max(checkCooldown("ballad"), 30000), nextid.ballad, icon.ballad); // Revisit for optimization at high targets?
    // }
    // else {
    //   addIconBlinkTimeout("paeon", Math.max(checkCooldown("paeon"), 30000), nextid.paeon, icon.paeon);
    // }
    if (player.level >= 68) {
      addCountdownBar("empyrealarrow", checkCooldown("empyrealarrow"));
    }
  }

  else if ("Empyreal Arrow" == actionGroups.actionname) {
    if (recast.empyrealarrow > Date.now() - previous.empyrealarrow) {
      recast.empyrealarrow = Date.now() - previous.empyrealarrow;
    }
    previous.empyrealarrow = Date.now();
    // removeIcon("empyrealarrow");
    // addRecast("empyrealarrow");
    addCountdownBar("empyrealarrow");
    // if (player.level >= 68) {
    //   if (checkStatus("song", player.ID) > recast.empyrealarrow) { // Check if EA should be reused within song duration
    //     addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
    //   }
    // }
    // else {
    //   addIconTimeout("empyrealarrow",recast.empyrealarrow,nextid.empyrealarrow,icon.empyrealarrow);
    // }
  }
}


function brdStatus() {

  if (statusGroups.targetID == player.ID) {

    if (statusGroups.statusname == "Straight Shot Ready") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("straightshotready", parseInt(statusGroups.duration) * 1000);
        addIcon("straightshot");
        // removeIcon("barrage");
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("straightshotready");
        removeIcon("straightshot");
        // addIconBlinkTimeout("barrage", checkCooldown("barrage"), nextid.barrage, icon.barrage);
      }
    }

    else if (statusGroups.statusname == "Raging Strikes") {
      if (statusGroups.gainsloses == "gains") {
        addStatus("ragingstrikes", parseInt(statusGroups.duration) * 1000);
      }
      else if (statusGroups.gainsloses == "loses") {
        removeStatus("ragingstrikes");
      }
    }
  }

  else {

    if (["Venomous Bite", "Caustic Bite"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("venomousbite", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        if (target.ID == statusGroups.targetID) {  // Might be possible to switch targets during this
          addCountdownBar("venomousbite", checkStatus("venomousbite", target.ID));
        }
        // if (player.level >= 54
        // && checkStatus("windbite", statusGroups.targetID) > 0) {
        //   clearTimeout(timeout.venomousbite);
        //   clearTimeout(timeout.windbite);
        //   addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", statusGroups.targetID), checkStatus("windbite", statusGroups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
        // }
        // else {
        //   removeIcon("ironjaws");
        //   clearTimeout(timeout.ironjaws);
        //   addIconBlinkTimeout("venomousbite", 30000, nextid.venomousbite, icon.venomousbite);
        // }
      }
      // else if (statusGroups.gainsloses == "loses"
      // && target.ID == statusGroups.targetID) {
      //   removeIcon("ironjaws");
      //   clearTimeout(timeout.venomousbite);
      //   clearTimeout(timeout.ironjaws);
      //   addIcon("venomousbite");
      // }
    }

    else if (["Windbite", "Stormbite"].indexOf(statusGroups.statusname) > -1) {
      if (statusGroups.gainsloses == "gains") {
        addStatus("windbite", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        if (target.ID == statusGroups.targetID) {  // Might be possible to switch targets during this
          addCountdownBar("windbite", checkStatus("windbite", target.ID));
        }
        // removeIcon("windbite");
        // addStatus("windbite", parseInt(statusGroups.duration) * 1000, statusGroups.targetID);
        // if (player.level >= 54
        // && checkStatus("venomousbite", statusGroups.targetID) > 0) {
        //   clearTimeout(timeout.venomousbite);
        //   clearTimeout(timeout.windbite);
        //   addIconBlinkTimeout("ironjaws", Math.min(checkStatus("venomousbite", statusGroups.targetID), checkStatus("windbite", statusGroups.targetID)) - 5000, nextid.ironjaws, icon.ironjaws);
        // }
        // else {
        //   removeIcon("ironjaws");
        //   clearTimeout(timeout.ironjaws);
        //   addIconBlinkTimeout("windbite", 30000, nextid.windbite, icon.windbite);
        // }
      }
      // else if (statusGroups.gainsloses == "loses"
      // && target.ID == statusGroups.targetID) {
      //   removeIcon("ironjaws");
      //   clearTimeout(timeout.windbite);
      //   clearTimeout(timeout.ironjaws);
      //   addIcon("windbite");
      // }
    }
  }
}

'use strict';

// To do: clearer indication of when TCJ / Mudra is active


const ninActions = [
  // Off GCD
  'Shade Shift', 'Hide', 'Mug', 'Trick Attack', 'Shukuchi', 'Kassatsu', 'Dream Within A Dream',
  'Assassinate', 'Hellfrog Medium', 'Bhavacakra', 'Ten Chi Jin', 'Meisui', 'Bunshin',

  // GCD
  'Spinning Edge', 'Gust Slash', 'Shadow Fang', 'Throwing Dagger', 'Aeolian Edge', 'Armor Crush',
  'Death Blossom', 'Hakke Mujinsatsu',

  // Ninjutsu
  'Ninjutsu', 'Fuma Shuriken', 'Katon', 'Raiton', 'Hyoton', 'Huton', 'Doton', 'Suiton',
  'Goka Mekkyaku', 'Hyosho Ranyu',
  // Code currently doesn't use mudra or most ninjutsu for decision-making
  // "Ten", "Chi", "Jin", "Fuma Shuriken",  "Hyoton", "Huton", "Doton",

  // Role
  'Second Wind', 'Leg Sweep', 'Bloodbath', 'Feint', 'Arm\'s Length', 'True North',
];

const ninPushMug = ({ array = actionArray } = {}) => {
  array.push({ name: 'mug', img: 'mug', size: 'small' });
  next.mugRecast = recast.mug + next.elapsedTime;
  if (player.level >= 66) {
    next.ninki = Math.min(next.ninki + 40, 100);
  }
};

const ninPushTrickAttack = ({ array = actionArray } = {}) => {
  if (player.level >= 80 && next.bunshinRecast - next.elapsedTime < 0) {
    return;
  }
  array.push({ name: 'trickattack', img: 'trickattack', size: 'small' });
  next.trickattackRecast = recast.trickattack + next.elapsedTime;
  next.trickattackStatus = duration.trickattack + next.elapsedTime;
  next.suitonStatus = -1;
};

const ninPushKassatsu = ({ array = actionArray } = {}) => {
  array.push({ name: 'kassatsu', img: 'kassatsu', size: 'small' });
  next.kassatsuRecast = recast.kassatsu + next.elapsedTime;
  next.kassatsuStatus = duration.kassatsu + next.elapsedTime;
};

const ninPushDreamWithinaDream = ({ array = actionArray } = {}) => {
  array.push({ name: 'dreamwithinadream', img: 'dreamwithinadream', size: 'small' });
  next.dreamwithinadreamRecast = recast.dreamwithinadream + next.elapsedTime;
  if (player.level >= 60) {
    next.assassinatereadyStatus = duration.assassinateready + next.elapsedTime;
  }
};

const ninPushAssassinate = ({ array = actionArray } = {}) => {
  array.push({ name: 'assassinate', img: 'assassinate', size: 'small' });
  next.assassinatereadyStatus = -1;
};

const ninPushBhavacakra = ({ array = actionArray } = {}) => {
  array.push({ name: 'bhavacakra', img: 'bhavacakra', size: 'small' });
  next.ninki -= 50;
};

const ninPushHellfrogMedium = ({ array = actionArray } = {}) => {
  array.push({ name: 'hellfrogmedium', img: 'hellfrogmedium', size: 'small' });
  next.ninki -= 50;
};

const ninPushTenChiJin = ({ array = actionArray } = {}) => {
  array.push({ name: 'tenchijin', img: 'tenchijin', size: 'small' });
  next.tenchijinRecast = recast.tenchijin + next.elapsedTime;
  next.tenchijinStatus = duration.tenchijin + next.elapsedTime;
  ninPushNinjutsu();
};

const ninPushMeisui = ({ array = actionArray } = {}) => {
  array.push({ name: 'meisui', img: 'meisui', size: 'small' });
  next.meisuiRecast = recast.meisui + next.elapsedTime;
  next.ninki = Math.min(next.ninki + 50, 100);
  next.suitonStatus = -1;
};

const ninPushBunshin = ({ array = actionArray } = {}) => {
  array.push({ name: 'bunshin', img: 'bunshin', size: 'small' });
  next.bunshinRecast = recast.bunshin + next.elapsedTime;
  next.bunshinStatus = duration.bunshin + next.elapsedTime;
  next.ninki -= 50;
};

const ninPushWeave = ({
  array = actionArray,
} = {}) => {
  if (player.level >= 80 && next.ninki >= 50
    && next.trickattackRecast - next.elapsedTime < 15000
    && next.bunshinRecast - next.elapsedTime < 0) {
    ninPushBunshin();
  } else if (player.level >= 70 && next.trickattackStatus - next.elapsedTime > 0
    && next.kassatsuStatus - next.elapsedTime < 0
    && next.tenchijinRecast - next.elapsedTime < 0) {
    ninPushTenChiJin();
  } else if (player.level >= 50 && next.trickattackRecast - next.elapsedTime < 20000
    && next.suitonStatus - next.elapsedTime > 0
    && next.kassatsuRecast - next.elapsedTime < 0) {
    ninPushKassatsu();
  } else if (player.level >= 45 && next.suitonStatus - next.elapsedTime > 0
    && next.suitonStatus - next.elapsedTime > 0
    && next.trickattackRecast - next.elapsedTime < 0) {
    ninPushTrickAttack();
  } else if (next.trickattackStatus - next.elapsedTime > 0
    && next.assassinatereadyStatus - next.elapsedTime > 0) {
    ninPushAssassinate();
  } else if (player.level >= 56 && next.trickattackStatus - next.elapsedTime > 0
    && next.dreamwithinadreamRecast - next.elapsedTime > 0) {
    ninPushDreamWithinaDream();
  } else if (player.level >= 72 && next.ninki < 50 && next.suitonStatus - next.elapsedTime > 0
    && next.meisuiRecast - next.elapsedTime < 0) {
    ninPushMeisui();
  } else if (player.level >= 66 && next.mugRecast - next.elapsedTime < 0 && next.ninki < 60) {
    ninPushMug();
  } else if (player.level >= 68 && next.ninki >= 50 + next.ninkiFloor && count.targets === 1) {
    ninPushBhavacakra();
  } else if (player.level >= 62 && next.ninki >= 50 + next.ninkiFloor && count.targets > 1) {
    ninPushHellfrogMedium();
  } else if (player.level < 66 && next.mugRecast - next.elapsedTime < 0) {
    ninPushMug();
  }
};

const ninPushNinjutsu = ({
  array = actionArray,
} = {}) => {
  if (next.kassatsuStatus - next.elapsedTime > 0) {
    // Use with Kassatsu
    if (player.level >= 35 && count.targets > 1) {
      // Katon / Goka
      ninPushKaton();
    } else if (player.level >= 35 && next.trickattackStatus - next.elapsedTime > 0) {
      // Raiton / Hyosho
      ninPushRaiton();
    }
  } else if (next.tenchijinStatus - next.elapsedTime > 0) {
    // Use with TCJ
    if (player.level >= 45 && next.trickattackRecast - next.elapsedTime < 20000 + 500 * 3 + 1500) {
      // Suiton for upcoming Trick
      ninPushSuiton();
    } else if (player.level >= 72
      && next.meisuiRecast - next.elapsedTime < 20000 + 500 * 3 + 1500) {
      // Suiton for upcoming Meisui
      ninPushSuiton();
    } else {
      ninPushSuiton(); // Probably change this later...
    }
  } else if (player.level >= 45 && next.mudra1Recast - next.elapsedTime < 0
    && next.hutonStatus - next.elapsedTime < 500 * 3) {
    ninPushHuton();
  } else if (player.level >= 45
    && next.trickattackRecast - next.elapsedTime < 20000 + 500 * 3 + 1500
    && next.mudra1Recast - next.elapsedTime < 0) {
    ninPushSuiton();
  } else if (player.level >= 72
    && next.meisuiRecast - next.elapsedTime < 20000 + 500 * 3 + 1500
    && next.mudra1Recast - next.elapsedTime < 0) {
    ninPushSuiton();
  } else if (next.mudra2Recast - next.elapsedTime < 500 * 2 + 1500) {
    // Prevent capping
    if (player.level >= 35 && count.targets > 1) {
      // Katon
      ninPushKaton();
      next.elapsedTime += 500 * 2 + 1500;
      ninPushWeave();
    } else if (player.level >= 35) {
      // Raiton
      ninPushRaiton();
      next.elapsedTime += 500 * 2 + 1500;
      ninPushWeave();
    } else {
      // Fuma
      ninPushFumaShuriken();
      next.elapsedTime += 500 * 2 + 1500;
      ninPushWeave();
    }
  }
};

const ninPushMelee = ({
  array = actionArray,
} = {}) => {
  ninPushNinjutsu();
  if (player.level >= 45 && next.trickattackStatus - next.elapsedTime > 0
    && next.shadowfangRecast - next.elapsedTime < 0) {
    // Apply while trick is up
    ninPushShadowFang();
  } else if (player.level < 45 && next.shadowfangRecast - next.elapsedTime < 0) {
    // Apply while trick is up
    ninPushShadowFang();
  } else if (player.level >= 56 && next.hutonStatus - next.elapsedTime < 40000 + recast.gcd * 2
    && next.hutonStatus - next.elapsedTime > 0 + recast.gcd * 2) {
    ninPushArmorCrush();
  } else {
    ninPushAeolianEdge();
  }
};

const ninPushAeolianEdge = ({ array = actionArray } = {}) => {
  array.push({ name: 'spinningedge', img: 'spinningedge' });
  next.ninki = Math.min(next.ninki + 5, 100);
  next.elapsedTime += recast.gcd;
  ninPushWeave();
  array.push({ name: 'gustslash', img: 'gustslash' });
  next.ninki = Math.min(next.ninki + 5, 100);
  next.elapsedTime += recast.gcd;
  ninPushWeave();
  if (player.level >= 26) {
    array.push({ name: 'aeolianedge', img: 'aeolianedge' }); // Add Armor Crush
    if (player.level >= 78) {
      next.ninki = Math.min(next.ninki + 10, 100);
    } else {
      next.ninki = Math.min(next.ninki + 5, 100);
    }
    next.elapsedTime += recast.gcd;
    ninPushWeave();
  }
};

const ninPushArmorCrush = ({ array = actionArray } = {}) => {
  array.push({ name: 'spinningedge', img: 'spinningedge' });
  next.ninki = Math.min(next.ninki + 5, 100);
  next.elapsedTime += recast.gcd;
  ninPushWeave();
  array.push({ name: 'gustslash', img: 'gustslash' });
  next.ninki = Math.min(next.ninki + 5, 100);
  next.elapsedTime += recast.gcd;
  ninPushWeave();
  array.push({ name: 'armorcrush', img: 'armorcrush' }); // Add Armor Crush
  if (player.level >= 78) {
    next.ninki = Math.min(next.ninki + 10, 100);
  } else {
    next.ninki = Math.min(next.ninki + 5, 100);
  }
  next.hutonStatus = Math.min(next.hutonStatus + duration.armorcrush,
    duration.huton + next.elapsedTime);
  next.elapsedTime += recast.gcd;
  ninPushWeave();
};

const ninPushShadowFang = ({ array = actionArray } = {}) => {
  array.push({ name: 'shadowfang', img: 'shadowfang' });
  next.shadowfangRecast = recast.shadowfang + next.elapsedTime;
  next.shadowfangStatus = duration.shadowfang + next.elapsedTime;
  if (player.level >= 78) {
    next.ninki = Math.min(next.ninki + 10, 100);
  } else {
    next.ninki = Math.min(next.ninki + 5, 100);
  }
  next.elapsedTime += recast.gcd;
  ninPushWeave();
};

const ninMudraUsed = ({ array = actionArray } = {}) => {
  if (next.kassatsuStatus - next.elapsedTime > 0) {
    next.kassatsuStatus = -1;
  } else if (next.tenchijinStatus - next.elapsedTime > 0) {
    next.tenchijinStatus = -1;
  } else if (next.mudra2Recast < 0) {
    next.mudra2Recast = recast.mudra2 + next.elapsedTime;
  } else {
    next.mudra1Recast = next.mudra2Recast;
    next.mudra2Recast = next.mudra2Recast + recast.mudra2 + next.elapsedTime;
  }
};

const ninPushFumaShuriken = ({ array = actionArray } = {}) => {
  array.push({ name: 'ten', img: 'ten' });
  array.push({ name: 'fumashuriken', img: 'fumashuriken' });
  ninMudraUsed();
  next.elapsedTime += 500 * 1 + 1500;
  ninPushWeave();
};

const ninPushKaton = ({ array = actionArray } = {}) => {
  if (next.kassatsuStatus - next.elapsedTime > 500 * 2) {
    array.push({ name: 'chi', img: 'chi' });
    array.push({ name: 'ten', img: 'ten' });
    array.push({ name: 'gokamekkyaku', img: 'gokamekkyaku' });
  } else {
    array.push({ name: 'chi', img: 'chi' });
    array.push({ name: 'ten', img: 'ten' });
    array.push({ name: 'katon', img: 'katon' });
  }
  ninMudraUsed();
  next.elapsedTime += 500 * 2 + 1500;
  ninPushWeave();
};

const ninPushRaiton = ({ array = actionArray } = {}) => {
  // Covers Hyosho as well
  if (next.kassatsuStatus - next.elapsedTime > 500 * 2) {
    array.push({ name: 'ten', img: 'ten' });
    array.push({ name: 'jin', img: 'jin' });
    array.push({ name: 'hyoshoranyu', img: 'hyoshoranyu' });
  } else {
    array.push({ name: 'ten', img: 'ten' });
    array.push({ name: 'chi', img: 'chi' });
    array.push({ name: 'raiton', img: 'raiton' });
  }
  ninMudraUsed();
  next.elapsedTime += 500 * 2 + 1500;
  ninPushWeave();
};

const ninPushHuton = ({ array = actionArray } = {}) => {
  array.push({ name: 'chi', img: 'chi' });
  array.push({ name: 'jin', img: 'jin' });
  array.push({ name: 'ten', img: 'ten' });
  array.push({ name: 'huton', img: 'huton' });
  ninMudraUsed();
  next.elapsedTime += 500 * 3 + 1500;
  next.hutonStatus = 70000 + next.elapsedTime;
  ninPushWeave();
};

const ninPushSuiton = ({ array = actionArray } = {}) => {
  array.push({ name: 'ten', img: 'ten' });
  array.push({ name: 'chi', img: 'chi' });
  array.push({ name: 'jin', img: 'jin' });
  array.push({ name: 'suiton', img: 'suiton' });
  ninMudraUsed();
  next.elapsedTime += 500 * 3 + 1500;
  next.suitonStatus = 20000 + next.elapsedTime;
  ninPushWeave();
};

const ninNext = ({
  time = 2500,
} = {}) => {
  //
  let array = actionArray;

  next.shadowfangRecast = checkRecast({ name: 'shadowfang' });
  //
  next.bunshinRecast = checkRecast({ name: 'bunshin' });
  next.meisuiRecast = checkRecast({ name: 'meisui' });
  next.tenchijinRecast = checkRecast({ name: 'tenchijin' });
  next.dreamwithinadreamRecast = checkRecast({ name: 'dreamwithinadream' });
  next.kassatsuRecast = checkRecast({ name: 'kassatsu' });
  next.mudra2Recast = checkRecast({ name: 'mudra2' });
  next.mudra1Recast = checkRecast({ name: 'mudra1' });
  next.trickattackRecast = checkRecast({ name: 'trickattack' });
  next.mugRecast = checkRecast({ name: 'mug' });
  //
  next.assassinatereadyStatus = checkStatus({ name: 'assassinateready' });
  next.kassatsuStatus = checkStatus({ name: 'kassatsu' });
  next.suitonStatus = checkStatus({ name: 'suiton' });
  next.hutonStatus = 0;
  // next.hutonStatus = player.jobDetail.hutonMilliseconds;

  next.ninki = player.jobDetail.ninkiAmount;

  next.elapsedTime = time;
  if (player.level >= 80) {
    if (next.bunshinRecast < next.meisuiRecast) {
      next.ninkiFloor = 0;
    } else if (next.bunshinRecast < next.mugRecast) {
      next.ninkiFloor = 10;
    } else {
      next.ninkiFloor = 50;
    }
  } else {
    next.ninkiFloor = 0;
  }


  do {



    ninPushNinjutsu();
    ninPushMelee();
    // Adjust all cooldown/status info
  } while (next.elapsedTime < 150000);
  console.log(JSON.stringify(actionArray));
  syncIcons();
};

const ninOnJobChange = () => {

  ninNext();
};

const ninOnTargetChangedEvent = () => {
  if (previous.targetID !== target.ID
  && !toggle.combo) {
    // Prevent this from repeatedly being called on movement, target change-mid combo

    // If not a target then clear things out
    if (target.ID === 0 || target.ID.startsWith('1') || target.ID.startsWith('E')) { // 0 = no target, 1... = player? E... = non-combat NPC?
      removeCountdown('shadowfang');
    } else {
      addCountdown({ name: 'shadowfang', time: checkStatus({ name: 'shadowfang', id: target.ID }), text: target.name });
    }
    previous.targetID = target.ID;
  }
};

const ninCheckAction = ({ array = actionArray } = {}) => {

};

const ninOnAction = (actionMatch) => {
  const actionName = actionMatch.groups.actionName.replace(/[\s']/g,'').toLowerCase();
  const matchDiv = document.getElementById(row).querySelector(`div[data-action="${actionName}"]`);
  if (document.getElementById(row).children[0].dataset.action === actionName) {
    matchDiv.remove();
  } else {
    ninNext();
  }
};

function ninOnAction2(actionMatch) {

  // console.log("Logline")

  // Everything breaks Mudra "combo" so list it first
  // Not sure what to do with this

  if (['Ten', 'Chi', 'Jin'].indexOf(actionMatch.groups.actionName) > -1) {
    if (!toggle.mudra) {
      toggle.mudra = Date.now();
      if (checkRecast({ name: 'mudra2' }) > 0) {
        addRecast({ name: 'mudra2' });
      } else {
        addRecast({ name: 'mudra1', time: checkRecast({ name: 'mudra2' }) });
        addRecast({ name: 'mudra2', time: checkRecast({ name: 'mudra2' }) + 20000 });
      }
    }
  }
  else { // Off-GCD actions

    delete toggle.mudra;

    if ("Hide" == actionMatch.groups.actionName) {
      removeIcon("tenchijin");
      addRecast("hide");
      addRecast("ninjutsu", -1);
      addCountdown({name: "ninjutsu", time: -1});
      clearTimeout(timeout.ninjutsu);
      ninNinjutsu();
    }

    else if ("Mug" == actionMatch.groups.actionName) {
      ninNinki();
    }

    else if ("Trick Attack" == actionMatch.groups.actionName) {
      addCountdown({name: "trickattack"});
    }

    else if (["Raiton", "Hyosho Ranyu"].indexOf(actionMatch.groups.actionName) > -1) {
      count.targets = 1;
    }

    else if (["Katon", "Goka Mekkyaku"].indexOf(actionMatch.groups.actionName) > -1) {
      if (Date.now() - previous.katon > 1000) {
        previous.katon = Date.now()
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
    }

    else if ("Suiton" == actionMatch.groups.actionName) {
      addStatus("suiton");
    }

    else if ("Kassatsu" == actionMatch.groups.actionName) {

      removeIcon("kassatsu");
      addStatus("kassatsu");

      if (checkRecast("kassatsu2") < 0) {
        addRecast("kassatsu2", recast.kassatsu);
        addRecast("kassatsu1", -1);
      }
      else {
        addRecast("kassatsu1", checkRecast("kassatsu2"));
        addRecast("kassatsu2", checkRecast("kassatsu2") + recast.kassatsu);
        addCountdown({name: "kassatsu", time: checkRecast("kassatsu1"), oncomplete: "addIcon"});
      }

      addCountdown({name: "ninjutsu", time: -1});
      clearTimeout(timeout.ninjutsu);
      ninNinjutsu();
    }

    else if ("Dream Within A Dream" == actionMatch.groups.actionName) {
      removeIcon("dreamwithinadream");
      addCountdown({name: "dreamwithinadream", time: recast.dreamwithinadream, oncomplete: "addIcon"});
      addStatus("assassinateready");
    }

    else if ("Hellfrog Medium" == actionMatch.groups.actionName) {
      if (Date.now() - previous.hellfrogmedium > 1000) {
        previous.hellfrogmedium = Date.now()
        count.targets = 1;
      }
      else {
        count.targets = count.targets + 1;
      }
      ninNinki();
    }

    else if ("Bhavacakra" == actionMatch.groups.actionName) {
      count.targets = 1;
      ninNinki();
    }

    else if ("Ten Chi Jin" == actionMatch.groups.actionName) {
      removeIcon("tenchijin");
      addStatus("tenchijin");
      addCountdown({name: "tenchijin"});
      addRecast("ninjutsu", -1);
      addCountdown({name: "ninjutsu", time: -1});
      clearTimeout(timeout.ninjutsu);
      ninNinjutsu();
    }

    else if ("Meisui" == actionMatch.groups.actionName) {
      addCountdown({name: "meisui"});
      ninNinki();
    }

    else { // Weaponskills and combos (hopefully)

      if (actionMatch.groups.actionName == "Spinning Edge"
      && actionMatch.groups.result.length >= 2) {

        if ([1, 2, 3].indexOf(next.combo) == -1) {
          if (player.level >= 38
          && checkStatus("shadowfang", target.ID) < 9000) {
            ninShadowFangCombo();
          }
          else if (player.level >= 54
          && player.jobDetail.hutonMilliseconds > 6000
          && player.jobDetail.hutonMilliseconds < 46000) {
            ninArmorCrushCombo();
          }
          else {
            ninAeolianEdgeCombo();
          }
        }
        removeIcon("spinningedge");
        toggle.combo = Date.now();
      }

      else if ("Gust Slash" == actionMatch.groups.actionName
      && actionMatch.groups.result.length >= 8) {

        if ([1, 2].indexOf(next.combo) == -1) {
          if (player.level >= 54
          && player.jobDetail.hutonMilliseconds > 6000
          && player.jobDetail.hutonMilliseconds < 46000) {
            ninArmorCrushCombo();
          }
          else {
            ninAeolianEdgeCombo();
          }
        }
        removeIcon("spinningedge");
        removeIcon("gustslash");

        if (player.level < 26) {
          ninCombo();
        }
      }

      else if ("Shadow Fang" == actionMatch.groups.actionName
      && actionMatch.groups.result.length >= 8) {
        addStatus("shadowfang", duration.shadowfang, actionMatch.groups.targetID);
        ninCombo();
      }

      else if ("Death Blossom" == actionMatch.groups.actionName
      && actionMatch.groups.result.length >= 2) {

        if (Date.now() - previous.deathblossom > 1000) {
          previous.deathblossom = Date.now()
          count.targets = 1;
          if (next.combo != 4) {
            ninHakkeMujinsatsuCombo();
          }
          removeIcon("deathblossom");
          if (player.level < 52) {
            ninCombo();
          }
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else if ("Hakke Mujinsatsu" == actionMatch.groups.actionName
      && actionMatch.groups.result.length == 8) {

        if (Date.now() - previous.hakkemujinsatsu > 1000) {
          previous.hakkemujinsatsu = Date.now()
          count.targets = 1;
          ninCombo();
        }
        else {
          count.targets = count.targets + 1;
        }
      }

      else {
        ninCombo();
      }

      // Recalculate optimal Ninjutsu after every GCD
      if (checkRecast("ninjutsu") < 1000) {
        ninNinjutsu();
      }

      // Check Ninki after all GCD actions
      if (player.level >= 62) {
        ninNinki();
      }
    }
  }
}

function ninStatus() {

  if (statusLog.groups.targetID == player.ID) {

    if ("Mudra" == statusLog.groups.statusName) {
      if ("gains" == statusLog.groups.gainsLoses) {
        removeCountdownBar("ninjutsu");
      }
      else if ("loses" == statusLog.groups.gainsLoses) {
        removeIcon("ninjutsu1");
        removeIcon("ninjutsu2");
        removeIcon("ninjutsu3");
        addCountdown({name: "ninjutsu"});
        clearTimeout(timeout.ninjutsu);
        timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
        if (player.level >= 70
        && checkRecast("trickattack") < 21000
        && checkRecast("tenchijin") < 1000) {
          addIcon({name: "tenchijin"});
        }
      }
    }

    // else if ("Doton" == statusLog.groups.statusName) {
    //   if ("gains" == statusLog.groups.gainsLoses) {
    //     addStatus("doton", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
    //   }
    //   else if ("loses" == statusLog.groups.gainsLoses) {
    //     removeStatus("doton", statusLog.groups.targetID);
    //   }
    // }

    else if ("Suiton" == statusLog.groups.statusName) {
      if ("gains" == statusLog.groups.gainsLoses) {
        addStatus("suiton", parseInt(statusLog.groups.effectDuration) * 1000);
        if (checkStatus("suiton") > checkRecast("trickattack")) {

        }
        else if (checkStatus("suiton") > checkRecast("meisui")) {

        }
      }
      else if ("loses" == statusLog.groups.gainsLoses) {
        removeStatus("suiton", statusLog.groups.targetID);
      }
    }

    else if ("Kassatsu" == statusLog.groups.statusName) {
      if ("gains" == statusLog.groups.gainsLoses) {
        addStatus("kassatsu", parseInt(statusLog.groups.effectDuration) * 1000);
        if (player.level >= 76) {
          icon.katon = icon.gokamekkyaku;
          icon.raiton = icon.hyoshoranyu;  // This isn't how it really upgrades, but  this happens in practice
          icon.hyoton = icon.hyoshoranyu;  // Just in case for later
        }
      }
      else if ("loses" == statusLog.groups.gainsLoses) {
        removeStatus("kassatsu");
        icon.katon = "002908";
        icon.raiton = "002912";
        icon.hyoton = "002909";
        // addRecast("ninjutsu", statusLog.groups.targetID, recast.ninjutsu);
        // clearTimeout(timeout.ninjutsu);
        // timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
      }
    }

    else if ("Ten Chi Jin" == statusLog.groups.statusName) {
      if ("gains" == statusLog.groups.gainsLoses) {
        addStatus("tenchijin", parseInt(statusLog.groups.effectDuration) * 1000);
      }
      else if ("loses" == statusLog.groups.gainsLoses) {
        ninLosesMudra()
      }
    }
  }

  else {
    if ("Shadow Fang" == statusLog.groups.statusName) {
      if ("gains" == statusLog.groups.gainsLoses) {
        addStatus("shadowfang", parseInt(statusLog.groups.effectDuration) * 1000, statusLog.groups.targetID);
        if (target.ID == statusLog.groups.targetID) {  // Might be possible to switch targets between application to target and log entry
          addCountdown({name: "shadowfang", time: checkStatus("shadowfang"), text: target.ID});
        }
      }
      else if ("loses" == statusLog.groups.gainsLoses) {
        removeStatus("shadowfang", statusLog.groups.targetID);
      }
    }
  }
}

function ninCombo() {

  delete toggle.combo;
  removeIcon("spinningedge");
  removeIcon("gustslash");
  removeIcon("aeolianedge");

  if (player.level >= 54
  && count.targets <= 2
  && player.jobDetail.hutonMilliseconds > 6000
  && player.jobDetail.hutonMilliseconds < 46000) {
    ninArmorCrushCombo();
  }
  else if (player.level >= 38
  && count.targets <= 3
  && checkStatus("shadowfang", target.ID) < 9000) {
    ninShadowFangCombo();
  }
  else if (player.level >= 38
  && count.targets >= 3
  && player.jobDetail.hutonMilliseconds > 3000) {
    ninHakkeMujinsatsuCombo();
  }
  else {
    ninAeolianEdgeCombo();
  }
}

function ninAeolianEdgeCombo() {
  next.combo = 1;
  addIcon({name: "spinningedge"});
  addIcon({name: "gustslash"});
  if (player.level >= 26) {
    addIcon({name: "aeolianedge"});
  }
}

function ninArmorCrushCombo() {
  next.combo = 2;
  addIcon({name: "spinningedge"});
  addIcon({name: "gustslash"});
  addIcon({name: "armorcrush"});
}

function ninShadowFangCombo() {
  next.combo = 3;
  addIcon({name: "spinningedge"});
  addIcon({name: "shadowfang"});
}

function ninHakkeMujinsatsuCombo() {
  next.combo = 4;
  addIcon({name: "deathblossom"});
  if (player.level >= 52) {
    addIcon({name: "hakkemujinsatsu"});
  }
}

function ninLosesMudra() {
  removeIcon("ninjutsu1");
  removeIcon("ninjutsu2");
  removeIcon("ninjutsu3");
  addCountdown({name: "ninjutsu"});
  clearTimeout(timeout.ninjutsu);
  timeout.ninjutsu = setTimeout(ninNinjutsu, recast.ninjutsu - 1000);
  if (checkRecast("kassatsu1") < 0) {
    addIcon({name: "kassatsu"});
  }
  if (checkRecast("tenchijin") < 0) {
    addIcon({name: "tenchijin"});
  }
}

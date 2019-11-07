'use strict';

/* If the proc's remaining time lower than this, it is not considered active for dualcast calculations */
const rdmProcBufferTime = 7500;

// Verflare (called after melee combo function)
const rdmVerflareCombo = () => {
  addAction({ name: 'verflare', array: priorityArray });
  if (player.level >= 80) {
    addAction({ name: 'scorch', array: priorityArray });
  }
};

// Verholy (called after melee combo function)
const rdmVerholyCombo = () => {
  addAction({ name: 'verholy', array: priorityArray });
  if (player.level >= 80) {
    addAction({ name: 'scorch', array: priorityArray });
  }
};

const rdmMeleeCombo = () => {
  addAction({ name: 'riposte', array: priorityArray });
  if (player.level >= 35
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 55) {
    addAction({ name: 'zwerchhau', array: priorityArray });
  }
  if (player.level >= 50
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    addAction({ name: 'redoublement', array: priorityArray });
  }
  // Verflare or Verholy?
  if (player.level >= 68
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80) {
    // In relative order of desirability
    if (player.level >= 70
    && player.jobDetail.blackMana > player.jobDetail.whiteMana
    && checkStatus('verstoneready') < rdmProcBufferTime) {
      // 100% proc
      rdmVerholyCombo();
    } else if (player.jobDetail.whiteMana > player.jobDetail.blackMana
    && checkStatus('verfireready') < rdmProcBufferTime) {
      // 100% proc
      rdmVerflareCombo();
    } else if (player.level >= 70
    && player.jobDetail.whiteMana + 20 - player.jobDetail.blackMana <= 30
    && checkStatus('verstoneready') < rdmProcBufferTime) {
      // 20% proc
      rdmVerholyCombo();
    } else if (player.jobDetail.blackMana + 20 - player.jobDetail.whiteMana <= 30
    && checkStatus('verfireready') < rdmProcBufferTime) {
      // 20% proc
      rdmVerflareCombo();
    } else if (player.level >= 70
    && player.jobDetail.blackMana > player.jobDetail.whiteMana) {
      // 0% proc
      rdmVerholyCombo();
    } else {
      // 0% proc
      rdmVerflareCombo();
    }
  }
};

const rdmDualcastPotency = ({
  blackMana,
  whiteMana,
  manaTarget,
  manaCap,
  hardcastAction = 'hardcast',
  hardcastBlackMana = 0,
  hardcastWhiteMana = 0,
  dualcastAction = 'dualcast',
  dualcastBlackMana = 0,
  dualcastWhiteMana = 0,
  verstoneReady = 0,
  verfireReady = 0,
  // acceleration = 0,
  swiftcast = 0,
} = {}) => {
  // Static variables
  const singleTargetManaPotency = 8.07;
  const multiTargetManaPotency = 2.43; // Per target

  // Set proc potency
  let procPotency = 0;
  if (player.level >= 62) {
    procPotency = 20;
  } else {
    procPotency = 90;
  }

  // Calculate mana manaBreakpoint for Verflare/Verholy fixing
  const manaBreakpoint = (20 * 0.8) / singleTargetManaPotency + 3;

  // Find Hardcasted action potency
  let hardcastPotency = 0;
  if (Math.abs(Math.min(blackMana + hardcastBlackMana, 100)
  - Math.min(whiteMana + hardcastWhiteMana, 100)) > 30) {
    return 0;
  } else if (hardcastAction === 'jolt') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 280;
    } else {
      hardcastPotency = 180;
    }
  } else if (verfireReady > 5000 && hardcastAction === 'verfire') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (verstoneReady > 5000 && hardcastAction === 'verstone') {
    if (player.level >= 62) {
      // Level 62 trait
      hardcastPotency = 300;
    } else {
      hardcastPotency = 270;
    }
  } else if (player.level >= 18 && hardcastAction === 'verthunder2') {
    if (player.level >= 78) {
      // Level 78 trait
      hardcastPotency = 120 * count.targets;
    } else {
      hardcastPotency = 100 * count.targets;
    }
  } else if (player.level >= 22 && hardcastAction === 'veraero2') {
    if (player.level >= 78) {
      // Level 78 trait
      hardcastPotency = 120 * count.targets;
    } else {
      hardcastPotency = 100 * count.targets;
    }
  } else if (player.level >= 18 && swiftcast < 0 && hardcastAction === 'swiftcast') {
    if (player.level >= 62) {
      hardcastPotency = (280 + 300 + 350 * 2) * 0.25;
    } else {
      hardcastPotency = (180 + 270 + 310 * 2) * 0.25;
    }
  } else {
    return 0;
  }

  // Find Dualcasted action potency
  let dualcastPotency = 0;
  if (Math.abs(Math.min(blackMana + hardcastBlackMana + dualcastBlackMana, 100)
  - Math.min(whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100)) > 30) {
    return 0;
  } else if (dualcastAction === 'verthunder') {
    if (player.level >= 62) {
      // Level 62 trait
      dualcastPotency = 350;
    } else {
      dualcastPotency = 310;
    }
    if (hardcastAction === 'verfire' || verfireReady <= 0) {
      // Add proc potency if applicable
      dualcastPotency += procPotency * 0.5;
    } else {
      dualcastPotency -= procPotency;
    }
  } else if (dualcastAction === 'veraero') {
    if (player.level >= 62) {
      // Level 62 trait
      dualcastPotency = 350;
    } else {
      dualcastPotency = 310;
    }
    if (hardcastAction === 'verstone' || verstoneReady <= 0) {
      // Add proc potency if applicable
      dualcastPotency += procPotency * 0.5;
    } else {
      dualcastPotency -= procPotency;
    }
  } else if (player.level >= 15 && dualcastAction === 'scatter') {
    if (player.level >= 66) { // Trait
      dualcastPotency = 220 * count.targets;
    } else {
      dualcastPotency = 120 * count.targets;
    }
  } else {
    return 0;
  }

  const newBlackMana = Math.min(blackMana + hardcastBlackMana + dualcastBlackMana, 100);
  const newWhiteMana = Math.min(whiteMana + hardcastWhiteMana + dualcastWhiteMana, 100);
  const manaOverCap = blackMana + hardcastBlackMana + dualcastBlackMana - 100
    + whiteMana + hardcastWhiteMana + dualcastWhiteMana - 100;

  // Give some priority to smaller mana differences
  let manaDifferenceModifier = Math.abs(newBlackMana - newWhiteMana) / 10;
  if (Math.min(newBlackMana, newWhiteMana) >= manaTarget
  && Math.max(newBlackMana, newWhiteMana) < manaCap) {
    manaDifferenceModifier *= -1; // Attempt to value larger spreads when above 80/80
  }

  // Proritize combo that results in Verholy/Verflare procs
  let startMeleeBonus = 0;
  if (Math.min(newBlackMana, newWhiteMana) >= manaTarget && manaOverCap < manaBreakpoint) {
    if (player.level >= 70 && newBlackMana > newWhiteMana && dualcastAction === 'verthunder'
    && verfireReady <= 0 && (hardcastAction === 'verstone' || verstoneReady < 0)) {
      startMeleeBonus = 1000000; // 100% proc Verholy
    } else if (player.level >= 68 && newWhiteMana > newBlackMana && dualcastAction === 'veraero'
    && verstoneReady <= 0 && (hardcastAction === 'verfire' || verfireReady < 0)) {
      startMeleeBonus = 1000000; // 100% proc Verflare
    } else if (player.level >= 70 && newBlackMana > newWhiteMana && dualcastAction === 'verthunder'
    && (hardcastAction === 'verstone' || verstoneReady <= 0)) {
      startMeleeBonus = 100000; // 100% proc Verholy, 50% overwrite existing proc
    } else if (player.level >= 68 && newWhiteMana > newBlackMana && dualcastAction === 'veraero'
    && (hardcastAction === 'verfire' || verfireReady < 0)) {
      startMeleeBonus = 100000; // 100% proc Verflare, 50% overwrite existing proc
    }
  }

  // Calculate final potency
  const potency = hardcastPotency + dualcastPotency
    + (newBlackMana + newWhiteMana - blackMana - whiteMana)
    * Math.max(singleTargetManaPotency, count.targets * multiTargetManaPotency)
    - manaDifferenceModifier + startMeleeBonus;

  return potency;
};

const rdmDualcast = () => {
  const hardcastSpells = [
    ['jolt', 3, 3],
    ['verfire', 9, 0],
    ['verstone', 0, 9],
    ['verthunder2', 7, 0],
    ['veraero2', 0, 7],
    ['swiftcast', 0, 0],
  ];
  const dualcastSpells = [
    ['verthunder', 11, 0],
    ['veraero', 0, 11],
    ['scatter', 3, 3],
  ];
  const dualcastArray = []; // Start with empty array

  // These need to be defined outside of loop - snapshot of current player
  let verfireReady = checkStatus('verfireready');
  let verstoneReady = checkStatus('verstoneready');
  let swiftcastRecast = checkRecast('swiftcast');
  let manaficationRecast = checkRecast('manafication');
  let { blackMana } = player.jobDetail;
  let { whiteMana } = player.jobDetail;
  let manaCap = 100; // Define outside for loop conditions
  let manaTarget = 80;
  let elapsedTime = 0;
  // console.log(JSON.stringify(dualcastArray));

  do {
    // This will loop at least once

    // Variable setup
    let bestPotency = 0;
    let bestDualcastCombo = [];

    // Calculate mana target for when to stop loop

    if (player.level >= 60 && manaficationRecast - elapsedTime <= 0) {
      if (count.targets > 1) {
        manaCap = 50;
        manaTarget = 50;
      } else {
        manaCap = 50;
        manaTarget = 40;
      }
    } else if (player.level >= 52 && count.targets > 1) {
      manaCap = 100;
      manaTarget = 50;
    }

    // Loops through every hardcast/dualcast combination to find most valuable one
    // To do - acceleration counts
    for (let i = 0; i < hardcastSpells.length; i += 1) {
      for (let j = 0; j < dualcastSpells.length; j += 1) {
        const potency = rdmDualcastPotency({
          blackMana,
          whiteMana,
          manaTarget,
          manaCap,
          hardcastAction: hardcastSpells[i][0],
          hardcastBlackMana: hardcastSpells[i][1],
          hardcastWhiteMana: hardcastSpells[i][2],
          dualcastAction: dualcastSpells[j][0],
          dualcastBlackMana: dualcastSpells[j][1],
          dualcastWhiteMana: dualcastSpells[j][2],
          verfireReady: verfireReady - elapsedTime,
          verstoneReady: verstoneReady - elapsedTime,
          swiftcastRecast: swiftcastRecast - elapsedTime,
        });
        if (potency > bestPotency) {
          bestPotency = potency;
          bestDualcastCombo = [
            hardcastSpells[i][0],
            dualcastSpells[j][0],
            hardcastSpells[i][1] + dualcastSpells[j][1],
            hardcastSpells[i][2] + dualcastSpells[j][2],
            bestPotency,
          ];
        }
      }
    }

    // console.log(JSON.stringify(bestDualcastCombo)); // Uncomment to check array at end
    // Adjust Verfire/Verstone Ready
    if (bestDualcastCombo[0] === 'verfire') {
      verfireReady = 0;
    } else if (bestDualcastCombo[0] === 'verstone') {
      verstoneReady = 0;
    }

    if (bestDualcastCombo[0] === 'swiftcast') {
      swiftcastRecast = recast.swiftcast + elapsedTime;
    }

    // Add to action array
    dualcastArray.push({ name: 'hardcast', img: bestDualcastCombo[0] });
    dualcastArray.push({ name: 'dualcast', img: bestDualcastCombo[1] });
    elapsedTime += 5000;
    blackMana = Math.min(blackMana + bestDualcastCombo[2], 100);
    whiteMana = Math.min(whiteMana + bestDualcastCombo[3], 100);
    // Set up for next loop
  } while (Math.min(blackMana, whiteMana) < manaTarget
    && Math.max(blackMana, whiteMana) < manaCap);

  // Uncomment to check array
  // console.log(`Black: ${blackMana}/${manaCap} White:${whiteMana}/${manaCap}`);
  // console.log(JSON.stringify(dualcastArray));

  actionArray = dualcastArray;
  resyncActions({ array: actionArray });
};

const rdmNext = () => { // Main function
  const hardcastCheck = document.getElementById('action-row').querySelector('div[data-action="hardcast"]');
  if (!hardcastCheck) {
    rdmDualcast();
  }

  if (player.level >= 50
  && Math.min(player.jobDetail.blackMana, player.jobDetail.whiteMana) >= 80
  && count.targets === 1) {
    rdmMeleeCombo();
  } else {
    priorityArray = [];
    resyncActions({ array: priorityArray });
  }
};

const rdmOnJobChange = () => {
  // nextid.manafication = 0;
  // nextid.moulinet = nextid.manafication;
  // nextid.reprise = nextid.manafication;
  //
  // nextid.combo1 = 1;
  // nextid.combo2 = nextid.combo1 + 1;
  // nextid.combo3 = nextid.combo1 + 2;
  // nextid.combo4 = nextid.combo1 + 3;
  // nextid.combo5 = nextid.combo1 + 4;
  // nextid.riposte = 1;
  // nextid.zwerchhau = nextid.riposte + 1;
  // nextid.redoublement = nextid.riposte + 2;
  // nextid.verflare =  nextid.riposte + 3;
  // nextid.verholy =  nextid.riposte + 3;
  // nextid.scorch =  nextid.riposte + 4;
  // nextid.hardcast = 18;
  // nextid.dualcast = 19;
  // nextid.luciddreaming = 21;
  // nextid.fleche = 22;
  // nextid.contresixte = nextid.fleche + 1;
  // nextid.corpsacorps = nextid.fleche + 2;
  // nextid.displacement = nextid.fleche + 3;
  // nextid.swiftcast = nextid.fleche + 4;
  // nextid.acceleration = nextid.fleche + 5;
  // countdownid.manafication = 0;
  // countdownid.swiftcast = 1;
  // countdownid.fleche = 2;
  // countdownid.contresixte = 3;
  // countdownid.corpsacorps = 4;
  // countdownid.displacement = 5;
  // countdownid.acceleration = 6;
  // countdownid.embolden = 7;
  // countdownid.luciddreaming = 8;
  // previous.contresixte = 0;
  // previous.verthunder2 = 0;
  // previous.veraero2 = 0;
  // previous.scatter = 0;
  // previous.moulinet = 0;

  // Set up icons

  if (player.level >= 62) {
    icon.jolt = icon.jolt2;
  } else {
    icon.jolt = '003202';
  }

  if (player.level >= 66) {
    icon.scatter = icon.impact;
  } else {
    icon.scatter = '003207';
  }

  // Set up traits
  if (player.level >= 74) {
    recast.manafication = 110000;
  } else {
    recast.manafication = 120000;
  }

  if (player.level >= 78) {
    recast.contresixte = 35000;
  } else {
    recast.contresixte = 45000;
  }


  // Create cooldown notifications
  addCountdown({
    name: 'corpsacorps', array: cooldownArray, time: checkRecast('corpsacorps'), onComplete: 'addIcon',
  });
  if (player.level >= 40) {
    addCountdown({
      name: 'displacement', array: cooldownArray, time: checkRecast('displacement'), onComplete: 'addIcon',
    });
  }
  if (player.level >= 45) {
    addCountdown({
      name: 'fleche', array: cooldownArray, time: checkRecast('fleche'), onComplete: 'addIcon',
    });
  }
  if (player.level >= 56) {
    addCountdown({
      name: 'contresixte', array: cooldownArray, time: checkRecast('contresixte'), onComplete: 'addIcon',
    });
  }
  if (player.level >= 60) {
    addCountdown({ name: 'manafication', time: checkRecast('manafication') });
  }

  count.targets = 1;
  rdmNext();
};

const rdmOnStartsUsing = () => {
  removeAction({ name: 'riposte', array: priorityArray });
  removeAction({ name: 'zwerchhau', array: priorityArray });
  removeAction({ name: 'redoublement', array: priorityArray });
  removeAction({ name: 'verflare', array: priorityArray });
  removeAction({ name: 'verholy', array: priorityArray });
  removeAction({ name: 'scorch', array: priorityArray });
  delete toggle.combo; // Starting cast immediately breaks combo, apparently
  fadeAction({ name: 'hardcast' });
};

const rdmOnAction = (actionMatch) => {
  const rdmActions = [
    // Off-GCD
    'Corps-A-Corps', 'Displacement', 'Fleche', 'Contre Sixte', 'Acceleration', 'Manafication',
    'Engagement',
    // GCD
    'Jolt', 'Verfire', 'Verstone', 'Jolt II', 'Verthunder', 'Veraero',
    'Verthunder II', 'Veraero II', 'Impact', 'Scatter',
    'Riposte', 'Zwerchhau', 'Redoublement', 'Moulinet', 'Reprise',
    'Enchanted Riposte', 'Enchanted Zwerchhau', 'Enchanted Redoublement', 'Enchanted Moulinet',
    'Enchanted Reprise',
    'Verflare', 'Verholy', 'Scorch',
    // Role
    'Swiftcast', 'Lucid Dreaming',
  ];

  if (rdmActions.indexOf(actionMatch.groups.actionName) > -1) {
    // Non-GCD Actions
    if (actionMatch.groups.actionName === 'Corps-A-Corps') {
      removeAction({ name: 'corpsacorps', array: cooldownArray });
      addRecast('corpsacorps');
      addCountdown({
        name: 'corpsacorps', time: recast.corpsacorps, onComplete: 'addIcon', array: cooldownArray,
      });
    } else if (['Displacement', 'Engagement'].indexOf(actionMatch.groups.actionName) > -1) {
      removeAction({ name: 'displacement', array: cooldownArray });
      addRecast('displacement');
      addCountdown({
        name: 'displacement', time: recast.displacement, onComplete: 'addIcon', array: cooldownArray,
      });
    } else if (actionMatch.groups.actionName === 'Fleche') {
      removeAction({ name: 'fleche', array: cooldownArray });
      addRecast('fleche');
      addCountdown({
        name: 'fleche', time: recast.fleche, onComplete: 'addIcon', array: cooldownArray,
      });
    } else if (actionMatch.groups.actionName === 'Acceleration') {
      removeAction({ name: 'acceleration', array: cooldownArray });
      addRecast('acceleration');
      addCountdown({
        name: 'acceleration', time: recast.acceleration, onComplete: 'addIcon', array: cooldownArray,
      });
    } else if (actionMatch.groups.actionName === 'Contre Sixte') {
      removeAction({ name: 'contresixte', array: cooldownArray });
      addRecast('contresixte');
      addCountdown({
        name: 'contresixte', time: recast.contresixte, onComplete: 'addIcon', array: cooldownArray,
      });
      countTargets('contresixte');
    } else if (actionMatch.groups.actionName === 'Embolden') {
      addRecast('embolden');
    } else if (actionMatch.groups.actionName === 'Swiftcast') {
      removeAction({ name: 'swiftcast', array: cooldownArray });
      addRecast('swiftcast');
      addCountdown({
        name: 'swiftcast', time: recast.swiftcast, onComplete: 'addIcon', array: cooldownArray,
      });
    } else if (actionMatch.groups.actionName === 'Lucid Dreaming') {
      addRecast('luciddreaming');
    } else if (['Riposte', 'Enchanted Riposte'].indexOf(actionMatch.groups.actionName) > -1) {
      count.targets = 1;
      if (!toggle.combo) {
        rdmMeleeCombo();
      }
      removeAction({ name: 'riposte', array: priorityArray });
      if (player.level < 35
      || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
        delete toggle.combo;
      }
    } else if (['Zwerchhau', 'Enchanted Zwerchhau'].indexOf(actionMatch.groups.actionName) > -1) {
      removeAction({ name: 'zwerchhau', array: priorityArray });
      if (player.level < 50
      || Math.max(player.jobDetail.blackMana, player.jobDetail.whiteMana) < 25) {
        delete toggle.combo;
      }
    } else if (['Redoublement', 'Enchanted Redoublement'].indexOf(actionMatch.groups.actionName) > -1) {
      removeAction({ name: 'redoublement', array: priorityArray });
      if (player.level < 68) {
        delete toggle.combo;
      }
    } else if (actionMatch.groups.actionName === 'Verflare') {
      removeAction({ name: 'verflare', array: priorityArray });
      if (player.level < 80) {
        delete toggle.combo;
        rdmNext();
      }
    } else if (actionMatch.groups.actionName === 'Verholy') {
      removeAction({ name: 'verholy', array: priorityArray });
      if (player.level < 80) {
        delete toggle.combo;
        rdmNext();
      }
    } else if (actionMatch.groups.actionName === 'Scorch') {
      removeAction({ name: 'scorch', array: priorityArray });
      delete toggle.combo;
      rdmNext();
    } else {
      delete toggle.combo; // Everything else here interrupts melee combo

      if (player.level >= 66
      && ['Verthunder', 'Veraero'].indexOf(actionMatch.groups.actionName) > -1) {
        count.targets = 1;
      } else if (actionMatch.groups.actionName === 'Verthunder II') {
        countTargets('verthunder2');
      } else if (actionMatch.groups.actionName === 'Veraero II') {
        countTargets('veraero2');
      } else if (['Scatter', 'Impact'].indexOf(actionMatch.groups.actionName) > -1) {
        countTargets('scatter');
      } else if (['Moulinet', 'Enchanted Moulinet'].indexOf(actionMatch.groups.actionName) > -1) {
        countTargets('moulinet');
        removeAction({ name: 'moulinet' });
      } else if (['Reprise', 'Enchanted Reprise'].indexOf(actionMatch.groups.actionName) > -1) {
        count.targets = 1;
        removeAction({ name: 'reprise' });
      } else if (actionMatch.groups.actionName === 'Manafication') {
        removeAction({ name: 'manafication' });
        addRecast('manafication');
        addRecast('corpsacorps', -1);
        addRecast('displacement', -1);
        addCountdown({ name: 'manafication' });
        addCountdown({ name: 'displacement', time: -1, onComplete: 'addIcon', array: cooldownArray });
        addCountdown({ name: 'corpsacorps', time: -1, onComplete: 'addIcon', array: cooldownArray });
      }
    }
  }
};

// 17: NetworkCancelAbility
const rdmOnCancelled = (cancelledMatch) => {
  unfadeAction({ name: 'hardcast' });
  rdmNext(); // Recheck dualcast if casting canceled
};

// 1A: NetworkBuff
const rdmOnEffect = (effectMatch) => {
  if (effectMatch.groups.targetID === player.ID) {
    if (effectMatch.groups.effectName === 'Dualcast') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus({ name: 'dualcast', time: parseInt(effectMatch.groups.effectDuration, 10) * 1000 });
        removeAction({ name: 'hardcast' });
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus({ name: 'dualcast' });
        removeAction({ name: 'dualcast' });
        rdmNext();
      }
    } else if (effectMatch.groups.effectName === 'Verfire Ready') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus({ name: 'verfireready', time: parseInt(effectMatch.groups.effectDuration, 10) * 1000 });
        if (!toggle.combo) {
          rdmDualcast(); // Prevents Verflare proc from resetting combo
        }
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus({ name: 'verfireready' });
      }
    } else if (effectMatch.groups.effectName === 'Verstone Ready') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus({ name: 'verstoneready', time: parseInt(effectMatch.groups.effectDuration, 10) * 1000 });
        if (!toggle.combo) {
          rdmDualcast(); // Prevents Verholy proc from resetting combo
        }
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus({ name: 'verstoneready' });
      }
    } else if (effectMatch.groups.effectName === 'Manafication') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus({ name: 'manafication', time: parseInt(effectMatch.groups.effectDuration, 10) * 1000 });
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus({ name: 'manafication' });
      }
    } else if (effectMatch.groups.effectName === 'Swiftcast') {
      if (effectMatch.groups.gainsLoses === 'gains') {
        addStatus({ name: 'swiftcast', time: parseInt(effectMatch.groups.effectDuration, 10) * 1000 });
        removeAction({ name: 'hardcast' });
      } else if (effectMatch.groups.gainsLoses === 'loses') {
        removeStatus({ name: 'swiftcast' });
        removeAction({ name: 'dualcast' });
        rdmNext();
      }
    }
  }
};

const rdmComboTimeout = () => {
  clearTimeout(timeout.combo);
  timeout.combo = setTimeout(rdmNext, 12500);
}

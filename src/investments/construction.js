const EXTRA_ULTIMATE_LEVEL_ONE_RESOURCES = Object.freeze({
  cash: 33480002,
  arms: 11016001,
  cargo: 11664001,
  metal: 14040001,
  diamonds: 21600001,
  oil: 0,
  crypto_coins: 0,
  family_currency: 0,
  family_insignia: 0
});

function freezeResources(resources) {
  return Object.freeze({ ...resources });
}

function freightTruckKnownLevel({
  level,
  originalTime = null,
  timeSeconds = null,
  resources,
  goldApprox = null,
  influenceIncrease,
  prerequisites = []
}) {
  return Object.freeze({
    level,
    originalTime,
    timeSeconds,
    resources: freezeResources(resources),
    goldApprox,
    influenceIncrease,
    prerequisites: Object.freeze(prerequisites.map(prerequisite => Object.freeze({ ...prerequisite })))
  });
}

function extraUltimateLevelOne(prerequisites) {
  return freightTruckKnownLevel({
    level: 1,
    resources: EXTRA_ULTIMATE_LEVEL_ONE_RESOURCES,
    influenceIncrease: 152043,
    prerequisites
  });
}

const BASIC_RESOURCE_LEVELS = Object.freeze([
  freightTruckKnownLevel({
    level: 1,
    originalTime: '2D 14:52:23',
    timeSeconds: 226343,
    resources: {
      cash: 2039715,
      arms: 671132,
      cargo: 710611,
      metal: 855365,
      diamonds: 1315945,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 904,
    influenceIncrease: 3907
  }),
  freightTruckKnownLevel({
    level: 2,
    originalTime: '3D 06:35:29',
    timeSeconds: 282929,
    resources: {
      cash: 2549644,
      arms: 838915,
      cargo: 888263,
      metal: 1069206,
      diamonds: 1644931,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 1085,
    influenceIncrease: 4298
  }),
  freightTruckKnownLevel({
    level: 3,
    originalTime: '4D 02:14:21',
    timeSeconds: 353661,
    resources: {
      cash: 3187055,
      arms: 1048644,
      cargo: 1110329,
      metal: 1336507,
      diamonds: 2056164,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 1325,
    influenceIncrease: 9028
  }),
  freightTruckKnownLevel({
    level: 4,
    originalTime: '5D 02:47:56',
    timeSeconds: 442076,
    resources: {
      cash: 3983818,
      arms: 1310805,
      cargo: 1387911,
      metal: 1670634,
      diamonds: 2570205,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 1636,
    influenceIncrease: 18962
  }),
  freightTruckKnownLevel({
    level: 5,
    originalTime: '6D 09:29:55',
    timeSeconds: 552595,
    resources: {
      cash: 4979772,
      arms: 1638506,
      cargo: 1734889,
      metal: 2088292,
      diamonds: 3212756,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 2044,
    influenceIncrease: 39827
  })
]);

const HIJACK_BOOST_LEVELS = Object.freeze([
  freightTruckKnownLevel({
    level: 1,
    originalTime: '1D 07:02:06',
    timeSeconds: 111726,
    resources: {
      cash: 1006831,
      arms: 331280,
      cargo: 350767,
      metal: 422220,
      diamonds: 649568,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 516,
    influenceIncrease: 192,
    prerequisites: [{ name: 'Basic Resource', level: 1 }]
  }),
  freightTruckKnownLevel({
    level: 2,
    originalTime: '1D 14:47:37',
    timeSeconds: 139657,
    resources: {
      cash: 1258539,
      arms: 414100,
      cargo: 438459,
      metal: 527775,
      diamonds: 811960,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 635,
    influenceIncrease: 210
  }),
  freightTruckKnownLevel({
    level: 3,
    originalTime: '2D 00:29:32',
    timeSeconds: 174572,
    resources: {
      cash: 1573171,
      arms: 517624,
      cargo: 548073,
      metal: 659717,
      diamonds: 1014949,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 746,
    influenceIncrease: 442
  }),
  freightTruckKnownLevel({
    level: 4,
    originalTime: '2D 12:36:55',
    timeSeconds: 218215,
    resources: {
      cash: 1966465,
      arms: 647031,
      cargo: 685091,
      metal: 824647,
      diamonds: 1268687,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 879,
    influenceIncrease: 928
  }),
  freightTruckKnownLevel({
    level: 5,
    originalTime: '3D 03:46:08',
    timeSeconds: 272768,
    resources: {
      cash: 2458080,
      arms: 808788,
      cargo: 856364,
      metal: 1030808,
      diamonds: 1585858,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 1051,
    influenceIncrease: 1948
  }),
  freightTruckKnownLevel({
    level: 6,
    originalTime: '3D 22:42:40',
    timeSeconds: 340960,
    resources: {
      cash: 3072601,
      arms: 1010985,
      cargo: 1070455,
      metal: 1288510,
      diamonds: 1982323,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 1282,
    influenceIncrease: 4093
  }),
  freightTruckKnownLevel({
    level: 7,
    originalTime: '4D 22:23:20',
    timeSeconds: 426200,
    resources: {
      cash: 3840750,
      arms: 1263731,
      cargo: 1338068,
      metal: 1610637,
      diamonds: 2447903,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 1577,
    influenceIncrease: 8597
  }),
  freightTruckKnownLevel({
    level: 8,
    originalTime: '6D 03:59:10',
    timeSeconds: 532750,
    resources: {
      cash: 4800938,
      arms: 1579664,
      cargo: 1672585,
      metal: 2013297,
      diamonds: 3097379,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 1971,
    influenceIncrease: 18056
  }),
  freightTruckKnownLevel({
    level: 9,
    originalTime: '7D 16:58:57',
    timeSeconds: 665937,
    resources: {
      cash: 6001173,
      arms: 1974580,
      cargo: 2090731,
      metal: 2516621,
      diamonds: 3871724,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 2462,
    influenceIncrease: 37924
  }),
  freightTruckKnownLevel({
    level: 10,
    originalTime: '9D 15:13:41',
    timeSeconds: 832421,
    resources: {
      cash: 7501464,
      arms: 2468224,
      cargo: 2468224,
      metal: 3145776,
      diamonds: 4839654,
      oil: 0,
      crypto_coins: 0,
      family_currency: 0,
      family_insignia: 0
    },
    goldApprox: 3076,
    influenceIncrease: 79653,
    prerequisites: [{ name: 'Basic Resource', level: 5 }]
  })
]);

export const FREIGHT_TRUCK_CATEGORY = Object.freeze({
  id: -100,
  name: 'Freight Truck',
  underConstruction: true,
  investments: Object.freeze([
    Object.freeze({
      id: -1001,
      name: 'Basic Resource',
      maxLevel: 5,
      knownLevels: BASIC_RESOURCE_LEVELS,
      dataComplete: true
    }),
    Object.freeze({
      id: -1002,
      name: 'Hijack Boost',
      maxLevel: 10,
      knownLevels: HIJACK_BOOST_LEVELS,
      dataComplete: true
    }),
    Object.freeze({ id: -1003, name: 'Safeguard Boost' }),
    Object.freeze({ id: -1004, name: 'Faster Shipment' }),
    Object.freeze({ id: -1005, name: 'Lucky Hijack' }),
    Object.freeze({ id: -1006, name: 'Lucky Recovery' }),
    Object.freeze({
      id: -1007,
      name: 'Extra Run',
      maxLevel: 1,
      knownLevel: extraUltimateLevelOne([
        { name: 'Lucky Hijack', level: 5 },
        { name: 'Lucky Recovery', level: 5 }
      ])
    }),
    Object.freeze({
      id: -1008,
      name: 'Ultimate Protection',
      maxLevel: 1,
      knownLevel: extraUltimateLevelOne([
        { name: 'Extra Run', level: 1 }
      ])
    })
  ]),
  layout: Object.freeze([
    Object.freeze(['', -1001, '', '']),
    Object.freeze([-1002, '', -1003, '']),
    Object.freeze(['', -1004, '', '']),
    Object.freeze([-1005, '', -1006, '']),
    Object.freeze(['', -1007, '', '']),
    Object.freeze(['', -1008, '', ''])
  ])
});

function maxKnownLevel(definition) {
  if (definition.knownLevels?.length) return Math.max(...definition.knownLevels.map(level => Number(level.level) || 0));
  return Number(definition.knownLevel?.level) || 0;
}

export function registerConstructionInvestments(categoriesById, investments) {
  const category = {
    id: FREIGHT_TRUCK_CATEGORY.id,
    name: FREIGHT_TRUCK_CATEGORY.name,
    underConstruction: true,
    investments: FREIGHT_TRUCK_CATEGORY.investments.map(investment => investment.id)
  };

  categoriesById.set(category.id, category);
  FREIGHT_TRUCK_CATEGORY.investments.forEach((definition, index) => {
    investments.set(definition.id, {
      ...definition,
      categoryId: category.id,
      categoryName: category.name,
      maxLevel: Number(definition.maxLevel) || maxKnownLevel(definition),
      order: Number.MAX_SAFE_INTEGER - FREIGHT_TRUCK_CATEGORY.investments.length + index,
      levels: new Map(),
      underConstruction: true
    });
  });
}

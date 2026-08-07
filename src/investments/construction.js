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

export const FREIGHT_TRUCK_CATEGORY = Object.freeze({
  id: -100,
  name: 'Freight Truck',
  underConstruction: true,
  investments: Object.freeze([
    Object.freeze({
      id: -1001,
      name: 'Basic Resource',
      knownLevels: BASIC_RESOURCE_LEVELS,
      dataComplete: true
    }),
    Object.freeze({ id: -1002, name: 'Hijack Boost' }),
    Object.freeze({ id: -1003, name: 'Safeguard Boost' }),
    Object.freeze({ id: -1004, name: 'Faster Shipment' }),
    Object.freeze({ id: -1005, name: 'Lucky Hijack' }),
    Object.freeze({ id: -1006, name: 'Lucky Recovery' }),
    Object.freeze({
      id: -1007,
      name: 'Extra Run',
      knownLevel: extraUltimateLevelOne([
        { name: 'Lucky Hijack', level: 5 },
        { name: 'Lucky Recovery', level: 5 }
      ])
    }),
    Object.freeze({
      id: -1008,
      name: 'Ultimate Protection',
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
      maxLevel: maxKnownLevel(definition),
      order: Number.MAX_SAFE_INTEGER - FREIGHT_TRUCK_CATEGORY.investments.length + index,
      levels: new Map(),
      underConstruction: true
    });
  });
}

const FREIGHT_TRUCK_LEVEL_ONE_RESOURCES = Object.freeze({
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

function freightTruckLevelOne(prerequisites) {
  return Object.freeze({
    level: 1,
    resources: FREIGHT_TRUCK_LEVEL_ONE_RESOURCES,
    influenceIncrease: 152043,
    prerequisites: Object.freeze(prerequisites.map(prerequisite => Object.freeze(prerequisite)))
  });
}

export const FREIGHT_TRUCK_CATEGORY = Object.freeze({
  id: -100,
  name: 'Freight Truck',
  underConstruction: true,
  investments: Object.freeze([
    Object.freeze({ id: -1001, name: 'Basic Resource' }),
    Object.freeze({ id: -1002, name: 'Hijack Boost' }),
    Object.freeze({ id: -1003, name: 'Safeguard Boost' }),
    Object.freeze({ id: -1004, name: 'Faster Shipment' }),
    Object.freeze({ id: -1005, name: 'Lucky Hijack' }),
    Object.freeze({ id: -1006, name: 'Lucky Recovery' }),
    Object.freeze({
      id: -1007,
      name: 'Extra Run',
      knownLevel: freightTruckLevelOne([
        { name: 'Lucky Hijack', level: 5 },
        { name: 'Lucky Recovery', level: 5 }
      ])
    }),
    Object.freeze({
      id: -1008,
      name: 'Ultimate Protection',
      knownLevel: freightTruckLevelOne([
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
      maxLevel: definition.knownLevel?.level || 0,
      order: Number.MAX_SAFE_INTEGER - FREIGHT_TRUCK_CATEGORY.investments.length + index,
      levels: new Map(),
      underConstruction: true
    });
  });
}

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
    Object.freeze({ id: -1007, name: 'Extra Run' }),
    Object.freeze({ id: -1008, name: 'Ultimate Protection' })
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
      maxLevel: 0,
      order: Number.MAX_SAFE_INTEGER - FREIGHT_TRUCK_CATEGORY.investments.length + index,
      levels: new Map(),
      underConstruction: true
    });
  });
}

async function inflateModule(path, exportName) {
  const encoded = (await fetch(path)).text();
  const bytes = Uint8Array.from(atob(await encoded), char => char.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
  const source = await new Response(stream).text();
  const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
  try {
    const module = await import(url);
    return module[exportName];
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function loadBuildingRecords() {
  return inflateModule('./assets/data/building-records.js.gz.b64', 'buildingRecords');
}

export async function loadInvestmentRecords() {
  return inflateModule('./assets/data/investment-records.js.gz.b64', 'investmentRecords');
}

export async function loadInvestmentRowMap() {
  return inflateModule('./assets/data/investment-row-map.js.gz.b64', 'investmentRowMap');
}

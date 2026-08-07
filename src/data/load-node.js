import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';

async function readModule(path, exportName) {
  const encoded = await readFile(new URL(path, import.meta.url), 'utf8');
  const source = gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8');
  const module = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
  return module[exportName];
}

export const loadBuildingRecordsNode = () => readModule('../../assets/data/building-records.js.gz.b64', 'buildingRecords');
export const loadInvestmentRecordsNode = () => readModule('../../assets/data/investment-records.js.gz.b64', 'investmentRecords');
export const loadInvestmentRowMapNode = () => readModule('../../assets/data/investment-row-map.js.gz.b64', 'investmentRowMap');

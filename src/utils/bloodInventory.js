import { applyInventoryChange, INVENTORY_STATES, ZNBTS_FACILITY_ID, ZNBTS_FACILITY_NAME } from './networkInventory';

export const createReference = (prefix='INV') => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2,7).toUpperCase()}`;

export function facilityIdForHospital(hospitalId) { return `HOSP-${hospitalId}`; }

export function makeLot({ facilityId, facilityName, bloodGroup, units, collectionDate, expiryDate, status, source='Hospital collection', collectionReference, unitIdentifiers=[], storageLocation='', testingAuthority='', sourceFacilityId=null, sourceFacilityName=null, metadata={} }) {
  const qty = Number(units);
  const ids = unitIdentifiers.length ? unitIdentifiers : Array.from({length: qty}, (_,i) => `${collectionReference || createReference('UNIT')}-${i+1}`);
  return {
    id: createReference('LOT'), facilityId, facilityName, bloodGroup, quantity: qty, remaining: qty,
    collectionDate, expiryDate, status, source, collectionReference: collectionReference || createReference('COL'),
    unitIdentifiers: ids, storageLocation, testingAuthority, sourceFacilityId, sourceFacilityName,
    receivedAt: metadata.receivedAt || null, receivedBy: metadata.receivedBy || null,
    testingStatus: metadata.testingStatus || (status === INVENTORY_STATES.TESTING ? 'Pending' : status === INVENTORY_STATES.AVAILABLE ? 'Released' : 'Pending'),
    testingReference: metadata.testingReference || '', testResult: metadata.testResult || '', releaseReference: metadata.releaseReference || '',
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
  };
}

export function addLotState({ rows, lot, delta, transactionType, performedBy, referenceId, setRows, setLots, setTransactions, currentLots, audit, setAudit }) {
  const result = applyInventoryChange(rows, { ...delta, facilityId: lot.facilityId, facilityName: lot.facilityName, facilityType: lot.facilityType || (lot.facilityId === ZNBTS_FACILITY_ID ? 'ZNBTS' : 'Hospital'), province: 'Copperbelt', district: lot.district || '', bloodGroup: lot.bloodGroup, quantity: Math.abs(delta.quantity || delta.deltaAvailable || delta.deltaTesting || delta.deltaPendingTesting || delta.deltaIssued || delta.deltaExpired || delta.deltaDiscarded || 0), transactionType, referenceId: referenceId || lot.id, performedBy });
  setRows(result.rows); setTransactions(v => [result.transaction, ...v]);
  if (setAudit) setAudit(v => [{ id: createReference('AUD'), event: transactionType, detail: audit || `${lot.bloodGroup} ${lot.remaining} unit(s)`, time: new Date().toLocaleString() }, ...v]);
  return result;
}

export function updateLot(lots, id, patch) { return lots.map(l => l.id === id ? { ...l, ...patch, updatedAt: new Date().toISOString() } : l); }

export function consumeLots({ lots, rows, facilityId, facilityName, bloodGroup, units, performedBy, referenceId, transactionType='ISSUED' }) {
  let remaining = Number(units);
  let nextRows = rows;
  const tx = [];
  const updates = new Map();
  const eligible = lots.filter(l => l.facilityId === facilityId && l.bloodGroup === bloodGroup && l.status === INVENTORY_STATES.AVAILABLE && Number(l.remaining) > 0).sort((a,b) => String(a.expiryDate || '9999').localeCompare(String(b.expiryDate || '9999')));
  for (const lot of eligible) {
    if (!remaining) break;
    const take = Math.min(remaining, Number(lot.remaining));
    const r = applyInventoryChange(nextRows, { facilityId, facilityName, facilityType: facilityId === ZNBTS_FACILITY_ID ? 'ZNBTS' : 'Hospital', province:'Copperbelt', bloodGroup, quantity:take, deltaAvailable:-take, deltaIssued:take, transactionType, referenceId, performedBy });
    nextRows = r.rows; tx.push(r.transaction); remaining -= take; updates.set(lot.id, Number(lot.remaining) - take);
  }
  if (remaining > 0) throw new Error(`Insufficient available ${bloodGroup} stock. ${remaining} unit(s) could not be allocated.`);
  const nextLots = lots.map(l => updates.has(l.id) ? { ...l, remaining: updates.get(l.id), status: updates.get(l.id) === 0 ? INVENTORY_STATES.ISSUED : l.status, updatedAt:new Date().toISOString() } : l);
  return { rows: nextRows, lots: nextLots, transactions: tx };
}

export { INVENTORY_STATES, ZNBTS_FACILITY_ID, ZNBTS_FACILITY_NAME };

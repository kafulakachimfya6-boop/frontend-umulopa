import { describe, expect, it } from 'vitest';
import { applyInventoryChange, getFacilityInventory, ZNBTS_FACILITY_ID } from './networkInventory';

describe('blood service inventory lifecycle', () => {
  it('keeps collected blood pending when the hospital cannot test', () => {
    const r = applyInventoryChange([], { facilityId:'HOSP-3', facilityName:'Mufulira District Hospital', facilityType:'Hospital', province:'Copperbelt', district:'Mufulira', bloodGroup:'O+', quantity:5, deltaPendingTesting:5, transactionType:'DONATION_COLLECTED_AWAITING_ZNBTS_TESTING', referenceId:'COL-1', performedBy:'test' });
    const row = getFacilityInventory(r.rows, 'HOSP-3').find(x => x.bloodGroup === 'O+');
    expect(row.pendingTesting).toBe(5); expect(row.available).toBe(0); expect(row.testing).toBe(0);
  });
  it('moves a hospital pending lot into ZNBTS testing without creating available stock', () => {
    let rows=[];
    rows=applyInventoryChange(rows,{facilityId:'HOSP-3',facilityName:'Mufulira District Hospital',facilityType:'Hospital',bloodGroup:'O+',quantity:5,deltaPendingTesting:5,transactionType:'DONATION_COLLECTED_AWAITING_ZNBTS_TESTING',performedBy:'test'}).rows;
    rows=applyInventoryChange(rows,{facilityId:'HOSP-3',facilityName:'Mufulira District Hospital',facilityType:'Hospital',bloodGroup:'O+',quantity:5,deltaPendingTesting:-5,transactionType:'TRANSFER_TO_ZNBTS_TESTING',performedBy:'test'}).rows;
    rows=applyInventoryChange(rows,{facilityId:ZNBTS_FACILITY_ID,facilityName:'ZNBTS Kitwe Blood Centre (under Kitwe Teaching Hospital)',facilityType:'ZNBTS',bloodGroup:'O+',quantity:5,deltaTesting:5,transactionType:'RECEIVED_FOR_ZNBTS_TESTING',performedBy:'test'}).rows;
    const row=getFacilityInventory(rows,ZNBTS_FACILITY_ID).find(x=>x.bloodGroup==='O+');
    expect(row.testing).toBe(5); expect(row.available).toBe(0);
  });
  it('requires a positive release movement to create available stock', () => {
    let rows=[];
    rows=applyInventoryChange(rows,{facilityId:ZNBTS_FACILITY_ID,facilityName:'ZNBTS',facilityType:'ZNBTS',bloodGroup:'O+',quantity:4,deltaTesting:4,transactionType:'RECEIVED_FOR_ZNBTS_TESTING',performedBy:'test'}).rows;
    rows=applyInventoryChange(rows,{facilityId:ZNBTS_FACILITY_ID,facilityName:'ZNBTS',facilityType:'ZNBTS',bloodGroup:'O+',quantity:4,deltaTesting:-4,deltaAvailable:4,transactionType:'ZNBTS_TESTING_RELEASED',performedBy:'test'}).rows;
    const row=getFacilityInventory(rows,ZNBTS_FACILITY_ID).find(x=>x.bloodGroup==='O+');
    expect(row.testing).toBe(0); expect(row.available).toBe(4);
  });
  it('blocks negative inventory', () => {
    expect(() => applyInventoryChange([], {facilityId:ZNBTS_FACILITY_ID,facilityName:'ZNBTS',facilityType:'ZNBTS',bloodGroup:'A+',quantity:1,deltaAvailable:-1,transactionType:'BAD',performedBy:'test'})).toThrow(/negative/i);
  });
});

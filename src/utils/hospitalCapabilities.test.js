import { describe, expect, it } from "vitest";
import { defaultCapabilities, hasCapability } from "./hospitalCapabilities";
describe("hospital blood-service capabilities",()=>{
  it("defaults all capabilities to denied",()=>expect(defaultCapabilities()).toEqual({collection:false,testing:false,storage:false,processing:false,crossmatching:false,issue:false}));
  it("grants only explicitly authorized capabilities",()=>{const h={bloodServiceCapabilities:{collection:true,storage:true}};expect(hasCapability(h,"collection")).toBe(true);expect(hasCapability(h,"storage")).toBe(true);expect(hasCapability(h,"testing")).toBe(false);expect(hasCapability(h,"processing")).toBe(false);});
});

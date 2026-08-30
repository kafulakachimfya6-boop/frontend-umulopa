import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { useAppState } from "../../context/useAppState";
import "./auth.css";
import { hashPassword } from "../../utils/password";
import { CAPABILITY_LABELS, defaultCapabilities } from "../../utils/hospitalCapabilities";

const provinces = ["Copperbelt"];
const districts = ["Chingola", "Chililabombwe", "Kitwe", "Luanshya", "Lufwanyama", "Masaiti", "Mpongwe", "Mufulira", "Ndola"];

export default function HospitalSignup() {
  const { hospitals=[], setHospitals, adminUsers=[], setAdminUsers, hospitalAccounts=[], setHospitalAccounts, staffAccounts=[], setStaffAccounts, setAuditLogs } = useAppState();
  const navigate=useNavigate();
  const [form,setForm]=useState({hospitalName:"",hospitalType:"District Hospital",province:"Copperbelt",district:"",address:"",phone:"",email:"",adminName:"",adminEmail:"",password:"",confirmPassword:"",requestedCapabilities:defaultCapabilities()});
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const [success,setSuccess]=useState("");
  const update=(key,value)=>setForm(v=>({...v,[key]:value})); const toggleCapability=(key)=>setForm(v=>({...v,requestedCapabilities:{...v.requestedCapabilities,[key]:!v.requestedCapabilities[key]}}));
  const submit=async (e)=>{e.preventDefault();setError("");setSuccess("");
    if(form.password.length<8){setError("Password must be at least 8 characters long.");return;}
    if(form.password!==form.confirmPassword){setError("Passwords do not match.");return;}
    if(hospitals.some(h=>h.name.trim().toLowerCase()===form.hospitalName.trim().toLowerCase())){setError("This hospital is already registered.");return;}
    if(adminUsers.some(u=>u.email.toLowerCase()===form.adminEmail.trim().toLowerCase())){setError("This administrator email is already registered.");return;}
    setLoading(true);
    const id=Date.now();
    const passwordHash = await hashPassword(form.password);
    const hospital={id,name:form.hospitalName.trim(),type:form.hospitalType,province:form.province,district:form.district,address:form.address,phone:form.phone,email:form.email,status:"Pending",units:0,registeredAt:new Date().toISOString(),requestedBloodServiceCapabilities:form.requestedCapabilities,bloodServiceCapabilities:defaultCapabilities(),capabilityStatus:"Awaiting ZNBTS authorization",capabilityReviewedBy:null,capabilityReviewedAt:null};
    const account={id:`HA-${id}`,hospitalId:id,hospitalName:hospital.name,adminName:form.adminName.trim(),email:form.adminEmail.trim(),role:"staff",subRole:"Hospital Administrator",district:hospital.district,province:hospital.province,passwordHash,passwordSet:true,status:"Pending",createdAt:new Date().toISOString()};
    setHospitals(v=>[...v,hospital]); setHospitalAccounts(v=>[...v,account]); setStaffAccounts(v=>[...v,{...account,hospitalId:id,hospitalName:hospital.name}]); setAdminUsers(v=>[...v,{id:id+1,name:form.adminName.trim(),email:form.adminEmail.trim(),role:"staff",subRole:"Hospital Administrator",hospitalId:id,hospital:hospital.name,status:"Pending",passwordHash}]);
    setAuditLogs(v=>[{id:id+2,event:"Hospital registration submitted",detail:`${hospital.name} submitted a hospital and administrator account for ZNBTS review`,time:new Date().toLocaleString()},...v]);
    setLoading(false);setSuccess("Registration submitted successfully. ZNBTS will review the hospital and administrator account before activation.");
    setTimeout(()=>navigate("/login/staff",{replace:true}),900);
  };
  const fields=[
    ["Hospital name","hospitalName","text","e.g. Ndola Teaching Hospital"],["Official hospital email","email","email","hospital@example.org"],["Phone number","phone","tel","+260 XX XXX XXXX"],["Physical address","address","text","Hospital physical address"],
  ];
  return <AuthLayout title="Register your hospital" subtitle="Create a hospital profile and administrator account for the ZNBTS Copperbelt network." eyebrow="Hospital registration" footer={<><span>Already registered? </span><Link to="/login/staff">Sign in to hospital portal</Link></>}>
    <form className="auth-form" onSubmit={submit}>
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800"><b>Approval workflow:</b> Hospital registration → ZNBTS review → account activation → hospital dashboard access.</div>
      <div className="field-inline">{fields.slice(0,2).map(([label,key,type,placeholder])=><label className="field" key={key}><span className="label">{label}</span><input type={type} value={form[key]} onChange={e=>update(key,e.target.value)} placeholder={placeholder} required/></label>)}</div>
      <div className="field-inline">{fields.slice(2).map(([label,key,type,placeholder])=><label className="field" key={key}><span className="label">{label}</span><input type={type} value={form[key]} onChange={e=>update(key,e.target.value)} placeholder={placeholder} required/></label>)}</div>
      <div className="field-inline"><label className="field"><span className="label">Hospital type</span><select value={form.hospitalType} onChange={e=>update("hospitalType",e.target.value)} required><option>District Hospital</option><option>Teaching Hospital</option><option>Mission Hospital</option><option>Private Hospital</option><option>General Hospital</option><option>Health Centre</option></select></label><label className="field"><span className="label">Province</span><select value={form.province} onChange={e=>update("province",e.target.value)}>{provinces.map(x=><option key={x}>{x}</option>)}</select></label></div>
      <label className="field"><span className="label">District</span><select value={form.district} onChange={e=>update("district",e.target.value)} required><option value="">Select district</option>{districts.map(x=><option key={x}>{x}</option>)}</select></label>
      <div className="border-t border-slate-200 pt-5"><h3 className="text-base font-bold text-slate-800">Blood-service capability request</h3><p className="mt-1 text-sm text-slate-500">Select services your hospital is requesting. <b>ZNBTS decides which capabilities are actually granted.</b> A request does not authorize the service.</p><div className="mt-4 grid gap-3 sm:grid-cols-2">{Object.entries(CAPABILITY_LABELS).map(([key,label])=><label key={key} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3"><input type="checkbox" checked={form.requestedCapabilities[key]} onChange={()=>toggleCapability(key)} className="mt-1 h-4 w-4"/><span><b className="text-sm">{label}</b><span className="mt-1 block text-xs text-slate-500">Requested only; ZNBTS approval is required.</span></span></label>)}</div></div><div className="border-t border-slate-200 pt-5"><h3 className="text-base font-bold text-slate-800">Hospital administrator</h3><p className="mt-1 text-sm text-slate-500">This person will manage the hospital account after ZNBTS approval.</p></div>
      <div className="field-inline"><label className="field"><span className="label">Administrator name</span><input value={form.adminName} onChange={e=>update("adminName",e.target.value)} placeholder="Full name" required/></label><label className="field"><span className="label">Administrator email</span><input type="email" value={form.adminEmail} onChange={e=>update("adminEmail",e.target.value)} placeholder="admin@hospital.org" required/></label></div>
      <div className="field-inline"><label className="field"><span className="label">Password</span><input type="password" value={form.password} onChange={e=>update("password",e.target.value)} minLength={8} required/></label><label className="field"><span className="label">Confirm password</span><input type="password" value={form.confirmPassword} onChange={e=>update("confirmPassword",e.target.value)} minLength={8} required/></label></div>
      {error&&<p className="error-text" role="alert">{error}</p>}{success&&<p className="success-text">{success}</p>}
      <button className="btn primary" type="submit" disabled={loading}>{loading?"Submitting registration…":"Register hospital"}</button>
    </form>
  </AuthLayout>;
}

import { useState } from 'react';
import './App.css'
import CarrierRow from './CarrierRow';
import moment from 'moment';

function App() {

  const core = {name: "Core Services", cost: 5000000000, upkeep:{suspended: 5000000, active: 5000000}, cargo: 0, core:true};

  const data = [
    core,
    {name: "Refuel", cost: 40000000, upkeep: {suspended: 750000, active: 1500000}, cargo: 500},
    {name: "Repair", cost: 50000000, upkeep: {suspended: 750000, active: 1500000}, cargo: 180},
    {name: "Armoury", cost: 95000000, upkeep: {suspended: 750000, active: 1500000}, cargo: 250},
    {name: "Redemption Office", cost: 150000000, upkeep: {suspended: 850000, active: 1850000}, cargo: 100},
    {name: "Shipyard", cost: 250000000, upkeep: {suspended: 1800000, active: 6500000}, cargo: 3000},
    {name: "Outfitting", cost: 250000000, upkeep: {suspended: 1500000, active: 5000000}, cargo: 1750},
    {name: "Secure Warehouse", cost: 165000000, upkeep: {suspended: 1250000, active: 2000000}, cargo: 250},
    {name: "Universal Cartographics", cost: 150000000, upkeep: {suspended: 700000, active: 1850000}, cargo: 120},
    {name: "Concourse Bar", cost: 200000000, upkeep: {suspended: 1250000, active: 1750000}, cargo: 150},
    {name: "Vista Genomics", cost: 150000000, upkeep: {suspended: 700000, active: 1500000}, cargo: 120},
    {name: "Pioneer Supplies", cost: 250000000, upkeep: {suspended: 1500000, active: 5000000}, cargo: 200}
  ];

  const [services, setServices] = useState({
    [core.name]: { cost: core.cost, upkeep: core.upkeep.active, cargo: -25000}
  });

  const [jumps, setJumps] = useState(0);
  const [buget, setBuget] = useState(0);

  const serviceTotals = Object.values(services).reduce((a,c)=>{
    return {
      cost: a.cost + c.cost,
      upkeep: a.upkeep + c.upkeep,
      cargo: a.cargo + c.cargo
    }
  }, {cost: 0, upkeep: 0, cargo: 0});

  const totals = {
    ...serviceTotals,
    upkeep: serviceTotals.upkeep + (jumps*100000)
  }

  const coveredForDays = buget/(totals.upkeep/7);

  const coveredUntil = moment().add(coveredForDays, 'days');

  const durYears =  coveredUntil.diff(moment(), 'years');
  const durMonths = coveredUntil.clone().subtract(durYears, "years").diff(moment(), 'months');
  const durDays = coveredUntil.clone().subtract(durYears, "years").subtract(durMonths, "months").diff(moment(), 'days');

  const coveredUntilDuration = `${durYears}y ${durMonths}m ${durDays}d`

  return (
    <div style={{display: "flex", gap: "0.5rem", flexDirection: "column"}}>
      <div style={{fontWeight:"bold", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "0.5rem"}}>
        <span>Name</span>
        <span></span>
        <span>Cost</span>
        <span>Upkeep</span>
        <span>Cargo</span>
      </div>
      {data.map(x=>(
        <CarrierRow key={x.name} data={x} onStateChange={(e)=>{
          setServices({...services, [x.name]: e})
        }}/>
      ))}
      <div style={{display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "0.5rem"}}>
        <span>Planned Jumps per Week</span>
        <input min={0} style={{textAlign:"center"}} type='number' value={jumps} onChange={(e)=>setJumps(Math.round(e.target.value))}/>
        <span></span>
        <span>{(jumps*100000).toLocaleString('en-GB')} CR</span>
        <span></span>
      </div>
      <div style={{ 
        border: "0.1rem solid #49556B",
        borderRadius: "0.3rem",
        padding: "0.5rem",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        width: "fit-content",
        gap: "0.5rem"
      }}>
        <span>Total Cost:</span><span>{totals.cost.toLocaleString('en-GB')} CR</span>
        <span>Cargo Space:</span><span>{(-totals.cargo).toLocaleString('en-GB')} T</span>
        <span>Upkeep (Weekly):</span><span>{totals.upkeep.toLocaleString('en-GB')} CR</span>
        <span>Upkeep (Monthly):</span><span>{Math.round(totals.upkeep/7*30).toLocaleString('en-GB')} CR</span>
        <span>Upkeep (Yearly):</span><span>{Math.round(totals.upkeep/7*365).toLocaleString('en-GB')} CR</span>
        <div style={{ display: "flex", gap: "0.5rem"}}><span>Buget:</span><input min={0} style={{textAlign:"center"}} type='number' step={1000000} value={buget} onChange={(e)=>setBuget(Math.round(e.target.value))}/></div><span>{buget.toLocaleString("en-GB")} CR</span>
        <span>Covered until:</span><span>{buget>0 ? `${coveredUntil.format("YYYY MMM DD")} (${coveredUntilDuration})` : "Input available buget"}</span>
      </div>
    </div>
  )
}

export default App

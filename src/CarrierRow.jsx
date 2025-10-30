import { useState } from "react"
import './CarrierRow.css'

const getCosts = (state, data)=>{
    if(state==="none") return { cost: 0, upkeep: 0, cargo: 0};
    if(state==="suspended") return { cost: data.cost, upkeep: data.upkeep.suspended, cargo: data.cargo};
    if(state==="active") return { cost: data.cost, upkeep: data.upkeep.active, cargo: data.cargo};
}

export default function CarrierRow({data, onStateChange}){
    const [selectedUpkeep, setSelectedUpkeep] = useState(localStorage.getItem(data.name) || "none"); //none, suspended, active

    const updateState = (state)=>{
        setSelectedUpkeep(state);
        localStorage.setItem(data.name, state);
        const {cost, upkeep, cargo} = getCosts(state, data);
        onStateChange({
            state,
            cost,
            upkeep,
            cargo
        });
    };

    return (
        <div className="row" style={{display: "grid", alignItems: "center", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", gap: "0.5rem"}}>
            <span>{data.name}</span>
            <div style={{
                visibility: data.core ? "hidden" : "visible",
                display: "flex",
                flexDirection: "row",
                justifyContent:"center"
            }}>
                {selectedUpkeep==="none" && <button style={{width: "11.5rem"}} onClick={()=>updateState("active")}>Install</button>}
                {selectedUpkeep!=="none" && 
                    <div style={{width: "11.5rem", display:"grid", gap: "0.5rem", gridTemplateColumns:"3.5rem 7.5rem"}}>
                        <button className="remove" onClick={()=>updateState("none")}>X</button>
                        <button className={selectedUpkeep==="active" ? "active" : "suspended"} onClick={()=>updateState(selectedUpkeep==="active" ? "suspended" : "active")}>{selectedUpkeep==="active" ? "Active" : "Suspended"}</button>
                    </div>
                }
            </div>
            <span>{(data.core ? data.cost : (selectedUpkeep==="none" ? 0 : data.cost)).toLocaleString('en-GB')} CR</span>
            <span>{(data.core ? data.upkeep.active : (selectedUpkeep==="none" ? 0 : data.upkeep[selectedUpkeep])).toLocaleString('en-GB')} CR</span>
            <span>{data.cargo.toLocaleString('en-GB')} T</span>
        </div>
    )

}


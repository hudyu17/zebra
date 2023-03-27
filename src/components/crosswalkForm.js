import { useState, useEffect } from "react";
import MapComponent from "./map";


export default function Places({ markers, session, locArray, setLoaded }) {
    const [selected, setSelected] = useState(null);
    
    useEffect(() => {
        if (selected !== null) {
            setViewState({longitude: selected.lng, latitude: selected.lat, zoom: 18})
            console.log(selected)
        }
    }, [selected])
    
    
    return (
        <MapComponent markers={markers} session={session} locArray={locArray} setLoaded={setLoaded}/>        
    );
}
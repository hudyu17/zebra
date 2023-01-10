import { useState, useMemo, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import SearchBox from "./searchBox";
import MapComponent from "./map";
import Layout from "./layout";

export default function Places() {
    const [selected, setSelected] = useState(null);
    const [viewState, setViewState] = useState({
        longitude: -79.4005188,
        latitude: 43.6622882,
        zoom: 10
      });
    
    
    useEffect(() => {
        // for checking purposes
        console.log(selected)
        if (selected !== null) {
            setViewState({longitude: selected.lng, latitude: selected.lat, zoom: 18})
            console.log(selected)
        }
    }, [selected])
    
    return (
        <Layout main={<div>
            <SearchBox setSelected={setSelected}/>
            {selected && 
                <div>
                    <p>your selected latitude: {selected.lat}</p>
                    <p>your selected longitude: {selected.lng}</p>
                </div>
            }
            <MapComponent viewState={viewState} setViewState={setViewState} mapStyle="mapbox://styles/mapbox/streets-v9"/>; 
            {/* can switch "streets" to "satellite" */}
        </div>}/>
        
    );
}

// function Map() {
//   const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
//   const [selected, setSelected] = useState(null);
//     useEffect(() => {
//         console.log(selected)
//     }, [selected])
//   return (
//     <>
//       <div className="places-container">
//         <PlacesAutocomplete setSelected={setSelected} />
//       </div>
//     </>
//   );
// }

// const PlacesAutocomplete = ({ setSelected }) => {
//   const {
//     ready,
//     value,
//     setValue,
//     suggestions: { status, data },
//     clearSuggestions,
//   } = usePlacesAutocomplete();

//   const handleSelect = async (address) => {
//     setValue(address, false);
//     clearSuggestions();

//     const results = await getGeocode({ address });
//     const { lat, lng } = await getLatLng(results[0]);
//     setSelected({ lat, lng });
//   };

//   return (
//     <Combobox onSelect={handleSelect}>
//       <ComboboxInput
//         value={value}
//         onChange={(e) => setValue(e.target.value)}
//         disabled={!ready}
//         className="combobox-input"
//         placeholder="Search an address"
//       />
//       <ComboboxPopover>
//         <ComboboxList>
//           {status === "OK" &&
//             data.map(({ place_id, description }) => (
//               <ComboboxOption key={place_id} value={description} />
//             ))}
//         </ComboboxList>
//       </ComboboxPopover>
//     </Combobox>
//   );
// };
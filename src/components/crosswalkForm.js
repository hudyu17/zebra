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

export default function Places({ markers }) {
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
        <Layout main={<div className="grid gap-4">
            <MapComponent markers={markers}/>; 
        </div>}/>
        
    );
}
import { useState, useEffect } from "react";
import { useLoadScript } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'
import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
  } from "@reach/combobox";
  import "@reach/combobox/styles.css";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

export default function SearchBox() {
    
    const [selected, setSelected] = useState(null);
    
    // for checking purposes
    useEffect(() => {
        console.log(selected)
    }, [selected])

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries: ["places"],
    });

  
    if (!isLoaded) return (
        <div className="flex items-center justify-center h-screen">Loading... </div>
    );
    return <PlacesAutocomplete setSelected={setSelected} />;
}


export const PlacesAutocomplete = ({ setSelected }) => {
    const {
        ready,
        value,
        setValue,
        suggestions: { status, data },
        clearSuggestions,
    } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
           <ComboboxInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={!ready}
            className="w-1/2 border-2 border-gray-800 p-4 rounded-md"
            placeholder="Search an address"
          />
          <ComboboxPopover>
            <ComboboxList>
              {status === "OK" &&
                data.map(({ place_id, description }) => (
                  <ComboboxOption key={place_id} value={description} />
                ))}
            </ComboboxList>
          </ComboboxPopover>
        </Combobox>
  );
};
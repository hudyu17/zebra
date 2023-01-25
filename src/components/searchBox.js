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

const libraries = ['places']
export default function SearchBox({ setSelected }) {
    
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
        libraries,
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
    } = usePlacesAutocomplete({
        requestOptions: {
            componentRestrictions: { country: ["US", "CA"], },
          },
          debounce: 300,
    });

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
            className="w-full lg:w-96 shadow-sm p-4 rounded-md text-gray-900"
            placeholder="Jump to a location..."
          />
          <ComboboxPopover className="mt-4 rounded-md">
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
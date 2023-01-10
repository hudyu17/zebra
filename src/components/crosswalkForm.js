// import { useForm } from "react-hook-form";
// import { useState, useEffect } from "react";
 
//  export default function CrosswalkForm() {
//     const [submitting, setSubmitting] = useState(false);
//     const {
//         register,
//         handleSubmit,
//         setValue,
//         watch,
//         formState: { errors }
//     } = useForm({ defaultValues: {} });

//     const handleCreate = async(data) => {}

//     const onSubmit = (data) => {
//         setSubmitting(true)
//         handleCreate(data)
//     }

//     useEffect(() => {
//         register({ name: "address" }, { required: "Please enter your address" });
//         register({ name: "latitude" }, { required: true, min: -90, max: 90 });
//         register({ name: "longitude" }, { required: true, min: -180, max: 180 });
//       }, [register]);

//     return (
//         <form onSubmit={handleSubmit(onSubmit)}>
//             <h1>Suggest a crosswalk</h1>
//             {errors.address && <p>{errors.address.message}</p>}
//             <input type="submit" />
//         </form>
//     )
//  }
 
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

export default function Places() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  
  if (!isLoaded) return <div>Loading... HUGE MESSAGE HERE</div>;
  return <Map />;

}

function Map() {
  const center = useMemo(() => ({ lat: 43.45, lng: -80.49 }), []);
  const [selected, setSelected] = useState(null);
    useEffect(() => {
        console.log(selected)
    }, [selected])
  return (
    <>
      <div className="places-container">
        <PlacesAutocomplete setSelected={setSelected} />
      </div>
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
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
        className="combobox-input"
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
import Link from "next/link"
import React, { useRef, useState, useEffect } from "react"
import Map, { Marker, Popup, ViewState } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBox from "./searchBox";

export default function MapComponent({ markers }) {
  const [selected, setSelected] = useState(null);
  const [addActive, setAddActive] = useState(false);
  const [cursorType, setCursorType] = useState('pointer')
  const [viewState, setViewState] = useState({
    longitude: -79.4005188,
    latitude: 43.6622882,
    zoom: 10
  });
  const [marker, setMarker] = useState(null) // could memo later if necessary

  const mapContainer = useRef(null);

  const handleClick = (evt) => {
    console.log(evt.lngLat)
    if (cursorType === 'crosshair') {
      setCursorType('pointer')

      // temp marker, not added to db
      setMarker({lat: evt.lngLat.lat, lng: evt.lngLat.lng})
    }
  }

  const handleAddClick = () => {
    setAddActive(true)
    setCursorType('crosshair')
  }

  const handleSelection = () => {
    setAddActive(false)

    // add to db
  }

  useEffect(() => {
    // for checking purposes
    console.log(selected)
    if (selected !== null) {
        setViewState({longitude: selected.lng, latitude: selected.lat, zoom: 18})
        console.log(selected)
    }
  }, [selected])

  return (
    <div className="text-black relative" >
      <SearchBox setSelected={setSelected}/>
        {!addActive && 
          <button
            type="button"
            className="inline-flex w-40 items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={handleAddClick}
          >
            <p>add a crosswalk</p>
          </button>
        }     
        {addActive &&
            <button
            type="button"
            className="inline-flex w-40 items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={handleSelection}
          >
            <p>confirm selection</p>
          </button>
        }      
            
      <div ref={mapContainer}>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{width: '100vw', height: '100vh'}}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
          onClick={(evt) => handleClick(evt)}
          cursor={cursorType}
        >
          {marker && 
            <Marker
              longitude={marker.lng}
              latitude={marker.lat}
              anchor="center"
            />
          }
          
        </Map>
      </div>
    </div>
  )
}

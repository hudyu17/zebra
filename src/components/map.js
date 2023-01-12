import Link from "next/link"
import React, { useRef, useState, useEffect } from "react"
import Map, { Marker, Popup, ViewState } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBox from "./searchBox";
import AuthModal from "./authModal";
import { createCrosswalk } from "../utils/db/crosswalk";
import axios from "axios";

export default function MapComponent({ markers, session }) {
  const [modalOpen, setModalOpen] = useState(false)
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
    if (!session) {
      console.log('need auth')
      setModalOpen(true)
      return
    }
    setAddActive(true)
    setCursorType('crosshair')
  }

  const handleSelection = async () => {
    setAddActive(false)
    
    // add to db
    const userId = session.user.email;
    const lat = marker.lat;
    const lng = marker.lng;

    await axios.post("/api/db/createCrosswalk", {
      userId, lat, lng
    });
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
    <div className="text-black">
      <div className="absolute z-10 flex gap-6 p-6">
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
      {addActive && cursorType==="crosshair" &&
        <button
          type="button"
          className="cursor-not-allowed inline-flex w-40 items-center rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          disabled
        >
          <p>select a location on the map</p>
        </button>
      } 
      {addActive && cursorType==="pointer" &&
          <button
          type="button"
          className="inline-flex w-40 items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          onClick={handleSelection}
        >
          <p>confirm selection</p>
        </button>
      }      
      </div>
      <div ref={mapContainer} className=''>
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{width: '100%', height: '100vh'}}
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

      <AuthModal open={modalOpen} setOpen={setModalOpen}/>
    </div>
  )
}

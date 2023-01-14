import Link from "next/link"
import React, { useRef, useState, useEffect, useMemo } from "react"
import Map, { Marker, Popup, ViewState } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBox from "./searchBox";
import AuthModal from "./authModal";
import axios from "axios";
import CrosswalkPanel from "./crosswalkPanel";

export default function MapComponent({ markers, session, locArray }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [selected, setSelected] = useState(null);
  const [addActive, setAddActive] = useState(false);
  const [cursorType, setCursorType] = useState('pointer')
  const [viewState, setViewState] = useState({
    // longitude: -79.4005188,
    // latitude: 43.6622882,
    longitude: locArray[0],
    latitude: locArray[1],
    zoom: locArray[2]
  });
  const [marker, setMarker] = useState(null) // could memo later if necessary

  const mapContainer = useRef(null);

  const handleClick = (evt) => {
    console.log(evt.lngLat)
    if (cursorType === 'crosshair') {
      setCursorType('pointer')

      // temp marker, not added to db
      setMarker({lat: evt.lngLat.lat, lng: evt.lngLat.lng})
      setPanelOpen(true)
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

  const handleCancel = () => {
    setAddActive(false)
    setCursorType('pointer')
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

  useEffect(() => {
    if (!panelOpen && addActive) {
      setCursorType('crosshair')
    }
  })

  const existingMarkers = useMemo(
    () =>
      markers.map((marker) => (
        <Marker
          key={`marker-${marker.id}`}
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="center"
        />
      )),
    []
  );

  return (
    <div>
      <div className="absolute z-10 flex gap-6 p-6">
          <SearchBox setSelected={setSelected}/>
          
          {!addActive && 
            <button
              type="button"
              className="inline-flex w-44 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleAddClick}
            >
              <p className="text-align-center">Suggest your own crosswalk</p>
            </button>
          } 

          {addActive &&
            <button
              type="button"
              className="cursor-not-allowed inline-flex w-44 items-center justify-center rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled
            >
              <p className="text-align-center px-4">Select a location on the map</p>
            </button>
          } 

          {/* {addActive && cursorType==="pointer" &&
              <button
              type="button"
              className="inline-flex w-44 items-center justify-center  rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleSelection}
            >
              <p className="text-align-center">Confirm selection</p>
            </button>
          }       */}

          {addActive &&
            <button
              type="button"
              className="inline-flex w-24 items-center justify-center rounded-md border border-transparent bg-red-400 px-4 hover:bg-red-500 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleCancel}
            >
              <p className="text-align-center px-4">Cancel</p>
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
              <div>
                <Marker
                  longitude={marker.lng}
                  latitude={marker.lat}
                  anchor="center"
                />
              </div>
            }

            {existingMarkers}
          </Map>
        </div>
        <CrosswalkPanel open={panelOpen} setOpen={setPanelOpen} marker={marker} session={session}/>
        
        <AuthModal open={modalOpen} setOpen={setModalOpen} viewState={viewState}/>
    </div>
  )
}

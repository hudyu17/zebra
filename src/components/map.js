import Link from "next/link"
import React, { useRef, useState, useEffect, useMemo } from "react"
import Map, { Marker, Popup, ViewState } from "react-map-gl"
import mapPopup from "./popup";
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBox from "./searchBox";
import AuthModal from "./authModal";
import axios from "axios";
import CrosswalkPanel from "./crosswalkPanel";
import { HandThumbUpIcon, HandThumbDownIcon, HeartIcon } from "@heroicons/react/24/outline";
import MaxModal from "./maxModal";

export default function MapComponent({ markers, session, locArray }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMaxOpen, setMaxModalOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [popupInfo, setPopupInfo] = useState(null);
  
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
    // console.log(evt.lngLat)
    if (cursorType === 'crosshair') {
      setCursorType('pointer')

      // temp marker, not added to db
      setMarker({lat: evt.lngLat.lat, lng: evt.lngLat.lng})
      setPanelOpen(true)
    }
  }

  

  const handleAddClick = async () => {
    if (!session) {
      console.log('need auth')
      setModalOpen(true)
      return
    }

    // Check if user has hit upload limit
    const userId = session.user.email;
    await axios.post("/api/db/checkUser", {
      userId
    }).then(response => {
      // console.log(response.data._count.id)
      if (response.data._count.id >= 5) {
        setMaxModalOpen(true)
        return
      } else {
        setAddActive(true)
        setCursorType('crosshair')
      }
    })
  }

  const handleCancel = () => {
    setAddActive(false)
    setCursorType('pointer')
    setMarker(null)
  }

  const checkCrosswalk = async (crosswalk) => {
    if (session) {
      const markerId = crosswalk.id;
      const userId = session.user.email;
  
      await axios.post("/api/db/checkCrosswalk", {
        userId, markerId
      }).then(response => {
        // console.log(response.data)
        setPopupInfo({marker: response.data.marker, upvoted: response.data.upvoted})
      }).catch(error => {
        console.log(error.response.data)
      })
    } else {
      setPopupInfo({marker: crosswalk, upvoted: false})
    }
  }

  const handleUpvote = async (crosswalk) => {
    if (!session) {
      console.log('need auth')
      setModalOpen(true)
      return
    }

    const markerId = popupInfo.marker.id;
    const userId = session.user.email;

    // if not voted yet, add a vote
    if (!popupInfo.upvoted) {
      await axios.post("/api/db/upvoteCrosswalk", {
        userId, markerId
      }).catch(error => {
        console.log(error.response.data)
      })
    } else {
      // if already voted, remove a vote
      await axios.post("/api/db/downvoteCrosswalk", {
        userId, markerId
      }).catch(error => {
        console.log(error.response.data)
      })
    }
    checkCrosswalk(crosswalk)
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
          onClick={e => {
            // prevent autoclose
            e.originalEvent.stopPropagation();
            
            checkCrosswalk(marker);
            setViewState({longitude: marker.longitude, latitude: marker.latitude, zoom: 19})
          }}
        >
          <img className="h-10 w-10" src="/crosswalk.svg"/>
        </Marker>
      )),
    []
  );

  return (
    <div>
      <div className="absolute z-10 flex gap-3 lg:gap-6 px-3 pt-16 lg:pl-6 lg:pt-6 lg:flex-row flex-col w-full">
          <SearchBox setSelected={setSelected}/>
          
          {!addActive && 
            <button
              type="button"
              className="inline-flex lg:w-44 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleAddClick}
            >
              <p className="text-align-center">Suggest your own crosswalk</p>
            </button>
          } 

          {addActive &&
            <button
              type="button"
              className="cursor-not-allowed inline-flex lg:w-44 items-center justify-center rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              disabled
            >
              <p className="text-align-center px-4">Select a location on the map</p>
            </button>
          } 

          {addActive &&
            <button
              type="button"
              className="inline-flex lg:w-24 items-center justify-center rounded-md border border-transparent bg-red-400 px-4 hover:bg-red-500 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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
            mapStyle="mapbox://styles/hudsonyuen/cldahfklh000m01phstp7i9sb"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
            onClick={(evt) => handleClick(evt)}
            cursor={cursorType}
            maxZoom={20}
            minZoom={5}
          >
            {marker && 
              <div>
                <Marker longitude={marker.lng} latitude={marker.lat} anchor="center">
                  <img className="h-10 w-10" src="/crosswalk.svg"/>
                </Marker>
              </div>
            }

            {existingMarkers}

            {popupInfo && (
              // <mapPopup 
              //   lng={Number(popupInfo.marker.longitude)}
              //   lat={Number(popupInfo.marker.latitude)}
              //   setPopupInfo={setPopupInfo}
              //   address={popupInfo.marker.address}
              //   description={popupInfo.marker.description}
              //   votes={popupInfo.marker.votes}
              //   upvoted={popupInfo.upvoted}
              //   handleUpvote={handleUpvote}
              //   marker={popupInfo.marker}
              // />
              <Popup
                anchor="bottom"
                longitude={Number(popupInfo.marker.longitude)}
                latitude={Number(popupInfo.marker.latitude)}
                onClose={() => setPopupInfo(null)}
                closeButton={false}
                maxWidth="350px"
              >
                <div className="m-1 flex flex-col gap-1">
                  <h1 className="text-lg font-medium font-sans">{popupInfo.marker.address}</h1>
                  <p className="text-xs italic text-gray-700">Suggested by: <span className="font-medium">{popupInfo.marker.userName}</span></p>
                  <p className="text-sm mt-2">{popupInfo.marker.description}</p>
                  
                  <div className="flex gap-2 mt-3">
                  {popupInfo.upvoted ? 
                  <HeartIcon className="h-6 w-6 fill-red-500 cursor-pointer" onClick={() => handleUpvote(popupInfo.marker)}/>
                  :
                  <HeartIcon className="h-6 w-6 cursor-pointer" onClick={() => handleUpvote(popupInfo.marker)}/>
                  
                }
                  <p className="text-sm text-gray-700 my-auto">{popupInfo.marker.votes}</p>
                </div>
                  {/* <HandThumbDownIcon className="h-6 w-6 cursor-pointer" onClick={handleDownvote}/> */}
                </div>
                {/* <img width="100%" src={popupInfo.image} /> */}
              </Popup>
            )}
          </Map>
        </div>
        <CrosswalkPanel open={panelOpen} setOpen={setPanelOpen} marker={marker} session={session} edit={false}/>
        <AuthModal open={modalOpen} setOpen={setModalOpen} viewState={viewState}/>
        <MaxModal open={modalMaxOpen} setOpen={setMaxModalOpen}/>
    </div>
  )
}

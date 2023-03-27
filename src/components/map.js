import React, { useRef, useState, useEffect, useMemo } from "react"
import Map, { Marker, Popup, ViewState } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';
import SearchBox from "./searchBox";
import AuthModal from "./authModal";
import axios from "axios";
import CrosswalkPanel from "./crosswalkPanel";
import { HeartIcon, LinkIcon, PaperAirplaneIcon, ArrowSmallRightIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import MaxModal from "./maxModal";
import Copied from "./copied";
import { useRouter } from "next/router";

export default function MapComponent({ markers, session, locArray, setLoaded }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMaxOpen, setMaxModalOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [popupInfo, setPopupInfo] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  
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

  const locations = [
    {name: 'Toronto', long: -79.4005188, lat: 43.6622882},
    {name: 'NYC', long: -73.960412, lat: 40.750808},
    {name: 'London', long: -0.075278, lat: 51.505554},
    {name: 'HK', long: 114.163589, lat: 22.273643},
  ]

  const mapContainer = useRef(null);
  const mapRef = useRef();
  const router = useRouter();

  const handleClick = (evt) => {
    if (cursorType === 'crosshair') {
      setCursorType('pointer')

      // Set state with temp marker, not added to db
      setMarker({lat: evt.lngLat.lat, lng: evt.lngLat.lng})
      setPanelOpen(true)
    }
  }


  const handleAddClick = async () => {
    if (!session) {
      setModalOpen(true)
      return
    }

    // Check if user has hit upload limit, currently 5
    const userId = session.user.email;
    await axios.post("/api/db/checkUser", {
      userId
    }).then(response => {
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

    // If not voted yet, add a vote
    if (!popupInfo.upvoted) {
      await axios.post("/api/db/upvoteCrosswalk", {
        userId, markerId
      }).catch(error => {
        console.log(error.response.data)
      })
    } else {
      // If already voted, remove a vote
      await axios.post("/api/db/downvoteCrosswalk", {
        userId, markerId
      }).catch(error => {
        console.log(error.response.data)
      })
    }
    checkCrosswalk(crosswalk)
  }
  
  const copyLink = (info) => {
    navigator.clipboard.writeText(`https://crossywalk.com/${info.longitude},${info.latitude},19`);
    setShowCopied(true)
  }

  const jumpLocation = (location) => {
    mapRef.current?.flyTo({
      center: [location.long, location.lat],
      zoom: 12,
      speed: 4,
    })
    setPopupInfo(null)
    router.push(`/${location.long},${location.lat},12`, undefined, { shallow: true })
  }

  useEffect(() => {

    if (selected !== null) {
        setPopupInfo(null)
        mapRef.current?.flyTo({
          center: [selected.lng, selected.lat],
          zoom: 18,
          speed: 1.8,
        })
        console.log(selected)
    }
  }, [selected])

  useEffect(() => {
    if (!panelOpen && addActive) {
      setCursorType('crosshair')
    }
  })

  useEffect(() => {
    setTimeout(()=>{
      setShowCopied(false)
     }, 5000)
  }
  , [showCopied])

  const existingMarkers = useMemo(
    () =>
      markers.map((marker) => (
        <Marker
          key={`marker-${marker.id}`}
          longitude={marker.longitude}
          latitude={marker.latitude}
          anchor="center"
          onClick={e => {
            // Prevent autoclose
            e.originalEvent.stopPropagation();
            
            checkCrosswalk(marker);
            mapRef.current?.flyTo({
              center: [marker.longitude, marker.latitude],
              zoom: 19,
              speed: 1.8,
            })
          }}
        >
          <img className="h-10 w-10" src="/crosswalk.svg"/>
        </Marker>
      )),
    []
  );

  return (
    <div>
      <div className="absolute z-10 flex gap-3 lg:gap-6 px-3 pt-16 lg:px-6 lg:pt-6 lg:flex-row flex-col w-full lg:w-auto">
          <SearchBox setSelected={setSelected}/>
          
          {!addActive && 
            <button
              type="button"
              className="inline-flex lg:h-14 lg:w-48 items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              onClick={handleAddClick}
            >
              <PlusIcon className="-ml-1 mr-1 h-5 w-5" aria-hidden="true" />
              <p>
                Suggest crosswalk
              </p>
            </button>
          } 

          {addActive &&
            <button
              type="button"
              className="cursor-not-allowed inline-flex lg:w-48 items-center justify-center rounded-md border border-transparent bg-gray-400 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

          <div className="order-first lg:hidden flex gap-3 justify-between">
            {locations.map((location) => (
              <button
                className="inline-flex text-xs lg:text-sm lg:w-30 grow items-center justify-center rounded-md border border-transparent bg-zinc-400 px-4 hover:bg-zinc-500 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                onClick={() => jumpLocation(location)}
              >
                {location.name}
                <ArrowSmallRightIcon className="hidden sm:block ml-1 my-auto h-4 w-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>

        {/* Jump buttons in large view */}
        <div className="absolute z-10 lg:ml-auto flex lg:flex-col gap-3 justify-between lg:w-30 lg:top-6 lg:right-6 lg:mb-0">
            {locations.map((location) => (
              <button
                className="inline-flex text-xs lg:text-sm lg:w-30 grow items-center justify-center rounded-md border border-transparent bg-zinc-400 px-4 hover:bg-zinc-500 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
                onClick={() => jumpLocation(location)}
              >
                {location.name}
                <ArrowSmallRightIcon className="hidden sm:block ml-1 my-auto h-4 w-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        
        <div ref={mapContainer} className=''>
          <Map
            {...viewState}
            ref={mapRef}
            onMove={evt => setViewState(evt.viewState)}
            style={{width: '100%', height: '100vh'}}
            mapStyle="mapbox://styles/hudsonyuen/cldahfklh000m01phstp7i9sb"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
            onClick={(evt) => handleClick(evt)}
            cursor={cursorType}
            maxZoom={20}
            minZoom={3}
            onLoad={() => setLoaded(true)}
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
              <Popup
                anchor="bottom"
                longitude={Number(popupInfo.marker.longitude)}
                latitude={Number(popupInfo.marker.latitude)}
                onClose={() => setPopupInfo(null)}
                closeButton={false}
                maxWidth="350px"
              >
                <div className="m-1 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <h1 className="text-lg font-medium font-sans">{popupInfo.marker.address}</h1>
                    <LinkIcon 
                      className="h-5 w-5 cursor-pointer my-auto text-gray-600 hover:text-indigo-900"
                      onClick={() => copyLink(popupInfo.marker)}
                    />
                  </div>
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
                </div>
              </Popup>
            )}
          </Map>
        </div>
        <CrosswalkPanel open={panelOpen} setOpen={setPanelOpen} marker={marker} session={session} edit={false}/>
        <AuthModal open={modalOpen} setOpen={setModalOpen} viewState={viewState}/>
        <MaxModal open={modalMaxOpen} setOpen={setMaxModalOpen}/>
        <Copied show={showCopied} setShow={setShowCopied}/>
    </div>
  )
}

import Link from "next/link"
import React, { useRef, useState } from "react"
import Map, { Marker, Popup, ViewState } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';


export default function MapComponent({viewState, setViewState, mapStyle}) {

  const mapContainer = useRef(null);

  return (
    <div className="text-black relative" ref={mapContainer}>
        <Map
          viewState={viewState}
          onMove={evt => setViewState(evt.viewState)}
          style={{width: '100vw', height: '100vh'}}
          mapStyle={mapStyle}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
        />
    </div>
  )
}

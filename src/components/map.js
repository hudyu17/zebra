import Link from "next/link"
import React, { useRef, useState } from "react"
import Map, { Marker, Popup, ViewState } from "react-map-gl"
import 'mapbox-gl/dist/mapbox-gl.css';


export default function MapComponent() {

  const mapContainer = useRef(null);

  return (
    <div className="text-black relative" ref={mapContainer}>
        <Map
          initialViewState={{
            longitude: -122.4,
            latitude: 37.8,
            zoom: 14,

          }}
          style={{width: '100vw', height: '100vh'}}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN}
        />
    </div>
  )
}

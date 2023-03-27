import { Popup } from "react-map-gl"

export default function mapPopup({ lng, lat, setPopupInfo, address, description, votes, upvoted, handleUpvote, marker }){
  return (
    <Popup
        anchor="top"
        longitude={lng}
        latitude={lat}
        onClose={() => setPopupInfo(null)}
        >
        <div>
            <p>{address}</p>
            <p>{description}</p>
            <p>{votes}</p>
            {upvoted ? 
            <HandThumbUpIcon className="h-6 w-6 fill-blue-500 cursor-pointer" onClick={() => handleUpvote(marker)}/>
            :
            <HandThumbUpIcon className="h-6 w-6 cursor-pointer" onClick={() => handleUpvote(marker)}/>
        }
        </div>
    </Popup>
  )
}

import { Marker, Popup } from "react-leaflet";
import { Link } from "react-router-dom";
import L from "leaflet";

const customIcon = L.icon({
  iconUrl: "/pin.png",
  iconSize: [30, 40],
  iconAnchor: [15, 40],
});

function Pin({ item }) {
  return (
    <Marker position={[item.latitude, item.longitude]} icon={customIcon}>
      <Popup>
        <div className="flex flex-col gap-5">
          <img
            src={item.images[0].imageUrl}
            alt={item.title}
            className="w-16 h-12 object-cover rounded-md"
          />
          <div className="flex flex-col justify-between">
            <Link
              to={`/${item._id}`}
              className="text-blue-600 font-semibold hover:underline"
            >
              {item.title}
            </Link>
            <span className="text-gray-500 text-sm">
              {item.bedroom} bedroom
            </span>
            <b className="text-yellow-500">$ {item.price}</b>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default Pin;

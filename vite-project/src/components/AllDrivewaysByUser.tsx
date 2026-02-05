import axios from "axios";
import { useEffect, useState } from "react";
import '../style/AllDrivewaysByUser.css'

interface Driveway {
  _id: string;
  address: string;
  walk: number;
  name:string;
  price: number;
  images: string[];
}

export function AllDrivewaysByUser({ user }: { user: string }) {
  const [driveways, setDriveways] = useState<Driveway[]>([]);

  useEffect(() => {
    async function fetchDriveways() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/driveways/getAllDrivewaysByUserId/${user}`
        );
        setDriveways(res.data.driveways);
        console.log(res.data.driveways)
      } catch (err) {
        console.error(err);
      }
    }

    fetchDriveways();
  }, [user]);

  return (
  <>
        {driveways[0] && (
        <>
          <div className="drivewayCard">
          <h3 className="drivewayName">{driveways[0].name}</h3>
          <button className="editDrivewayBtn">Edit Driveway</button>
          </div>
        </>
      
        )}
  </>
  );
}

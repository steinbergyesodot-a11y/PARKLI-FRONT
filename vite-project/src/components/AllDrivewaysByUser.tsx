import axios from "axios";
import { useEffect, useState } from "react";

interface Driveway {
  _id: string;
  address: string;
  walk: number;
  price: number;
  images: string[];
}

export function AllDrivewaysByUser({ user }: { user: string }) {
  const [driveways, setDriveways] = useState<Driveway[]>([]);

  useEffect(() => {
    async function fetchDriveways() {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/driveways/getAllDrivewaysByUserId/${user}`
        );
        setDriveways(res.data.driveways);
      } catch (err) {
        console.error(err);
      }
    }

    fetchDriveways();
  }, [user]);

  return (
    <div className="myDrivewaysList">
      <h2>My Driveways</h2>

    </div>
  );
}

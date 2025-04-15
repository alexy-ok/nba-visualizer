'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { Scatter } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';



ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

interface Shot {
    LOC_X: number;
    LOC_Y: number;
    SHOT_MADE_FLAG: number;
  }

  export default function shotHeatmap() {
    const { id } = useParams();
    const [shots, setShots] = useState<Shot[]>([]);
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
      setIsClient(true);
      console.log(id);
      axios
        .get(`http://localhost:5000/api/shots?playerId=${id}`) // Steph Curry
        .then((res) => setShots(res.data))
        .catch(console.error);
    }, []);
  
    const madeShots = shots.filter((s) => s.SHOT_MADE_FLAG === 1);
    const missedShots = shots.filter((s) => s.SHOT_MADE_FLAG === 0);
  
    const data = {
      datasets: [
        {
          label: 'Made',
          data: madeShots.map((s) => ({ x: s.LOC_X, y: s.LOC_Y })),
          backgroundColor: 'rgba(0, 255, 0, 0.5)',
        },
        {
          label: 'Missed',
          data: missedShots.map((s) => ({ x: s.LOC_X, y: s.LOC_Y })),
          backgroundColor: 'rgba(255, 0, 0, 0.5)',
        },
      ],
    };
  
    return (
      <>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="w-[600px] h-[600px]">
          <Scatter data={data} options={{
            scales: {
              x: { min: -250, max: 250 },
              y: { min: -50, max: 500 },
            }
          }} />
        </div>
      </div>
      </>
    );
  }

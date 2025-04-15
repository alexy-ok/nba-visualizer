"use client";
import ShotHeatmap from "./shotHeatmap";
import { Scatter } from 'react-chartjs-2';
import {useEffect, useState} from 'react';
import {Input} from "@/components/ui/input";
import axios from "axios";



export default function Page() {
    const [playerName, setPlayerName] = useState("Stephen Curry");
    const [playerId, setPlayerId] = useState("201939");
    const [data, setData] = useState({});
    const [error, setError] = useState<string | null>(null)

    async function searchPlayer (){
      
        try{
            const res = await axios.get(`http://localhost:5000/api/players?name=${playerName}`);
            console.log(res);
            if (res.data?.id){
                setPlayerId(res.data.id);
                setError(null);
            }
            else{
                
                setError('Player Not Found');
                
            }
        }
        catch (err) {
            console.error(err);
            setError('Error fetching player data');
        }
        console.log(playerId);
    }
    return (

        <div className="w-screen h-screen flex items-center justify-center flex-col">
            <div className="flex space-x-2">
            <Input placeholder="Search for Player" value={playerName} onChange={(e) => setPlayerName(e.target.value)} className="w-[300px]" />
            <button
                onClick={searchPlayer}
                className="bg-primary text-white px-4 py-2 rounded-md hover:opacity-90"
            >
                Search
            </button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            <ShotHeatmap id={playerId}/>
        </div>
    );
}
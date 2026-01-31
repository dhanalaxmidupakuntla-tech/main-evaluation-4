import { supabase } from '../config/supabaseClient.js';

export const createTrip = async (req, res) => {
    const { customer_id, vehicle_id, passengers, distance_km, location, start_date} = req.body;

    const { data: vehicle} = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicle_id)
        .single();

    if (!vehicle || !vehicle.isAvailable) {
        return res.status(400).json({ error: 'Vehicle is not available' });
    }

    if ( passengers > vehicle.allowed_passengers) {
        return res.status(400).json({ error: 'Number of passengers exceeds vehicle capacity' });
    }

    await supabase
        .from('vehicles')
        .update({ isAvailable: false })
        .eq('id', vehicle_id);

    
    const {data} = await supabase
        .from('trips')
        .insert([{ customer_id, vehicle_id, passengers, distance_km, location, start_date }])
        .select()
        .single();
    
    res.status(201).json(data);
}

export const endTrip = async (req, res) => {
    const { tripId } = req.params;
    
    const { data: trip} = await supabase
        .from('trips')
        .select("distance_km, vehicle_id")
        .eq('id', tripId)
        .single();
    
    const { data: vehicle} = await supabase
        .from('vehicles')
        .select('rate_per_km')
        .eq('id', trip.vehicle_id)
        .single();
    
    const tripCost = trip.distance_km * vehicle.rate_per_km;

    await supabase
        .from('trips')
        .update({ isCopleted:true, tripCost})
        .eq('id', tripId);
    
    await supabase
        .from('vehicles')
        .update({ isAvailable: true })
        .eq('id', trip.vehicle_id);
    
    res.status(200).json({ message: 'Trip ended successfully', tripCost });
}
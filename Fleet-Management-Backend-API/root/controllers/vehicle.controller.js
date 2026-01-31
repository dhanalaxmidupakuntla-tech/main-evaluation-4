import { supabase } from '../config/supabaseClient.js';

export const addVehicle = async (req, res) => {
    const {owner_id, name, registration_number, allowed_passengers, rate_per_km} = req.body;

    const { data: owner } = await supabase
        .from('vehicles')
        .select("role")
        .eq("id", owner_id)
        .single();
    
    if (!owner || !owner.role !== "onwer") {
        return res.status(403).json({ message: "Only owners can add vehicles." });
    }
    
    const {data, error} = await supabase
        .from('vehicles')
        .insert([{ name, registration_number, allowed_passengers, rate_per_km }])
        .select();

    if (error) {
        return res.status(500).json({ message: "Error adding vehicle", error });
    }
    res.status(201).json({ message: "Vehicle added successfully", vehicle: data });
}

export const assignDriver = async (req, res) => {
    const { vehicleId } = req.params;
    const { driver_id } = req.body;

    const { data: driver } = await supabase
        .from('users')
        .select("role")
        .eq("id", driver_id)
        .single();
    
    if (!driver || driver.role !== "driver") {
        return res.status(403).json({ message: "Only users with driver role can be assigned." });
    }
    
    await supabase
        .from('vehicles')
        .update({ driver_id })
        .eq('id', vehicleId);

    res.status(200).json({ message: "Driver assigned successfully" });
};

export const getvehicle = async (req, res) => {
    const { vehicleId } = req.params;
    const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('id', vehicleId)
        .single();
    
    if (!data) {
        return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json({ vehicle: data });
};
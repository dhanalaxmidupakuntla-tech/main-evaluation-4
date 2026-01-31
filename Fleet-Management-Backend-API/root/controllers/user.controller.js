import { supabase } from "../config/supabase.config.js";

export const regiterUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if ( !["customer", "owner", "driver"].includes(role) ) {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        const {data: existing } = await supabase
            .from("users")
            .select("id")
            .eq("email", email)
            .single();
        
        if (existing) {
            return res.status(409).json({ message: "User with this email already exists" });    
        }
        const { data, error } = await supabase
            .from("users")
            .insert([{ name, email, password, role }])
            .select()
            .single();

        if (error) {
            throw error;
        }

        res.status(201).json({ message: "User registered successfully", user: data });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}
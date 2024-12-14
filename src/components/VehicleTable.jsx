import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../utils/config";
const VehicleTable = () => {
    const [vehicles, setVehicles] = useState([]); // State to store the list of vehicles
    const [newVehicle, setNewVehicle] = useState({ name: '', status: 'Inactive' }); // Default status is 'Inactive'
    const [filterStatus, setFilterStatus] = useState('All'); // State to filter vehicles by status

    // Function to fetch vehicles from the API
    const fetchVehicles = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/api/vehicles`);
            if (res.data && Array.isArray(res.data)) {
                setVehicles(res.data);
            } else if (res.data.vehicles && Array.isArray(res.data.vehicles)) {
                setVehicles(res.data.vehicles); // Adjust if vehicles are nested
            } else {
                toast.error('Unexpected response format!');
            }
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            toast.error('Error fetching vehicles!');
        }
    };

    // Function to add a new vehicle
    const addVehicle = async () => {
        try {
            if (!newVehicle.name) {
                toast.error('Vehicle name is required!');
                return;
            }
            const res = await axios.post(`${BASE_URL}/api/vehicles`, newVehicle);
            fetchVehicles(); // Refresh the vehicle list
            setNewVehicle({ name: '', status: 'Inactive' }); // Clear the form and reset status
            toast.success('Vehicle added!');
        } catch (error) {
            console.error('Error adding vehicle:', error);
            toast.error('Error adding vehicle!');
        }
    };

    // Function to update the status of a vehicle
    const updateVehicleStatus = async (id, status) => {
        try {
            await axios.put(`${BASE_URL}/api/vehicles/${id}`, { status });
            fetchVehicles(); // Refresh the vehicle list
            toast.success(`Status updated to ${status}!`);
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Error updating status!');
        }
    };

    // Fetch vehicles when the component mounts
    useEffect(() => {
        fetchVehicles();
    }, []);

    // Filter vehicles based on the selected status
    const filteredVehicles = filterStatus === 'All'
        ? vehicles
        : vehicles.filter((vehicle) => vehicle.status === filterStatus);

    return (
        <div className="container mx-auto mt-10 max-w-6xl px-6">
            <h1 className="text-4xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-400">
                Vehicle Management Dashboard
            </h1>

            {/* Add New Vehicle Form */}
            <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-6">Add New Vehicle</h2>
                <div className="flex flex-col sm:flex-row gap-4">
                    <input
                        type="text"
                        placeholder="Vehicle Name"
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                        value={newVehicle.name}
                        onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                    />
                    <select
                        className="flex-1 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                        value={newVehicle.status}
                        onChange={(e) => setNewVehicle({ ...newVehicle, status: e.target.value })}
                    >
                        <option value="Inactive">Inactive</option>
                        <option value="Active">Active</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                    <button
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 shadow-md transition-all"
                        onClick={addVehicle}
                    >
                        Add Vehicle
                    </button>
                </div>
            </div>

            {/* Filter by Status */}
            <div className="mb-6 flex justify-end">
                <select
                    className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="All">All</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Maintenance">Maintenance</option>
                </select>
            </div>

            {/* Vehicle List Table */}
            <div className="bg-white shadow-lg rounded-xl">
                <table className="table-auto w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700">
                            <th className="p-4 font-semibold">Vehicle Name</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Last Updated</th>
                            <th className="p-4 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle) => (
                                <tr
                                    key={vehicle._id}
                                    className="border-b hover:bg-gray-100 transition-all"
                                >
                                    <td className="p-4 text-gray-800">{vehicle.name}</td>
                                    <td className="p-4 text-gray-800">{vehicle.status}</td>
                                    <td className="p-4 text-gray-800">
                                        {new Date(vehicle.lastUpdated).toLocaleString()}
                                    </td>
                                    <td className="p-4 flex gap-2">
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow-md transition-all"
                                            onClick={() => updateVehicleStatus(vehicle._id, 'Active')}
                                        >
                                            Set Active
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow-md transition-all"
                                            onClick={() => updateVehicleStatus(vehicle._id, 'Inactive')}
                                        >
                                            Set Inactive
                                        </button>
                                        <button
                                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 shadow-md transition-all"
                                            onClick={() => updateVehicleStatus(vehicle._id, 'Maintenance')}
                                        >
                                            Set Maintenance
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">
                                    No vehicles found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
};

export default VehicleTable;

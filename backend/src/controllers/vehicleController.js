const vehicles = require("../data/vehicles");

function getVehicles(req, res) {
    res.status(200).json({
        success: true,
        count: vehicles.length,
        data: vehicles,
    });
}

function getVehicleById(req, res) {
    const vehicle = vehicles.find((item) => item.id === req.params.id);

    if (!vehicle) {
        return res.status(404).json({
            success: false,
            message: "Vehicle not found",
        });
    }

    return res.status(200).json({
        success: true,
        data: vehicle,
    });
}

module.exports = { getVehicles, getVehicleById };

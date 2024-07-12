
const getAppointment = async (req, res) => {
    try {
        const appointment = (await Appointment.getAppointmentsById(req.params.id))[0];
        if (appointment) {
            res.status(200).send({ appointment: appointment });
        } else {
            res.sendStatus(404);
        }
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {

};

const Analytic = async (req, res) => {
    try {

        const { data } = req.body;

        return res.status(200).json({
            success: true,
            message: "Analytic successfully"
        });

    }
    catch (err) {
        console.log("Err while get dashboard analtytic: ", err);
    }
}

module.exports = Analytic;
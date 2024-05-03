const Logout = async (req, res) => {
    try {

        res.clearCookie('refresh_token', { domain: process.env.MODE === 'production' ? '.posyayee.shop' : '.localhost', path: "/" });
        res.clearCookie('access_token', { domain: process.env.MODE === 'production' ? '.posyayee.shop' : '.localhost', path: "/" });

        return res.status(200).json(
            {
                success: true,
                message: "Cookies deleted successfully"
            });
    }
    catch (err) {
        console.log("Err while deleting cookies", err);
        res.status(500).json({ error: "An error occurred while deleting cookies" });
    }
}

module.exports = Logout;
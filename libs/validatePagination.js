const validatePagination = async (query, allowedSortByAttributes, defaultSortBy) => {
    try {

        let { page = 1, perPage = 10, sortBy = defaultSortBy, sort = 'ASC' } = query;
        page = parseInt(page);
        perPage = parseInt(perPage);

        // Validate page and perPage values
        if (isNaN(page) || isNaN(perPage) || page < 1 || perPage < 1) {
            return res.status(400).json(
                {
                    success: false,
                    message: 'Invalid page or perPage value'
                });
        }

        const offset = (page - 1) * perPage;

        // Validate sortBy and sort values;
        if (!allowedSortByAttributes.includes(sortBy)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sortBy attribute'
            });
        }

        if (sort.toUpperCase() !== 'ASC' && sort.toUpperCase() !== 'DESC') {
            return res.status(400).json({
                success: false,
                message: 'Invalid sort order'
            });
        }

        return {
            page: page,
            perPage: perPage,
            sortBy: sortBy,
            sort: sort.toUpperCase(),
            offset: offset
        };
    }
    catch (err) {
        console.error("Err while validate pagination", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = validatePagination;
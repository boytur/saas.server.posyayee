const validatePagination = async (query, allowedSortByAttributes, defaultSortBy) => {
    try {

        let { page = 1, perPage = 10, sortBy = defaultSortBy, sort = 'ASC' } = query;
        page = parseInt(page);
        perPage = parseInt(perPage);

        // Validate page and perPage values
        if (isNaN(page) || isNaN(perPage) || page < 1 || perPage < 1) {
            return false;
        }

        const offset = (page - 1) * perPage;

        // Validate sortBy and sort values;
        if (!allowedSortByAttributes.includes(sortBy)) {
            return false;
        }

        if (sort.toUpperCase() !== 'ASC' && sort.toUpperCase() !== 'DESC') {
            return false;
        }

        const validated = {
            page: page,
            perPage: perPage,
            sortBy: sortBy,
            sort: sort.toUpperCase(),
            offset: offset
        }

        return validated;

    }
    catch (err) {
        console.error("Err while validate pagination", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
module.exports = validatePagination;
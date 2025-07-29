const buildWhereClause = (filters) => {
    let whereClause = '';
    const params = [];

    if (filters && filters.length > 0) {
        filters.forEach((filter, index) => {
            whereClause += `${index === 0 ? " WHERE " : filter.op_attr} ${filter.key} ${filter.op} ? `;
            params.push(`${filter.op_starts_with}${filter.value}${filter.op_ends_with}`);
        });
    }

    return { whereClause, params };
};

const buildOrderByClause = (filters) => {
    let orderByClause = ``;

    if (!filters || filters.length === 0) {
        orderByClause = ` ORDER BY cree_le DESC `;
    }

    return orderByClause;
};


module.exports = { buildWhereClause, buildOrderByClause };

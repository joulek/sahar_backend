// Fonction générique pour la pagination

const { executeQuery } = require("../config/database");
const { buildWhereClause, buildOrderByClause } = require("./filters");
const { replaceForeignKeyValues } = require("./foreignKey");

// function paginate({ totalItems, currentPage = 1, perPage = 8, adjacent = 2 }) {
paginate = async ({
  totalItems,
  currentPage = 1,
  perPage = 8,
  adjacent = 2,
}) => {
  const totalPages = Math.ceil(totalItems / perPage);
  let startPage, endPage;

  if (totalPages <= 1) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (currentPage <= adjacent + 1) {
      startPage = 1;
      endPage = Math.min(startPage + adjacent * 2, totalPages);
    } else if (currentPage >= totalPages - adjacent) {
      startPage = Math.max(totalPages - adjacent * 2, 1);
      endPage = totalPages;
    } else {
      startPage = currentPage - adjacent;
      endPage = currentPage + adjacent;
    }
  }

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = Math.min(startIndex + perPage - 1, totalItems - 1);
  const perPageOptions = await generatePerPageOptions(8, totalItems);

  return {
    totalItems,
    currentPage,
    perPageOptions,
    perPage,
    totalPages,
    startPage,
    endPage,
    startIndex,
    endIndex,
  };
};

const callPaginate = async (request, tableName) => {
  const { filters, pagination } = request;
  const currentPage = parseInt(pagination.page) || 1;
  const perPage = parseInt(pagination.perPage) || 8;

  const { whereClause, params } = buildWhereClause(filters);
  const orderByClause = buildOrderByClause(filters);

  // Construire la requête SQL
  const query = `SELECT * FROM ${tableName}` + whereClause + orderByClause;

  try {
    // Récupérer les items avec pagination
    const offset = (currentPage - 1) * perPage;
    let itemsData = await executeQuery(query + " LIMIT ?, ?", [
      ...params,
      offset,
      perPage,
    ]);

    // Récupérer le nombre total d'items pour la pagination
    const countResult = await executeQuery(
      `SELECT COUNT(*) AS total FROM ${tableName}` + whereClause,
      params
    );
    const totalItems = countResult[0].total;

    // Si aucun élément n'est trouvé sur la page actuelle et que la page actuelle n'est pas la première page, ajustez la pagination
    if (itemsData.length === 0 && currentPage > 1) {
      const newOffset = (currentPage - 1) * perPage;
      itemsData = await executeQuery(query + " LIMIT ?, ?", [
        ...params,
        newOffset,
        perPage,
      ]);
    }

    // Calculer les détails de pagination
    const paginationDetails = await paginate({
      totalItems,
      currentPage,
      perPage,
      adjacent: 2,
    });
    const items = await replaceForeignKeyValues(itemsData, tableName);

    return {
      items,
      filterRequest: filters,
      pagination: {
        ...paginationDetails,
      },
    };
  } catch (error) {
    throw error;
  }
};

// callPaginate = async (request, tableName) => {
//     const { filters, pagination } = request;
//     var currentPage = parseInt(pagination.page) || 1
//     var perPage = parseInt(pagination.perPage) || 8;
//     var filterRequest = [];
//     // Construire la clause WHERE en fonction des filtres
//     let whereClause = '';
//     let orderByClause = ``;

//     const params = [];
//     if (await ValidateObject(filters)) {
//         let cpt = 0;
//         filters.forEach((filter, index) => {
//             whereClause += `${index === 0 ? " WHERE" : filter.op_attr} ${filter.key} ${filter.op} ? `;
//             params.push(`${filter.op_starts_with}${filter.value}${filter.op_ends_with}`);
//             if (filter.value.length == 0) {
//                 orderByClause = `ORDER BY cree_le DESC`;
//             }
//         });
//         filterRequest = filters;
//     }
//     // Construire la requête SQL
//     let query = `SELECT * FROM ${tableName}` + whereClause + orderByClause;
//     try {
//         // Récupérer les items avec pagination
//         let offset = (currentPage - 1) * perPage;
//         let itemsData = await executeQuery(query + ' LIMIT ?, ?', [...params, offset, perPage]);
//         // Récupérer le nombre total d'items pour la pagination
//         const countResult = await executeQuery(`SELECT COUNT(*) AS total FROM ${tableName}` + whereClause, params);
//         let totalItems = countResult[0].total;

//         // Si aucun élément n'est trouvé sur la page actuelle et que la page actuelle n'est pas la première page, ajustez la pagination
//         if (itemsData.length === 0 && currentPage > 1) {
//             currentPage--; // Revenir à la page précédente
//             offset = (currentPage - 1) * perPage;
//             itemsData = await executeQuery(query + ' LIMIT ?, ?', [...params, offset, perPage]);
//             // Recalculer le nombre total d'éléments après ajustement de la page
//             totalItems = await executeQuery(`SELECT COUNT(*) AS total FROM ${tableName}` + whereClause, params);
//             totalItems = totalItems[0].total;
//         }
//         // Calculer les détails de pagination
//         const paginationDetails = await paginate({ totalItems, currentPage, perPage, adjacent: 2 });
//         const items = await replaceForeignKeyValues(itemsData, tableName);

//         return {
//             items,
//             filterRequest,
//             pagination: {
//                 ...paginationDetails
//             }
//         };
//     } catch (error) {
//         throw error;
//     }

// }

generatePerPageOptions = async (
  currentPerPage,
  totalItems,
  incrementBy = 4
) => {
  let nextPage = currentPerPage;
  const perPageOptions = [
    { value: currentPerPage, label: String(currentPerPage) },
  ];

  while (nextPage < totalItems) {
    if (nextPage < totalItems && nextPage + incrementBy > totalItems) {
      nextPage = totalItems;
    } else {
      nextPage += incrementBy;
    }
    perPageOptions.push({ value: nextPage, label: String(nextPage) });
  }
  perPageOptions[perPageOptions.length - 1].label = "Afficher tout";
  return perPageOptions;
};

module.exports = { paginate, callPaginate };

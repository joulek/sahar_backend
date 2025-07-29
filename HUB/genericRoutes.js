module.exports = function (controller, router) {
    router.get(`/`, controller.getAll);
    router.get(`/get-by/:key/:value`, controller.getBy);
    router.post(`/paginate`, controller.paginate);
    router.post(`/`, controller.create.bind(controller)); // Ensure proper binding
    router.put(`/`, controller.update);
    router.delete(`/:id`, controller.delete);

    return router;
}

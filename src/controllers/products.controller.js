import Product from "../models/product.model.js";


export const getAllProducts = async (req, res, next) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;

        const filter = {};
        if (query) {
            if (query.includes('=')) {
                const [key, value] = query.split('=');
                if (key === 'status') filter.status = value === 'true';
                else if (key === 'category') filter.category = value;
            }
        }

        const options = { limit: parseInt(limit), page: parseInt(page), lean: true };
        if (sort) {
            options.sort = { price: sort === 'asc' ? 1 : -1 };
        }

        const result = await Product.paginate(filter, options);
        const { docs, ...paginationData } = result;

        const baseUrl = '/api/products';
        const buildLink = (p) => {
            const params = new URLSearchParams({
                limit,
                page: p,
                ...(sort && { sort }),
                ...(query && { query })
            });
            return `${baseUrl}?${params.toString()}`;
        };

        res.status(200).json({
            status: 'success',
            payload: docs,
            totalPages: paginationData.totalPages,
            prevPage: paginationData.prevPage,
            nextPage: paginationData.nextPage,
            page: paginationData.page,
            hasPrevPage: paginationData.hasPrevPage,
            hasNextPage: paginationData.hasNextPage,
            prevLink: paginationData.hasPrevPage ? buildLink(paginationData.prevPage) : null,
            nextLink: paginationData.hasNextPage ? buildLink(paginationData.nextPage) : null
        });
    } catch (error) {
        next(error);
    }
};

// Actualizar producto por ID
export const setProductById = async (req, res, next) => {
    try {
        const { pid } = req.params;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            pid,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
        }

        res.status(200).json({ status: 'success', payload: updatedProduct });
    } catch (error) {
        next(error);
    }
};
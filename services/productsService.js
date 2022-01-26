const productsModel = require('../models/productsModel');
const productsSchema = require('../schemas/productsSchema');
const errorConstructor = require('../utils/errorConstructor');
const { HTTP_CONFLICT } = require('../utils/statusCodes');

const readProducts = async () => {
  const products = await productsModel.readProducts();
  return products;
};

const validadeProducts = ({ name, quantity }) => {
  const { error } = productsSchema.validate({ name, quantity });

  let errorStatus = 422;
  if (error 
    && (error.message === '"quantity" is required' || error.message === '"name" is required')) {
    errorStatus = 400;
  }

  if (error) throw errorConstructor(errorStatus, error.message);
};

const create = async ({ name, quantity }) => {
  validadeProducts({ name, quantity });

  const existingProduct = await productsModel.getByName(name);

  if (existingProduct) {
    return { status: HTTP_CONFLICT, message: 'Product already exists' };
  }

  const products = await productsModel.create({ name, quantity });
  return {
    id: products.id,
    name,
    quantity,
  };
};

module.exports = {
  readProducts,
  create,
};
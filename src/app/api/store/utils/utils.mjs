import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { Store, sequelize } = require('../../../lib/db/models/store');

async function getAllStores() {
  await sequelize.sync();
  try {
    const stores = await Store.findAll();
    const storesData = stores.map((store) => store.toJSON());
    return storesData;
  } catch (error) {
    console.error('Error getting stores:', error);
    throw new Error('Database error');
  }
}

async function getStore(id, ignore = false) {
  await sequelize.sync();
  try {
    const store = await Store.findByPk(id);

    if (!store && !ignore) {
      throw new Error(`Store's ID ${id} not found.`);
    }

    if (store) {
      console.log('Found store:', store.toJSON());
      return store;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error searching store:', error);
  }
}

async function updateStore(id, newValues) {
  try {
    const store = await getStore(id);
    Object.assign(store, newValues);
    await store.save();

    console.log('Updated store:', store.toJSON());
    return store;
  } catch (error) {
    console.error('Error updating store:', error);
  }
}

async function deleteStore(id) {
  try {
    const store = await getUser(id);
    const deletedStore = { ...store };
    await store.destroy();

    console.log(`Store with ID ${id} deleted successfully.`);
    return deletedStore;
  } catch (error) {
    console.error('Error deleting store:', error);
  }
}

async function createStore(id) {
  try {
    const storeExists = await getStore(id, true);

    if (storeExists) {
      throw new Error('Store already exists.');
    }

    const store = await Store.create({ id });
    return store;
  } catch (error) {
    console.error('Error creating store:', error);
    throw new Error('Database error');
  }
}

async function insertStoreProduct(id, product) {
  try {
    const store = await getStore(id);
    const productKeys = Object.keys(product);
    const expectedKeys = ['value', 'desc', 'type', 'seller', 'time', 'id'];

    expectedKeys.forEach((pKey) => {
      if (!productKeys.includes(pKey)) {
        throw new Error(`Missing one of the product keys: ${productKeys}`);
      }
    });

    const newProducts = { products: [...store['products'], product] };

    Object.assign(store, newProducts);

    await store.save();
    return store;
  } catch (error) {
    console.error('Error inserting product:', error);
  }
}

async function insertStoreDebt(id, debt) {
  try {
    const store = await getStore(id);
    const debtKeys = Object.keys(debt);
    const expectedKeys = ['value', 'desc', 'type', 'debtor', 'time', 'id'];

    expectedKeys.forEach((dKey) => {
      if (!debtKeys.includes(dKey)) {
        throw new Error(`Missing one of the debt keys: ${debtKeys}`);
      }
    });

    const newDebt = { debts: [...store['debts'], debt] };

    Object.assign(store, newDebt);

    await store.save();
    return store;
  } catch (error) {
    console.error('Error inserting debt:', error);
  }
}

async function insertStoreDiscount(id, discount) {
  try {
    const store = await getStore(id);
    const discountKeys = Object.keys(discount);
    const expectedKeys = ['value', 'desc', 'type', 'debtor', 'time', 'id'];

    expectedKeys.forEach((dKey) => {
      if (!discountKeys.includes(dKey)) {
        throw new Error(`Missing one of the discount keys: ${discountKeys}`);
      }
    });

    const newDiscount = { discounts: [...store['discounts'], discount] };

    Object.assign(store, newDiscount);

    await store.save();
    return store;
  } catch (error) {
    console.error('Error inserting debt:', error);
  }
}

async function cleanStores() {
  await sequelize.sync();
  try {
    // Fetch all stores
    const stores = await Store.findAll();

    // Loop through each store and destroy it
    for (const store of stores) {
      await store.destroy();
    }

    console.log('All stores have been deleted.');
  } catch (error) {
    console.error('Error deleting stores:', error);
    throw new Error('Database error during store deletion');
  }
}

export {
  createStore,
  getStore,
  updateStore,
  deleteStore,
  insertStoreDebt,
  insertStoreProduct,
  getAllStores,
  cleanStores,
  insertStoreDiscount,
};

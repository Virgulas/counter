import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { User, sequelize } = require('../../../lib/db/models/user');

async function getUser(id, ignore = false) {
  await sequelize.sync();
  try {
    const user = await User.findByPk(id);

    if (!user && !ignore) {
      throw new Error(`User's ID ${id} not found.`);
    }

    if (user) {
      console.log('Found user:', user.toJSON());
      return user;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error('Error searching user:', error);
    throw new Error('Database error');
  }
}

async function updateUser(id, newValues) {
  try {
    const user = await getUser(id);
    Object.assign(user, newValues);
    await user.save();

    console.log('Updated user:', user.toJSON());
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Database error');
  }
}

async function deleteUser(id) {
  try {
    const user = await getUser(id);
    const deletedUser = { ...user };
    await user.destroy();

    console.log(`User with ID ${id} deleted successfully.`);
    return deletedUser;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Database error');
  }
}

async function createUser(id, name, picture) {
  try {
    const userExists = await getUser(id, true);

    if (userExists) {
      throw new Error('User already exists.');
    }

    const user = await User.create({ id, name, picture });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Database error');
  }
}

async function getAllUsers() {
  await sequelize.sync();
  try {
    const users = await User.findAll();
    const usersData = users.map((user) => user.toJSON());
    return usersData;
  } catch (error) {
    console.error('Error getting users:', error);
    throw new Error('Database error');
  }
}
const getDateKey = () => {
  const today = new Date();
  const options = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  // Format the date in Brazil's timezone
  const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(today);

  // Return in the format yyyy-MM-dd
  return formattedDate.replace(/\//g, '-');
};

const createDateEntries = async (id) => {
  try {
    const dateKey = getDateKey();
    const fields = ['pix', 'card', 'cash'];
    const user = await getUser(id);

    for (const field of fields) {
      if (!user[field][dateKey]) {
        Object.assign(user, { [field]: { ...user[field], [dateKey]: [] } });
      }
    }
    await user.save();
    return user;
  } catch (error) {
    console.error('Error creating entries:', error);
    throw new Error('Database error');
  }
};

const insertFieldValue = async (id, field, value) => {
  try {
    const dateKey = getDateKey();
    const user = await getUser(id);

    if (!user[field][dateKey]) {
      throw new Error(`Missing the field ${field}.`);
    }

    if (['card', 'cash', 'vId', 'caca'].includes(field)) {
      const valueKeys = Object.keys(value);
      if (!valueKeys.includes('time') || !valueKeys.includes('value')) {
        throw new Error(`Missing one of the value keys: ${valueKeys}`);
      }
    } else {
      const valueKeys = Object.keys(value);
      const expectedKeys = ['value', 'time', 'path', 'vId', 'caca'];

      expectedKeys.forEach((vKey) => {
        if (!valueKeys.includes(vKey)) {
          throw new Error(`Missing one of the value keys: ${valueKeys}`);
        }
      });
    }

    const updatedFieldDate = [...user[field][dateKey], value];
    Object.assign(user, {
      [field]: { ...user[field], [dateKey]: updatedFieldDate },
    });

    await user.save();
    return user;
  } catch (error) {
    console.error('Error inserting field value:', error);
    throw new Error('Database error');
  }
};

export {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  createDateEntries,
  insertFieldValue,
  getAllUsers,
};

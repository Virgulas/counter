const USERS = 'USERS';

// Helper to encode email to ASCII
const encodeEmailToAscii = (email) => {
  return email
    .split('')
    .map((char) => char.charCodeAt(0))
    .join('');
};

function formatNumber(num) {
  if (!num) return;
  let str = num.toString();

  // Check if the string already ends with ",00"
  if (!str.includes(',')) {
    return str + ',00';
  }

  return str;
}

function generateUniqueId() {
  // Create a unique ID using a combination of timestamp and random numbers
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 1000000);
  const uniqueId = `${timestamp}-${randomNum}`;

  return uniqueId;
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

function getTime() {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const brazilOffset = -3; // Brazil is UTC-3

  const hours = (utcHours + brazilOffset + 24) % 24; // Adjust for 24-hour format
  const minutes = utcMinutes;

  return `${hours}:` + `${minutes}`.padStart(2, '0');
}

function getTransactions(users, date) {
  const paymentTypes = ['pix', 'card', 'cash'];
  const allTransactions = [];

  for (const user of users) {
    console.log(user);
    for (const paymentType of paymentTypes) {
      if (user[paymentType] && user[paymentType][date]) {
        user[paymentType][date].forEach((transaction) => {
          allTransactions.push({
            id: transaction.vId,
            paymentType,
            time: transaction.time,
            value: transaction.value,
            name: user.name,
            caca: transaction.caca,
          });
        });
      }
    }
  }

  allTransactions.sort((a, b) => {
    const [aHours, aMinutes] = a.time.split(':').map(Number);
    const [bHours, bMinutes] = b.time.split(':').map(Number);
    return aHours * 60 + aMinutes - (bHours * 60 + bMinutes);
  });

  return allTransactions;
}

const getDateKey = () => {
  const today = new Date();
  const options = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const formattedDate = new Intl.DateTimeFormat('en-CA', options).format(today);

  // Return in the format yyyy-MM-dd
  return formattedDate.replace(/\//g, '-');
};

const pixFieldData = (value, time, vId, caca, path = null) => {
  return { value: value, time: time, path: path, vId: vId, caca: caca };
};

const ccFieldData = (value, time, vId, caca) => {
  return { value: value, time: time, vId: vId, caca: caca };
};

const productData = (
  value,
  desc,
  type,
  seller,
  time,
  id = generateUniqueId()
) => {
  return {
    value: value,
    time: time,
    desc: desc,
    type: type,
    seller: seller,
    id: id,
  };
};

const debtData = (value, desc, type, debtor, time, id = generateUniqueId()) => {
  return {
    value: value,
    time: time,
    desc: desc,
    type: type,
    debtor: debtor,
    id: id,
  };
};

const discountData = (
  value,
  desc,
  type,
  debtor,
  time,
  id = generateUniqueId()
) => {
  return {
    value: value,
    time: time,
    desc: desc,
    type: type,
    debtor: debtor,
    id: id,
  };
};

const setUsersData = (data) => {
  sessionStorage.setItem(USERS, JSON.stringify(data));
};

const setStoreOpenST = (data) => {
  sessionStorage.setItem('store', JSON.stringify(data));
};

const getStoreOpenST = (data) => {
  return sessionStorage.getItem('store');
};
const getUsersData = () => {
  const users = sessionStorage.getItem(USERS);

  if (!users) {
    return false;
  }

  return JSON.parse(users);
};

const addUsersData = (data) => {
  const users = getUsersData();
  const newData = [...users, data];
  sessionStorage.setItem(USERS, JSON.stringify(newData));
};

const removeUsersData = (data) => {
  const users = getUsersData();
  const newData = users.filter((u) => u['id'] != data['dataValues']['id']);
  sessionStorage.setItem(USERS, JSON.stringify(newData));
};

const updateUsersData = (data) => {
  const users = getUsersData();
  const newData = users.map((u) => (u.id === data.id ? data : u));
  sessionStorage.setItem(USERS, JSON.stringify(newData));
};

function getWeekdayInPortuguese(dateString) {
  const weekdaysPt = [
    'domingo',
    'segunda',
    'terça',
    'quarta',
    'quinta',
    'sexta',
    'sábado',
  ];

  // Parse the date and get the day of the week
  const date = new Date(`${dateString}T00:00:00Z`);
  const dayOfWeek = date.getUTCDay();

  return weekdaysPt[dayOfWeek];
}

export {
  encodeEmailToAscii,
  isValidEmail,
  setUsersData,
  getUsersData,
  addUsersData,
  removeUsersData,
  updateUsersData,
  getDateKey,
  pixFieldData,
  ccFieldData,
  getTime,
  generateUniqueId,
  getTransactions,
  formatNumber,
  productData,
  debtData,
  getWeekdayInPortuguese,
  setStoreOpenST,
  getStoreOpenST,
  discountData,
};

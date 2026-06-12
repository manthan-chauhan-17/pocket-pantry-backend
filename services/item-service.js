import moment from 'moment';

const getExpirinSoonItems = (itemsFromDB) => {
  const now = moment().unix();
  const next7Days = moment().add(7, "days").unix();

  // console.log(`Now: ${now}, Next 7 days: ${next7Days}`);
  // console.log(`Items from DB : ${itemsFromDB}`);
  
  const expiringSoonItems = itemsFromDB.filter(
    (item) => 
      item.expireDate >= now && item.expireDate <= next7Days
  );

  // console.log(expiringSoonItems);
  

  return expiringSoonItems;
};
// now : 1769749974
// next7days : 1770354774

// expire date : 1772081820

const getLowStockItems = (itemsFromDB) => {
  const lowStockItems = itemsFromDB.filter(
    (item) => item.quantity.value <= item.lowStockThreshold.value
  );

  return lowStockItems;
};

const getRecentlyAddedItems = (itemsFromDB) => {
  const sevenDaysAgo = moment().subtract(7, "days").toDate();

  const recentlyAddedItems = itemsFromDB.filter(
    (item) => item.createdAt >= sevenDaysAgo
  );

  return recentlyAddedItems;
};

export {
    getExpirinSoonItems,
    getLowStockItems,
    getRecentlyAddedItems,
}
export const getDSObj = (dataSourceObj, dsName) => {
  const dsObj = dataSourceObj.find(
    (obj) => obj.name === dsName
  );
  return dsObj
}
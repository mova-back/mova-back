module.exports = (obj) => {
  const arr = Object.entries(obj);
  if (arr.length === 0) return null;
  return `{${arr
    .map((parameter) => {
      const [key, value] = parameter;
      if (typeof value === 'object') {
        const str = JSON.stringify(value);
        return `${key}: ${str}`;
      }
      return `${key}: ${value}`;
    })
    .join(', ')}}`;
};

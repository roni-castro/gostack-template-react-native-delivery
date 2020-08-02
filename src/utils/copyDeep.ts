export default <T>(objectToBeCopied: T): T => {
  return JSON.parse(JSON.stringify(objectToBeCopied));
};

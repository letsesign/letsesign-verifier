/* eslint-disable no-console */
const fs = require('fs');
const axios = require('axios');

const fetchTcbInfo = async () => {
  const tcbInfoUrl = 'https://raw.githubusercontent.com/letsesign/letsesign-enclave/main/tcb-info.json';
  try {
    const fetchResult = await axios.get(tcbInfoUrl);
    return fetchResult.data;
  } catch (err) {
    return {
      error: `Error: ${err.message}`
    };
  }
};

const proc = async () => {
  if (process.argv.length === 2) {
    try {
      const result = await fetchTcbInfo();
      if (result.error !== null && result.error !== undefined) {
        throw new Error(result.error);
      } else {
        fs.writeFileSync('./src/tcb-info.json', JSON.stringify(result));
        return;
      }
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  }
  console.log('\nUsage: node letsesign.config.js\n');
};

proc();

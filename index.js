const publicIp = require('public-ip');
const ALIDNS = require('alidns-nodejs');
require('dotenv').config();

const client = ALIDNS({
  accesskeyId: process.env.ACCESS_KEY_ID,
  accesskeySecret: process.env.ACCESS_KEY_SECRET,
});

const hostname = 'fanchangyong.xyz';

async function callAli(params) {
  return new Promise((resolve, reject) => {
    client.queryData(params, (err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  })
}

async function updateRecord() {
  const ip = await publicIp.v4();
  const records = await callAli({
    Action: 'DescribeDomainRecords',
    DomainName: hostname,
  });
  const count = records.TotalCount;
  if (count === 0) {
    const res = await callAli({
      Action: 'AddDomainRecord',
      DomainName: hostname,
      RR: '@',
      Type: 'A',
      Value: ip,
    });
    console.log('Added record: ', res)
  } else {
    const record = records.DomainRecords.Record[0];
    if (record.Value !== ip) {
      const res = await callAli({
        ...record,
        Action: 'UpdateDomainRecord',
        Value: ip,
      });
      console.log('Updated record: ', res);
    } else {
      console.log('IP not changed, skipping..');
    }
  }
}

async function main() {
  const intervalSec = process.env.INTERVAL_SEC || 60;
  updateRecord();
  const intervalId = setInterval(updateRecord, intervalSec * 1000);
  process.on('SIGINT', () => {
    clearInterval(intervalId);
    process.exit();
  });
}

main()

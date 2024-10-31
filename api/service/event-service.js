const Web3 = require("web3");
const axios = require("axios");
const User = require("../models/User");
const tokenABI = require("../abi/usdt");

const listeners = [];

const usdtTokenAddress = process.env.USDT_TOKEN_ADDRESS;

const tokensAddress = [usdtTokenAddress];

function getTokenName(val) {
  switch (val) {
    case 0:
      return "usdt";
  }
}

function getTokenAddress(tokenName) {
  switch (tokenName) {
    case "usdt":
      return tokensAddress[0];
  }
}

function getTokenNameByAddress(address) {
  switch (address) {
    case usdtTokenAddress:
      return "usdt";
  }
}

const price = async (symbol) => {
  try {
    response = await axios.get(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbol}`,
      {
        headers: {
          "X-CMC_PRO_API_KEY": "9b5b5f6c-d6f9-428f-858e-eee8d0a195bb",
        },
      }
    );

    return response?.data?.data?.[symbol]?.quote?.USD?.price;
  } catch (error) {
    console.log("error", error);
  }
};

const setListenerBsc = async (i, web3) => {
  const contract = new web3.eth.Contract(tokenABI, tokensAddress[i]);
  // console.log(await contract.methods.name().call());

  // Subscribe to Transfer events
  const _listener = contract.events
    .Transfer({
      fromBlock: "latest",
    })
    .on("data", async (event) => {
      const account = await User.findOne({
        where: { publicKey: event.returnValues.to },
      });
      // console.log({
      //   to: event.returnValues.to,
      //   value: Web3.utils.fromWei(event.returnValues.value, "ether"),
      // });

      if (!account) return; // if the account is not found, return
      console.log("account", account.username);

      const amount = Web3.utils.fromWei(event.returnValues.value, "ether"); // convert the value to ether\
      account.depositAmount = Number(account.depositAmount) + Number(amount); // update account balance

      const LOCUSPrice = await price("LOCUS");
      const CRETAPrice = await price("CRETA");

      console.log("LOCUSPrice", LOCUSPrice);
      console.log("CRETAPrice", CRETAPrice);

      // based on deposit value separate the amount to LOCUS and CRETA in 50:50 ratio
      const LOCUSAmount = (Number(amount) * 50) / 100;
      const CRETAAmount = (Number(amount) * 50) / 100;

      // update the LOCUS and CRETA balance
      account.LOCUSBalance =
        Number(account.LOCUSBalance) + Number(LOCUSAmount) / Number(LOCUSPrice);
      account.CRETABalance =
        Number(account.CRETABalance) + Number(CRETAAmount) / Number(CRETAPrice);

      console.log("LOCUSBalance", account.LOCUSBalance);
      console.log("CRETABalance", account.CRETABalance);

      await account.save();

      // 3 level MLM with 8% commission, 4% commission, 2% commission
      const refererL1 = await User.findOne({
        where: { referCode: account.referer },
      });
      // console.log("refererL1", refererL1);
      // update refer bonus
      if (refererL1) {
        refererL1.referBonus =
          Number(refererL1.referBonus) + (Number(amount) * 8) / 100;

        await refererL1.save();

        const refererL2 = await User.findOne({
          where: { referCode: refererL1.referer },
        });
        if (refererL2) {
          refererL2.referBonus =
            Number(refererL2.referBonus) + (Number(amount) * 4) / 100;

          await refererL2.save();
          const refererL3 = await User.findOne({
            where: { referCode: refererL2.referer },
          });
          if (refererL3) {
            refererL3.referBonus =
              Number(refererL3.referBonus) + (Number(amount) * 2) / 100;
            await refererL3.save();
          }
        }
      }
    })
    .on("connected", function (subscriptionId) {
      // subscriptionIds.push(subscriptionId);
      console.log("connected:", subscriptionId);
    })
    .on("changed", (event) => {
      // remove event from local database
      console.log(
        "changed:-------------------------------------------",
        getTokenNameByAddress(event.address)
      );

      // print the subscription id.
    })
    .on("error", console.error);
  return _listener;
};

const listEventBsc = async (web3) => {
  for (let i = 0; i < tokensAddress.length; i++) {
    // Subscribe to Transfer events
    const _listener = await setListenerBsc(i, web3);
    listeners.push(_listener);
  }
};

module.exports = {
  listEventBsc,
};

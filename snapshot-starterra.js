import { LCDClient } from "@terra-money/terra.js";
import * as fs from "fs";
import * as path from "path";

const main = async () => {
  const DATA_DIR = "data";
  const MINTER_ADDRESS = "terra1yzewp648fwq7ymlfdg5h90dfzk5y2hf6kk9pdm";
  const LCD = new LCDClient({
    URL: "https://lcd.terra.dev", // use localhost if you want to speedup the data collection process
    chainID: "columbus-5",
  });
  const HOLDERS = [];
  let start_after = " ";
  let isFullyCompleted = false;

  const init = async () => {
    do {
      const response = await LCD.wasm.contractQuery(
        MINTER_ADDRESS,
        searchTerm(start_after),
        { height: 7603700 }
      );
      if (!isFullyCompleted) {
        createHoldersList(response);
      }
    } while (!isFullyCompleted);
    buildFile();
  };

  const createHoldersList = (response) => {
    if (response.users.length == 0) {
      isFullyCompleted = true;
      HOLDERS.sort(sortByWallet);
      return;
    }
    response.users.forEach((element) => {
      if (element.available_funds > 0) {
        HOLDERS.push({
          [element.funder]: {
            denom: "uusd",
            balance: element.available_funds,
          },
        });
      }
      start_after = element.funder;
    });
  };

  const sortByWallet = (a, b) => a.funder - b.funder;

  const searchTerm = (start) => {
    if (start != " ") {
      return {
        funders: {
          start_after: start,
          limit: 1024,
        },
      };
    } else {
      return {
        funders: {
          limit: 1024,
        },
      };
    }
  };

  const buildFile = () => {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR);
    }
    fs.writeFileSync(
      path.join(DATA_DIR, "starterra-snapshot" + ".json"),
      JSON.stringify(HOLDERS)
    );
  };
  init();
};

main();

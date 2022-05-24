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

  const init = async () => {
    let isFullyCompleted = false;
    let start_after = "terra1a0uw7tlk03lc8ns5adnhgxvnllwdxgalv2fj6h";

    do {
      const response = await LCD.wasm.contractQuery(
        MINTER_ADDRESS,
        {
          funders: {
            start_after: start_after,
            limit: 1024,
          },
        },
        { height: 7544510 }
      );
      createHoldersList(response);
      isFullyCompleted = true;
    } while (!isFullyCompleted);
    buildFile();
  };

  const createHoldersList = (response) => {
    response.users.forEach((element) => {
      if (element.available_funds > 0) {
        HOLDERS.push({
          funder: element.funder,
          available_funds: element.available_funds,
          spent_funds: element.spent_funds,
        });
      }
    });
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

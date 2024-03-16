import { createDebugLogger, createPXEClient, waitForPXE } from "@aztec/aztec.js";
import { SearchablePrivNoteContract } from "./dest/target/SearchablePrivNote.js";

import { getDeployedTestAccountsWallets } from '@aztec/accounts/testing';

(async () => {
  const pxeRpcUrl = "http://localhost:8080";
  const logger = createDebugLogger('token');
  const pxe = createPXEClient(pxeRpcUrl);
  await waitForPXE(pxe, logger);

  const accounts = await getDeployedTestAccountsWallets(pxe);
  const address = accounts[0].getAddress()

  console.log("Contract deploying...")
  const contract = await SearchablePrivNoteContract.deploy(
    accounts[0],
    address,
    "Searchable Private Note",
    "SPN",
    18
  ).send().deployed();

  console.log("Contract deployed.")

  await contract.methods.spawn_searchable_note().send().wait()

  const readNote = await contract.methods.read_searchable().view()
  console.log(readNote, "READNOTE")

  await contract.methods.search_note().send().wait()
})();
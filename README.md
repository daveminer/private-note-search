# private-note-search

Built on v0.28.0

### Terminal 1

Start the sandbox: `DEBUG=aztec:simulator:oracle aztec-sandbox`

### Terminal 2

From the project root:

```
cd contracts && aztec-nargo compile
```

while in the `./contracts` directory:

```
aztec-cli codegen target -o ../src/target --ts
```

move up a directory and run the script.

```
cd ..
```

Install deps

```
npm i
```

Build the client interface

```
npm build
```

Run the script

```
node contractDeploy.js
```

No values in reads:

```
aztec_1     | sequencer Submitted rollup block 2 with 1 transactions
aztec_1     | 2024-03-16T16:41:30.618Z aztec:simulator:oracle Searchable note created
aztec_1     | 2024-03-16T16:41:30.618Z aztec:simulator:oracle 0x0000000000000000000000000000000000000000000000000000000000000001
aztec_1     | 2024-03-16T16:41:30.618Z aztec:simulator:oracle 0x2dd072d8b7fe284389b2a5655c31d861463cd71058c2e22654bbbd885791e79f

...

aztec_1     | sequencer Submitted rollup block 3 with 1 transactions
aztec_1     | 2024-03-16T16:41:50.820Z aztec:simulator:oracle Note searched
aztec_1     | 2024-03-16T16:41:50.820Z aztec:simulator:oracle 0x0000000000000000000000000000000000000000000000000000000000000000
aztec_1     | 2024-03-16T16:41:50.820Z aztec:simulator:oracle 0x0000000000000000000000000000000000000000000000000000000000000000


```

From the script:
```
[
  {
    value: 0n,
    randomness: 0n,
    header: {
      contract_address: AztecAddress<0x0000000000000000000000000000000000000000000000000000000000000000>,
      nonce: 0n,
      storage_slot: 0n,
      is_transient: false
    }
  }
] READNOTE
```
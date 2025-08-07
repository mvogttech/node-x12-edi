<p align="center">
  <img src="logo.png" alt="node-x12-edi Logo" />
  <br/>
  <em>Build, parse, and master X12 with precision — the Node.js way.</em>
</p>

<hr>

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/mvogttech/node-x12-edi)

### Why `node‑x12‑edi`?

- **Bi‑directional mapping**
  Seamlessly **parse EDI → JSON** with `mapSegments(mapLogic)` and **generate JSON → EDI** using `toX12(json, mapLogic)`.
- **Rock‑solid structure**
  Map using `FieldMap` and `LoopMap` to define how your JSON schema connects to segments and loops, offering clarity and reusability.
- **Performance optimized**
  Compiles mapping logic into fast blueprints — lightning-fast serialization, even for large payloads.
- **Pure JS, zero dependencies**
  Works anywhere Node.js goes — server, CLI, AWS Lambda, CI pipelines.

---

### Quick Start

```bash
npm install node‑x12‑edi
```

```js
import Transaction from "node‑x12‑edi";
import { FieldMap, LoopMap } from "node‑x12‑edi";

// 1. Define your mapping logic
const mapLogic = {
  header: {
    date: new FieldMap({ segmentIdentifier: "GS", valuePosition: 4 }),
    receiptNumber: new FieldMap({ segmentIdentifier: "W17", valuePosition: 2 }),
  },
  detail: {
    items: new LoopMap({
      position: 0,
      values: {
        itemCode: new FieldMap({ segmentIdentifier: "W07", valuePosition: 4 }),
        lotCode: new FieldMap({ segmentIdentifier: "W07", valuePosition: 7 }),
        weight: new FieldMap({ segmentIdentifier: "W20", valuePosition: 3 }),
      },
    }),
  },
};

// 2. Parse EDI to JSON
const transaction = new Transaction();
transaction.generateSegments(ediString);
transaction.runLoops(); // necessary to build loop contexts
const json = transaction.mapSegments(mapLogic);
console.log("Parsed JSON:", json);

// 3. Generate EDI back from JSON
const edi = transaction.generateX12(json, mapLogic);
console.log("Regenerated EDI:", edi);
```

---

### Features

| Feature                | Description                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| **Flexible mapping**   | Use `FieldMap` and `LoopMap` to easily map between hierarchical JSON and flat EDI formats. |
| **Two-way conversion** | Fully supports EDI → JSON and JSON → EDI conversion using the same mapping structure.      |
| **Loop support**       | Automatically handles repeating segments via `LoopMap`.                                    |
| **High performance**   | Pre-compiles mapping logic to minimize per-conversion overhead.                            |
| **Clear API**          | Intuitive class methods — `generateSegments`, `mapSegments`, `generateX12`.                |

---

### Next Steps & Pro Tips

- **Create reusable mapLogic**: Define a library of mappings per transaction type (e.g. 944, 850, 810) for reuse.
- **Add formats**: Implement validation, segment padding, or normalized date formatting.
- **Test coverage**: Use real-world EDI samples and round-trip your JSON mappings.
- **CLI wrapper**: Create a lightweight CLI tool like `edi2json` or `json2edi` leveraging this library.

---

### Contributing & Credits

- **Bug reports, feature ideas, and sample files** are welcome!
- Please open issues and submit pull requests via GitHub.

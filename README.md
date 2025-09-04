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
- **JSON-first mapping**
  Define mapLogic as plain JSON objects with `_type` keys — perfect for serverless environments, configuration files, and database storage.
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

// 1. Define your mapping logic (class-based)
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

// 1. Alternative: Define mapping logic as plain JSON (great for serverless!)
const jsonMapLogic = {
  header: {
    date: { _type: "FieldMap", segmentIdentifier: "GS", valuePosition: 4 },
    receiptNumber: {
      _type: "FieldMap",
      segmentIdentifier: "W17",
      valuePosition: 2,
    },
  },
  detail: {
    items: {
      _type: "LoopMap",
      position: 0,
      values: {
        itemCode: {
          _type: "FieldMap",
          segmentIdentifier: "W07",
          valuePosition: 4,
        },
        lotCode: {
          _type: "FieldMap",
          segmentIdentifier: "W07",
          valuePosition: 7,
        },
        weight: {
          _type: "FieldMap",
          segmentIdentifier: "W20",
          valuePosition: 3,
        },
      },
    },
  },
};

// 2. Parse EDI to JSON (works with either mapLogic format)
const transaction = new Transaction();
transaction.generateSegments(ediString);
transaction.runLoops(); // necessary to build loop contexts
const json = transaction.mapSegments(jsonMapLogic); // auto-revives JSON to classes
console.log("Parsed JSON:", json);

// 3. Generate EDI back from JSON
const edi = transaction.toX12(json, jsonMapLogic);
console.log("Regenerated EDI:", edi);
```

---

### Features

| Feature                | Description                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------ |
| **Flexible mapping**   | Use `FieldMap` and `LoopMap` to easily map between hierarchical JSON and flat EDI formats.                   |
| **JSON mapLogic**      | Define mapping logic as plain JSON with `_type` keys — perfect for config files and serverless environments. |
| **Two-way conversion** | Fully supports EDI → JSON and JSON → EDI conversion using the same mapping structure.                        |
| **Loop support**       | Automatically handles repeating segments via `LoopMap` and `RepeatingSegmentMap`.                            |
| **High performance**   | Pre-compiles mapping logic to minimize per-conversion overhead.                                              |
| **Clear API**          | Intuitive class methods — `generateSegments`, `mapSegments`, `toX12`.                                        |

---

### Next Steps & Pro Tips

- **Create reusable mapLogic**: Define a library of mappings per transaction type (e.g. 944, 850, 810) for reuse.
- **Serverless-friendly**: Store JSON mapLogic in databases, config files, or environment variables — no class instantiation needed.
- **Add formats**: Implement validation, segment padding, or normalized date formatting.
- **Test coverage**: Use real-world EDI samples and round-trip your JSON mappings.
- **CLI wrapper**: Create a lightweight CLI tool like `edi2json` or `json2edi` leveraging this library.

---

### Contributing & Credits

- **Bug reports, feature ideas, and sample files** are welcome!
- Please open issues and submit pull requests via GitHub.

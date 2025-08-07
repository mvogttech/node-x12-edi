<p align="center">
  <img src="logo.png" alt="node-x12-edi Logo" />
  <br/>
  <em>Build, parse, and master X12 with precision — the Node.js way.</em>

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/mvogttech/node-x12-edi)

</p>

<hr>

## Installation

You can install the package using npm:

```bash
npm install node-x12-edi
```

## Usage

The intent of this module is to provide low-level access to X12 EDI documents in plain JS.

In this short guide I am going to walk through how to take an EDI file and convert it to a usable JSON Object.

### Input File Content

```
ISA*00*          *00*          *12*1114315990     *16*007076664TEST  *230929*1419*X*00401*000000015*0*P*>
GS*RE*1114315990*022865398*20230929*1419*15*X*004010
ST*944*0001
W17*F*20230929*4280*0450366097
N1*WH*Distribution Center*91*PC1234
W08*M*0000***1234*123456789
W07*120*CA**VN*100000154*LT**22413962
N9*PC*20230904
W20****1800.00*N*L
W07*120*CA**VN*100000154*LT**22413963
N9*PC*20230904
W20****1800.00*N*L
W07*120*CA**VN*100000154*LT**22413964
N9*PC*20230904
W20****1800.00*N*L
W07*120*CA**VN*100000154*LT**22413965
N9*PC*20230904
W20****1800.00*N*L
W07*120*CA**VN*100000154*LT**22413966
N9*PC*20230904
W20****1800.00*N*L
W14*600
SE*21*0001
GE*1*15
IEA*1*000000015
```

### Output: Fully usable JSON object

```
const mappedEDI = {
    header: {
        transmissionDate: "20230929",
        warehouseReceiptNumber: "4280",
        warehouse: {
            name: "Distribution Center",
            code: "PC1234"
        }
    },
    detail: {
        items: [
            {
                itemCode: "100000154",
                lotCode: "22413963",
                quantity: "120",
                netWeight: "1800.00"
            },
             {
                itemCode: "100000155",
                lotCode: "22413963",
                quantity: "120",
                netWeight: "1800.00"
            },
             {
                itemCode: "100000156",
                lotCode: "22413963",
                quantity: "120",
                netWeight: "1800.00"
            }
        ]
    }
}
```

The 4 main classes used to interface with an X12 EDI file are:

- Transaction
- FieldMap
- LoopMap
- Loop

### Step 1: Load the EDI file contents:

```
const file = await readFile("test.edi", "utf8");
```

### Step 2: create a new EDI Transaction:

```
const transaction = new Transaction();
```

### Step 3: Initiate the segments of the Transaction by using the `Transaction.generateSegments()` method:

```
transaction.generateSegments(file);
```

### Step 4: Create a loop for the Details section:

```
const itemLoop = new Loop();

itemLoop.setPosition(0);

itemLoop.addSegmentIdentifiers(["W07", "N9", "W20"]) // These are the segments in the EDI file that are grouped together in the details section to classify as 1 object / item.
```

### Step 5: Add the loop to the transaction

```
transaction.addLoop(itemLoop);
transaction.runLoops(); // Executes the loops assigned to the Transaction instance
```

### Step 6: Create the JSON Object you would like to map the EDI fields to:

```
const mapLogic = {
    header: {
      transmissionDate: new FieldMap({
        segmentIdentifier: "GS",
        identifierValue: null,
        identifierPosition: null,
        valuePosition: 3,
      }),
      warehouseReceiptNumber: new FieldMap({
        segmentIdentifier: "W17",
        identifierValue: null,
        identifierPosition: null,
        valuePosition: 2,
      }),
      warehouse: {
        name: new FieldMap({
          segmentIdentifier: "N1",
          identifierValue: "WH",
          identifierPosition: 0,
          valuePosition: 1,
        }),
        code: new FieldMap({
          segmentIdentifier: "N1",
          identifierValue: "WH",
          identifierPosition: 0,
          valuePosition: 3,
        }),
      },
    },
    detail: {
      items: new LoopMap({
        position: 0,
        values: {
          itemCode: new FieldMap({
            segmentIdentifier: "W07",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 4,
          }),
          lotCode: new FieldMap({
            segmentIdentifier: "W07",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 7,
          }),
          productionDate: new FieldMap({
            segmentIdentifier: "N9",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 1,
          }),
          netWeight: new FieldMap({
            segmentIdentifier: "W20",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 3,
          }),
          quantity: new FieldMap({
            segmentIdentifier: "W07",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 0,
          }),
        },
      }),
    },
  };
```

### Step 7: Map the segments

```
const mapped = transaction.mapSegments(mapLogic, transaction.getSegments());
```

### Full Example

```
const file = await fs.readFile("test.edi", "utf8");

  const transaction = new Transaction();

  transaction.generateSegments(file);

  const itemLoop = new Loop();

  itemLoop.setPosition(0);

  itemLoop.addSegmentIdentifiers(["W07", "N9", "W20"]);

  transaction.addLoop(itemLoop);
  transaction.runLoops();

  const mapLogic = {
    header: {
      transmissionDate: new FieldMap({
        segmentIdentifier: "GS",
        identifierValue: null,
        identifierPosition: null,
        valuePosition: 3,
      }),
      warehouseReceiptNumber: new FieldMap({
        segmentIdentifier: "W17",
        identifierValue: null,
        identifierPosition: null,
        valuePosition: 2,
      }),
      warehouse: {
        name: new FieldMap({
          segmentIdentifier: "N1",
          identifierValue: "WH",
          identifierPosition: 0,
          valuePosition: 1,
        }),
        code: new FieldMap({
          segmentIdentifier: "N1",
          identifierValue: "WH",
          identifierPosition: 0,
          valuePosition: 3,
        }),
      },
    },
    detail: {
      items: new LoopMap({
        position: 0,
        values: {
          itemCode: new FieldMap({
            segmentIdentifier: "W07",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 4,
          }),
          lotCode: new FieldMap({
            segmentIdentifier: "W07",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 7,
          }),
          productionDate: new FieldMap({
            segmentIdentifier: "N9",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 1,
          }),
          netWeight: new FieldMap({
            segmentIdentifier: "W20",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 3,
          }),
          quantity: new FieldMap({
            segmentIdentifier: "W07",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: 0,
          }),
        },
      }),
    },
  };

  const mapped = transaction.mapSegments(mapLogic, transaction.getSegments());
```

import FieldMap from "../bin/FieldMap.js";
import LoopMap from "../bin/LoopMap.js";

const ISA_ELEMENTS = [
  "AuthorizationInformationQualifier",
  "AuthorizationInformation",
  "SecurityInformationQualifier",
  "SecurityInformation",
  "InterchangeSenderIdQualifier",
  "InterchangeSenderId",
  "InterchangeReceiverIdQualifier",
  "InterchangeReceiverId",
  "InterchangeDate",
  "InterchangeTime",
  "InterchangeControlStandardsIdentifier",
  "InterchangeControlVersionNumber",
  "InterchangeControlNumber",
  "AcknowledgmentRequested",
  "UsageIndicator",
  "ComponentElementSeparator",
];

const GS_ELEMENTS = [
  "FunctionalIdentifierCode",
  "ApplicationSendersCode",
  "ApplicationReceiversCode",
  "Date",
  "Time",
  "GroupControlNumber",
  "ResponsibleAgencyCode",
  "VersionReleaseIndustryIdentifierCode",
];

const ST_ELEMENTS = [
  "TransactionSetIdentifierCode",
  "TransactionSetControlNumber",
];

const W17_ELEMENTS = [
  "ReportingCode",
  "Date",
  "ReceiptNumber",
  "DepositorOrderNumber",
  "ShipmentIdentificationNumber",
];

const N1_ELEMENTS = [
  "EntityIdentifierCode",
  "Name",
  "IdentificationCodeQualifier",
  "IdentificationCode",
  "EntityRelationshipCode",
  "EntityIdentifierCode",
];

const W07_ELEMENTS = [
  "Quantity",
  "UnitOrBasisForMeasurementCode",
  "UPCCaseCode",
  "ProductOrServiceIdQualifier",
  "ProductOrServiceId",
  "ProductOrServiceIdQualifier",
  "ProductOrServiceId",
  "LotNumber",
];

const W20_ELEMENTS = [
  "",
  "",
  "",
  "Weight",
  "WeightQualifier",
  "WeightUnitCode",
];

const W14_ELEMENTS = [
  "QuantityReceived",
  "NumberofUnitsShipped",
  "QuantityDamagedOrDefective",
];

const W13_ELEMENTS = [
  "Quantity",
  "UnitOrBasisForMeasurementCode",
  "ReceivingConditionCode",
  "",
  "DamageReasonCode",
];

const SE_ELEMENTS = ["NumberofIncludedSegments", "TransactionSetControlNumber"];

const GE_ELEMENTS = ["NumberofTransactionSetsIncluded", "GroupControlNumber"];

const IEA_ELEMENTS = [
  "NumberofIncludedFunctionalGroups",
  "InterchangeControlNumber",
];

export const Transaction944 = {
  header: {
    interchangeControlHeader: Object.assign.apply(
      {},
      ISA_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "ISA",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: index,
          }),
        };
      })
    ),
    functionalGroupHeader: Object.assign.apply(
      {},
      GS_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "GS",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: index,
          }),
        };
      })
    ),
    transactionSetHeader: Object.assign.apply(
      {},
      ST_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "ST",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: index,
          }),
        };
      })
    ),
    depositor: Object.assign.apply(
      {},
      N1_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "N1",
            identifierValue: "DE",
            identifierPosition: 0,
            valuePosition: index,
          }),
        };
      })
    ),
    warehouse: Object.assign.apply(
      {},
      N1_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "N1",
            identifierValue: "WH",
            identifierPosition: 0,
            valuePosition: index,
          }),
        };
      })
    ),
    warehouseReceiptInformation: Object.assign.apply(
      {},
      W17_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "W17",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: index,
          }),
        };
      })
    ),
  },
  detail: {
    items: new LoopMap({
      position: 0,
      values: {
        item: Object.assign.apply(
          {},
          W07_ELEMENTS.map((element, index) => {
            return {
              [element]: new FieldMap({
                segmentIdentifier: "W07",
                identifierValue: null,
                identifierPosition: null,
                valuePosition: index,
              }),
            };
          })
        ),
        miscellaneousDetails: Object.assign.apply(
          {},
          W20_ELEMENTS.map((element, index) => {
            return {
              [element]: new FieldMap({
                segmentIdentifier: "W20",
                identifierValue: null,
                identifierPosition: null,
                valuePosition: index,
              }),
            };
          })
        ),
        detailException: Object.assign.apply(
          {},
          W13_ELEMENTS.map((element, index) => {
            return {
              [element]: new FieldMap({
                segmentIdentifier: "W13",
                identifierValue: null,
                identifierPosition: null,
                valuePosition: index,
              }),
            };
          })
        ),
      },
    }),
  },
  summary: {
    transactionTotals: Object.assign.apply(
      {},
      W14_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "W14",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: index,
          }),
        };
      })
    ),
    transactionSetTrailer: Object.assign.apply(
      {},
      SE_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "SE",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: index,
          }),
        };
      })
    ),
    functionalGroupTrailer: Object.assign.apply(
      {},
      GE_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "GE",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: index,
          }),
        };
      })
    ),
    interchangeControlTrailer: Object.assign.apply(
      {},
      IEA_ELEMENTS.map((element, index) => {
        return {
          [element]: new FieldMap({
            segmentIdentifier: "IEA",
            identifierValue: null,
            identifierPosition: null,
            valuePosition: index,
          }),
        };
      })
    ),
  },
};

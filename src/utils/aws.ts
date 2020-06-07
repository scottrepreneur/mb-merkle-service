const { v4: uuidv4 } = require("uuid");

var AWS = require("aws-sdk");

// if (process.env.ENVIRONMENT === "local") {
//   var credentials = new AWS.SharedIniFileCredentials({ profile: "stwoh2" });
//   AWS.config.credentials = credentials;
// }
AWS.config.update({ region: "us-east-1" });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const DYNAMODB_TABLE: string = process.env.DYNAMODB_TABLE!;

export async function addOrUpdateTemplateAddresses(
  _templateId: number,
  _addresses: string[],
  _root: string
) {
  const timestamp = new Date().getTime();
  const tId = await getIdByTemplate(_templateId);
  // console.log(tId);
  // console.log(addresses);
  if (tId) {
    const params = {
      TableName: DYNAMODB_TABLE,
      Key: { id: tId },
      UpdateExpression: "set addresses = :x, updatedAt = :y",
      ExpressionAttributeValues: {
        ":x": JSON.stringify(_addresses != [] ? _addresses.sort() : []),
        ":y": timestamp,
      },
    };
    // console.log(params);
    dynamoDb.update(params, (error: any, result: any) => {
      if (error) {
        console.log(error);
      }
      // console.log(result);
      return result;
    });
  } else if (tId === null) {
    const params = {
      TableName: DYNAMODB_TABLE,
      Item: {
        id: uuidv4(),
        templateId: _templateId,
        addresses: JSON.stringify(_addresses),
        root: _root,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };
    // console.log(params);
    dynamoDb.put(params, (error: any, result: any) => {
      if (error) {
        console.log(error);
      }
      return result;
    });
  }
}

function getIdByTemplate(templateId: number) {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: DYNAMODB_TABLE,
      IndexName: "templateId-index",
      KeyConditionExpression: "templateId = :templateId",
      ExpressionAttributeValues: {
        ":templateId": templateId,
      },
    };
    // console.log(params);
    dynamoDb.query(params, (error: any, result: any) => {
      if (error) {
        console.log(error);
        reject();
      }
      if (result.Items.length > 0) {
        // console.log("returned: " + result.Items[0]["id"]);
        resolve(result.Items[0]["id"]);
      } else {
        resolve(null);
      }
    });
  });
}

export async function checkTemplateAddressesForAddress(
  address: string,
  templateId: number
) {
  const addresses: any = await getAddressesByTemplate(templateId);
  if (addresses != [] && addresses.includes(address.toLowerCase()) === true) {
    return 1;
  }
  return 0;
}

export function getAddressesByTemplate(templateId: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const params = {
      TableName: DYNAMODB_TABLE,
      IndexName: "templateId-index",
      KeyConditionExpression: "templateId = :templateId",
      ExpressionAttributeValues: {
        ":templateId": templateId,
      },
    };
    dynamoDb.query(params, (error: any, result: any) => {
      if (error) {
        console.log(error);
        reject();
      }
      if (result.Items.length > 0) {
        const addresses = result.Items[0]["addresses"];
        resolve([...JSON.parse(addresses)]);
      } else {
        resolve([]);
      }
    });
  });
}

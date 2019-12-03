/**
 * ROute GET /notes
 */

const AWS = require('aws-sdk');
const util = require('./util.js');
AWS.config.update({region:'eu-west-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;


exports.handler = async(event) => {
    try{

        let query = event.queryStringParameters;
        let limit = query && query.limit ? parseInt(query.limit):5;
        user_id = util.getUserId(event.headers);

        let params = {
            TableName: tableName,
            KeyConditionExpression: 'user_id = :uid',
        
            ExpressionAttributeValues : {
                ':uid':user_id
            },
            Limit:limit,
            ScanIndexForward:false
        };

        let startTimeStamp = query && query.start ? parseInt(query.start):0;
        if(startTimeStamp>0){
            params.ExclusiveStartKey = {
                user_id:user_id,
                timestamp:startTimeStamp
            };
        }

        let data = await dynamoDB.query(params).promise();

       return{
           statusCode : 200,
           headers : util.getResponseHeaders(),
           body : JSON.stringify(data)
       }
    }catch(error){
        console.log("Error is :",error);
        return {
            statusCode : error.statusCode ? error.statusCode : 500,
            headers:util.getResponseHeaders(),
            body : JSON.stringify({
                error:error.name?error.name : 'Exception',
                message : error.message ? error.message : "Unkown error"
            })
        }
    }
}
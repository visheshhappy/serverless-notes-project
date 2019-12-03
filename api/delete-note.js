/**
 * ROute DELETE /note/t/{timestamp}
 */

const AWS = require('aws-sdk');
const util = require('./util.js');
AWS.config.update({region:'eu-west-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;


exports.handler = async(event) => {
    try{
        let timestamp = parseInt(event.pathParameters.timestamp);

        let params = {
            TableName: tableName,
            Key:{
                user_id:util.getUserId(event.headers),
                timestamp:timestamp
            }
        };

        await dynamoDB.delete(params).promise();
       return{
           statusCode : 200,
           headers : util.getResponseHeaders()
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
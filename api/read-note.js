/**
 * ROute GET /note/n/{noteId}
 */

const AWS = require('aws-sdk');
const util = require('./util.js');
const _ = require('underscore');
AWS.config.update({region:'eu-west-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;


exports.handler = async(event) => {
    try{
        let note_id = decodeURIComponent(event.pathParameters.note_id);
        let params = {
            TableName: tableName,
            IndexName: "notes_id-index",
            KeyConditionExpression : "note_id = :note_id",
            ExpressionAttributeValues : {
                ':note_id':note_id
            },
            Limit :1
        };
        let data = await dynamoDB.query(params).promise();
        if(!_.isEmpty(data.Items)){
            return{
                statusCode : 200,
                headers : util.getResponseHeaders(),
                body : JSON.stringify(data.Items[0])
            }
        }else{
            return {
                statusCode :404,
                headers : util.getResponseHeaders()
            }
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
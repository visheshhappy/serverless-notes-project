/**
 * ROute PATCH /note
 */

const AWS = require('aws-sdk');
const util = require('./util.js');
const moment = require('moment');
AWS.config.update({region:'eu-west-1'});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.NOTES_TABLE;


exports.handler = async(event) => {
    try{
        let item = JSON.parse(event.body).Item;
        item.user_id = util.getUserId(event.headers);
        item.user_name = util.getUserName(event.headers);
        item.expires = moment().add(1000,'days').unix();

        let data = await dynamoDB.put({
            TableName : tableName,
            Item: item,
            ConditionExpression : '#t = :t',
            ExpressionAttributeNames:{
                '#t':'timestamp'
            },
            ExpressionAttributeValues : {
                ':t':item.timestamp
            }
        }).promise();

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
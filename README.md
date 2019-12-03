This is a demo project to test serverless framework with AWS

This application creates/updates/reads and delete notes.

The following AWS services are used
1. Lambda
2. DynamoDb
3. API gateway
4. Code deploy
5. code commit
6. cloud pipeline
7. Route 53
8. Certificate manager

I have used a custom domain "visheshhappy.com" to setup apis

Setup CI/CD pipeline and commit the code
U need to install appropriate certificates, set up ns (nameserver) in route53 

use command sls create_domain to create domain using serverless



NOTE : might need to adjust/add some iam policies. I had to configure some iam policies to get this working. Though ideally everything should be managed via serverless.yml file and no manual intervention should be need (except for setting cloud certificates and ns in route 53) and creation of CI/CD.
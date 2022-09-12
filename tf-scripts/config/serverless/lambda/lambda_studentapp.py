import json
import redis
import pymysql


def lambda_handler(event, context):

    try:
        conn = redis.StrictRedis(
            host='studentcluster.1scsfh.clustercfg.use1.cache.amazonaws.com',
            port=6379)

        response = conn.ping()
        if(response):      
            print(' Successfully Connected')
    except Exception as ex:
        print('Error:', ex)
        exit('Failed to connect, terminating.')
        
        
        
    try:
        db = pymysql.connect(
            host='studentappcluster.cluster-ctxroz8ib8s0.us-east-1.rds.amazonaws.com', 
            user='studentadmin', 
            password='Welc0mee123$')
        cursor = db.cursor()
        cursor.execute("select version()")
        data = cursor.fetchone()
        print("data is :", data)
    except Exception as ex:
        print('Error:', ex)
        exit('Failed to connect, terminating.')        


    return {
        'statusCode': 200,
        'body': json.dumps('connected')

    }
    


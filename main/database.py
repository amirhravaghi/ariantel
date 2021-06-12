import pymongo
from bson.objectid import ObjectId
from django.conf import settings

# Database class
class main_db:

    # Database config
    config = {
        "dbhost": settings.MONGO_HOST,
        "dbport": settings.MONGO_PORT,
        "dbuser": settings.MONGO_DB_USER,
        "dbpass": settings.MONGO_DB_PASSWORD,
        "dbname": settings.MONGO_DB_NAME
    }

    # Returns a connection
    def connect(self):
        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        return myclient[self.config['dbname']]

    # Returns an objectId object
    def object_id(self,string_id):
        return ObjectId(string_id)

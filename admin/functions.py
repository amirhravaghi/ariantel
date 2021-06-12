from . import database
from django.conf import settings
import bcrypt
import jwt
import os,sys,uuid
# import database

# App functions
class main_functions:

    # Constructor
    def __init__(self):
        self.db = database.main_db()
        self.con = self.db.connect()

    # Process Nav Menu And Dropdown
    def get_menu(self,section = "personal",lang = "fa"):
        if section == "enterprise":
            parent_id = "60bb3d18543cdbdae3377bec"
        else:
            parent_id = "60bb3d18543cdbdae3377bed"

        col = self.con['menu_items']
        menu_items = list(col.find({"parent": self.db.object_id(parent_id)}))
        category_items = list(self.con['category_items'].find({"sub":False}))
        for i in range(0,len(category_items)):
            if lang == "en":
                category_items[i]['name'] = category_items[i]['en_name']
            sub_items = list(self.con['category_items'].find({"sub":True,"parent":category_items[i]['_id']}))
            for j in range(0,len(sub_items)):
                if lang == "en":
                    sub_items[j]['name'] = sub_items[j]['en_name']
            category_items[i]['sub_items'] = sub_items

        category_items.reverse()
        for i in range(0,len(menu_items)):
            if lang == "en":
                menu_items[i]['name'] = menu_items[i]['en_name']
            menu_items[i]['sub_items'] = []
            for item in category_items:
                if item['parent'] == menu_items[i]['_id']:
                    menu_items[i]['sub_items'].append(item)

        return menu_items

    def media_upload(self,file):
        fn = os.path.basename(str(uuid.uuid4()) + file.name)
        full_address = './main' + settings.STATIC_URL + 'main/media/' + fn
        db_address = "main/media/" + fn
        open(full_address, 'wb').write(file.read())
        return db_address


# Auth functions
class auth:

    def __init__(self):
        self.db = database.main_db()

    # Register
    def register(self,username,passwd,access_lvl,full_name):
        con = self.db.connect()
        col = con['admins']

        hashed_pw = bcrypt.hashpw(passwd.encode('utf-8'),bcrypt.gensalt())

        col.insert_one({
            "username": username,
            "password": hashed_pw,
            "access_level": access_lvl,
            "full_name": full_name
        })

        return True

    # Login
    def login(self,username,passwd):
        try:
            con = self.db.connect()
            col = con['admins']

            admin = col.find_one({'username': username})
            if not admin == "":
                 if bcrypt.checkpw(passwd.encode('utf-8'),admin['password']):
                     token = jwt.encode({
                        "access_lvl": admin['access_level']
                     },settings.JWT_PRIVATE_KEY,algorithm="HS256")

                     return {"token":token,"full_name":admin['full_name']}
            return False
        except:
            return False


    # Check Auth
    def authenticated(self,token):
        try:
            payload = jwt.decode(token,settings.JWT_PRIVATE_KEY,algorithms=["HS256"])
            if payload:
                return True
        except:
            return False


    # Get access level
    def get_access_lvl(self,token):
        payload = jwt.decode(token,settings.JWT_PRIVATE_KEY,algorithms=["HS256"])
        return payload['access_lvl']

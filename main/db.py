import pymongo
from bson.objectid import ObjectId

db_obj = myclient = pymongo.MongoClient("mongodb://localhost:27017/")
con = db_obj['ariantel']

col = con['slides']

col.update_many({},{"$set":{"section":ObjectId("60bb3d18543cdbdae3377bed")}})

# col.insert_one({
#     "fa":{
#         "title": "تفاهم نامه اجرای پروژه های فناوری اطلاعات و ارتباطات در کیش با آرین تل منعقد گردید",
#         "content": "<h1>بخش محتوا</h1>",
#         "date": "شنبه 8 خرداد ماه 1400",
#     },
#     "en":{
#         "title": "xxxxxxx",
#         "content": "<h1>Content part</h1>",
#         "date": "شنبه 8 خرداد ماه 1400",
#     },
#     "image": "https://ariantel.ir/Upload/Images/pic1.jpg"
# })

# col.insert_many([
#     {
#         "fa": {
#             "title": "دائمی",
#             "introduction": "تب ۱",
#             "manual": "تب ۲",
#             "fees": "تب ۳",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/sim-daeemi.png"
#         },
#         "en": {
#             "title": "postpaid",
#             "introduction": "tab 1",
#             "manual": "tab 2",
#             "fees": "tab 3",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/sim-daeemi.png"
#         },
#     },
#     {
#         "fa": {
#             "title": "اعتباری",
#             "introduction": "تب ۱",
#             "manual": "تب ۲",
#             "fees": "تب ۳",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/sim-etebari.png"
#         },
#         "en": {
#             "title": "prepaid",
#             "introduction": "tab 1",
#             "manual": "tab 2",
#             "fees": "tab 3",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/sim-etebari.png"
#         },
#     },
#     {
#         "fa": {
#             "title": "گردشگری",
#             "introduction": "تب ۱",
#             "manual": "تب ۲",
#             "fees": "تب ۳",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/sim%20toorism.png"
#         },
#         "en": {
#             "title": "Tourist",
#             "introduction": "tab 1",
#             "manual": "tab 2",
#             "fees": "tab 3",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/sim%20toorism.png"
#         },
#     },
#     {
#         "fa": {
#             "title": "رند",
#             "introduction": "تب ۱",
#             "manual": "تب ۲",
#             "fees": "تب ۳",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/sim-rond.png"
#         },
#         "en": {
#             "title": "Round",
#             "introduction": "tab 1",
#             "manual": "tab 2",
#             "fees": "tab 3",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/sim-rond.png"
#         },
#     },
#     {
#         "fa": {
#             "title": "دیتاسیم",
#             "introduction": "تب ۱",
#             "manual": "تب ۲",
#             "fees": "تب ۳",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/simdata.png"
#         },
#         "en": {
#             "title": "DataSim",
#             "introduction": "tab 1",
#             "manual": "tab 2",
#             "fees": "tab 3",
#             "image": "https://ariantel.ir/Upload/Images/product/sim/simdata.png"
#         },
#     },
# ])

# menu = list(col.find({}))
# for item in menu:
#     new = {
#         "fa":{
#             "question": item['fa_question'],
#             "answer": item['fa_answer']
#         },
#         "en":{
#             "question": item['en_question'],
#             "answer": item['en_answer']
#         },
#     }
#
#     col.insert_one(new)

# print(menu[0])

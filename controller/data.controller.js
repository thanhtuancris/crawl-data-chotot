let request = require("request");
let Bike = require("../model/bike")
let Noti = require("../model/noti")
var admin = require("firebase-admin");
var serviceAccount = require("../chotot.json");
var moment = require("moment")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chototserver-default-rtdb.firebaseio.com/"
});

let options_firebase = {
    priority: "high",
    timeToLive: 60 * 60 * 24
}
module.exports = {
    cuahang: async function(req, res){
        let check_area = await Noti.find()
        let option = {
            'method': 'GET',
            'url': 'https://gateway.chotot.com/v1/public/ad-listing?o=0&cg=2020&st=s,k&limit=50&key_param_included=true',
            'headers': {
                "Host":'gateway.chotot.com',
                "Connection":'keep-alive',
                "sec-ch-ua":'"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
                "sec-ch-ua-mobile":'?0',
                "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
                "Accept":'*/*',
                "Origin":'https://xe.chotot.com',
                "Sec-Fetch-Site":'same-site',
                "Sec-Fetch-Mode":'cors',
                "Sec-Fetch-User":'empty',
               "Referer":'https://xe.chotot.com/',
                "Accept-Encoding":'',
               "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
            },
        }
        request(option, async function(error, response){
            try{
                if(response){
                    let data = JSON.parse(response.body)
                    data = data.ads
                    let result = []
                    let obj = {
                        account_name: "",
                        date: "",
                        title: "", //data[i].subject
                        description: "", //data[i].body
                        address: "", //data[i].ward_name + data[i].area_name + data[i].region_name
                        province: "", //data[i].region_name
                        price: "",
                        image: "",
                        status: "", //data[i].condition_ad_name
                        phone: "",
                        mileage_v2: "", //data[i].mileage_v2
                        year_registered: "", //data[i].params[0].value
                        type: "", //data[i].params[1].value
                        motorbikebrand: "",
                        motorbikecapacity: "",
                        loaiCH: ""
                    }   
                    
                        for(let i = 0; i < data.length; i++){
                            let rs_time
                            let descript = data[i].body.split("\n").join(".")
                            if(typeof data[i].date !== 'undefined'){
                                let time = data[i].date.split(" ")
                                rs_time = moment(Date.now()).subtract(time[0], 'm').format()
                            }else{
                                rs_time = moment(Date.now()).subtract(1, 'm').format()
                            }
                            if(typeof data[i].shop !== 'undefined'){
                                obj = {
                                    account_name: data[i].account_name,
                                    date: rs_time,
                                    title: data[i].subject,
                                    description: descript,
                                    // province: data[i].region_name.toLowerCase(),
                                    province: data[i].region_name,
                                    image: data[i].image,
                                    status: data[i].condition_ad_name,
                                    phone: data[i].phone,
                                    mileage_v2: data[i].mileage_v2,
                                    loaiCH: "Cửa hàng"
                                }
                                if(typeof data[i].price === 'undefined'){
                                    obj.price = 0
                                }else{
                                    obj.price = data[i].price
                                }
                                if(typeof data[i].ward_name === 'undefined'){
                                    obj.address = data[i].area_name + " - "+ data[i].region_name
                                }else{
                                    obj.address = data[i].ward_name +" - "+ data[i].area_name + " - "+ data[i].region_name
                                }
                                // if(typeof data[i].shop !== 'undefined'){
                                //     obj.loaiCH = "Cửa hàng"
                                // }
                                if(typeof data[i].params[0] === 'undefined'){
                                    obj.year_registered = ""
                                }else{
                                    obj.year_registered = data[i].params[0].value
                                }
                                if(typeof data[i].params[1] === 'undefined'){
                                    obj.type = ""
                                }else{
                                    obj.type = data[i].params[1].value
                                }
                                switch(data[i].motorbikebrand){
                                case 1:
                                    obj.motorbikebrand = "Honda"
                                    break;
                                case 2:
                                    obj.motorbikebrand = "Yamaha"
                                    break;
                                case 3:
                                    obj.motorbikebrand = "Piaggio"
                                    break;
                                case 4:
                                    obj.motorbikebrand = "Suzuki"
                                    break;
                                case 5:
                                    obj.motorbikebrand = "SYM"
                                    break;
                                case 12:
                                    obj.motorbikebrand = "Ducati"
                                    break;
                                case 8:
                                    obj.motorbikebrand = "Benelli"
                                    break;
                                case 17:
                                    obj.motorbikebrand = "Kawasaki"
                                    break;
                                case 35:
                                    obj.motorbikebrand = "Brixton"
                                    break;
                                case 21:
                                    obj.motorbikebrand = "Kymco"
                                    break;
                                case 20:
                                    obj.motorbikebrand = "KTM"
                                    break;
                                default:
                                    obj.motorbikebrand = "Hãng khác"
                                }
                                switch(data[i].motorbikecapacity){
                                    case 1:
                                        obj.motorbikecapacity = "Dưới 50 cc"
                                        break;
                                    case 2:
                                        obj.motorbikecapacity = "50 - 100 cc"
                                        break;
                                    case 3:
                                        obj.motorbikecapacity = "100 - 175 cc"
                                        break;
                                    case 4:
                                        obj.motorbikecapacity = "Trên 175 cc"
                                        break;
                                    default:
                                        obj.motorbikecapacity = "Không biết rõ"
                                }
                                result.push(obj)
                            }
                        }
                         result = result.reverse()
                            res.status(200).json({
                                message: result
                            })
                            return
                        for(let item of result){
                            let rs = await Bike.findOne({isdelete: false, title: item.title})
                                if(rs == null){
                                    let newBike = Bike({
                                        tennguoiban: item.account_name,
                                        image: item.image,
                                        title:item.title,
                                        loaixe: item.type,
                                        gia: item.price,
                                        date: new Date(item.date),
                                        diadiem: item.address,
                                        // province: item.province.toLowerCase(),
                                        province: item.province,
                                        mota: item.description,
                                        hangxe: item.motorbikebrand,
                                        namdangky: item.year_registered,
                                        sokm: item.mileage_v2,
                                        sodt: item.phone,
                                        dungtichxe: item.motorbikecapacity,
                                        loaiCH: item.loaiCH,
                                        trangthai: 1, //1: chua xem, 2: da lien he, 3: da ban, 4: ko nghe may, 5: da xem
                                        ghichu: "", 
                                        isdelete: false,
                                        date_import: new Date(),
                                    })
                                    let a = await newBike.save()
                                    for(let item2 of check_area){
                                        if(item2.arr_city === null){
                                            let messages = {
                                                notification: {
                                                    title: `${item.title}`,
                                                    body: `Giá: ${item.price}. Địa điểm: ${item.address}` 
                                                }
                                            };
                                            admin.messaging().sendToDevice(item2.token, messages, options_firebase)
                                            .then(response => {
                                                console.log("Day thanh cong cua hang!")
                                                console.log("dia chi: "+ item2.arr_city)
                                                console.log("token: "+ item2.token)
                                            })
                                            .catch(error => {
                                                console.log(error);
                                            });
                                        }else
                                        if(item2.arr_city.includes(item.province)){
                                            let messages = {
                                                notification: {
                                                    title: `${item.title}`,
                                                    body: `Giá: ${item.price}. Địa điểm: ${item.address}` 
                                                }
                                            };
                                            admin.messaging().sendToDevice(item2.token, messages, options_firebase)
                                            .then(response => {
                                                console.log("Day thanh cong cua hang!")
                                                console.log("dia chi: "+ item2.arr_city)
                                                console.log("token: "+ item2.token)
                                            })
                                            .catch(error => {
                                                console.log(error);
                                            });
                                        }else{
                                            console.log(item2.arr_city);
                                            console.log(item.province);
                                            console.log(item2.arr_city.includes(item.province));
                                            console.log("loi roi cua hang!");
                                        }
                                    }
                                }
                       }
                }
            }catch(e){
            }
        })
    },
    canhan: async function(req, res){
        let check_area = await Noti.find()
        let option = {
          'method': 'GET',
          'url': 'https://gateway.chotot.com/v1/public/ad-listing?o=0&f=p&cg=2020&st=s,k&limit=50&key_param_included=true',
          'headers': {
              "Host":'gateway.chotot.com',
              "Connection":'keep-alive',
              "sec-ch-ua":'"Chromium";v="88", "Google Chrome";v="88", ";Not A Brand";v="99"',
              "sec-ch-ua-mobile":'?0',
              "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.190 Safari/537.36',
              "Accept":'*/*',
              "Origin":'https://xe.chotot.com',
              "Sec-Fetch-Site":'same-site',
              "Sec-Fetch-Mode":'cors',
              "Sec-Fetch-User":'empty',
             "Referer":'https://xe.chotot.com/',
              "Accept-Encoding":'',
             "Accept-Language":'vi-VN,vi;q=0.9,en-US;q=0.8,en;q=0.7',
          },
      }
      request(option, async function(error, response){
          try{
            if(response){
                let data = JSON.parse(response.body)
                data = data.ads
                let result = []
                let obj = {
                    account_name: "",
                    date: "",
                    title: "", //data[i].subject
                    description: "", //data[i].body
                    address: "", //data[i].ward_name + data[i].area_name + data[i].region_name
                    province: "",
                    price: "",
                    image: "",
                    status: "", //data[i].condition_ad_name
                    phone: "",
                    mileage_v2: "", //data[i].mileage_v2
                    year_registered: "", //data[i].params[0].value
                    type: "", //data[i].params[1].value
                    motorbikebrand: "",
                    motorbikecapacity: "",
                    loaiCH: "Cá nhân"
                }
                    for(let i = 0; i < data.length; i++){
                        let rs_time
                        let descript = data[i].body.split("\n").join(".")
                        if(typeof data[i].date !== 'undefined'){
                            let time = data[i].date.split(" ")
                            rs_time = moment(Date.now()).subtract(time[0], 'm').format()
                        }else{
                            rs_time = moment(Date.now()).subtract(1, 'm').format()
                        }
                        obj = {
                            account_name: data[i].account_name,
                            date: rs_time,
                            title: data[i].subject,
                            description: descript,
                            // province: data[i].region_name.toLowerCase(),
                            province: data[i].region_name,
                            image: data[i].image,
                            status: data[i].condition_ad_name,
                            phone: data[i].phone,
                            mileage_v2: data[i].mileage_v2,
                            loaiCH: "Cá nhân"
                        }
                        if(typeof data[i].price === 'undefined'){
                            obj.price = 0
                        }else{
                            obj.price = data[i].price
                        }
                        if(typeof data[i].ward_name === 'undefined'){
                            obj.address = data[i].area_name + " - "+ data[i].region_name
                        }else{
                            obj.address = data[i].ward_name +" - "+ data[i].area_name + " - "+ data[i].region_name
                        }
                        if(typeof data[i].params[0] === 'undefined'){
                            obj.year_registered = ""
                        }else{
                            obj.year_registered = data[i].params[0].value
                        }
                        if(typeof data[i].params[1] === 'undefined'){
                            obj.type = ""
                        }else{
                            obj.type = data[i].params[1].value
                        }
                        switch(data[i].motorbikebrand){
                          case 1:
                              obj.motorbikebrand = "Honda"
                              break;
                          case 2:
                              obj.motorbikebrand = "Yamaha"
                              break;
                          case 3:
                              obj.motorbikebrand = "Piaggio"
                              break;
                          case 4:
                              obj.motorbikebrand = "Suzuki"
                              break;
                          case 5:
                              obj.motorbikebrand = "SYM"
                              break;
                          case 12:
                              obj.motorbikebrand = "Ducati"
                              break;
                          case 8:
                              obj.motorbikebrand = "Benelli"
                              break;
                          case 17:
                              obj.motorbikebrand = "Kawasaki"
                              break;
                          case 35:
                              obj.motorbikebrand = "Brixton"
                              break;
                          case 21:
                              obj.motorbikebrand = "Kymco"
                              break;
                          case 20:
                              obj.motorbikebrand = "KTM"
                              break;
                          default:
                              obj.motorbikebrand = "Hãng khác"
                        }
                      switch(data[i].motorbikecapacity){
                          case 1:
                              obj.motorbikecapacity = "Dưới 50 cc"
                              break;
                          case 2:
                              obj.motorbikecapacity = "50 - 100 cc"
                              break;
                          case 3:
                              obj.motorbikecapacity = "100 - 175 cc"
                              break;
                          case 4:
                              obj.motorbikecapacity = "Trên 175 cc"
                              break;
                          default:
                              obj.motorbikecapacity = "Không biết rõ"
                      }
                        result.push(obj)
                    }
                    result = result.reverse()
                    res.status(200).json({
                        message: result
                    })
                   for(let item of result){
                        let rs = await Bike.findOne({isdelete: false, title: item.title})
                            if(rs == null){
                                let newBike = Bike({
                                    tennguoiban: item.account_name,
                                    image: item.image,
                                    title:item.title,
                                    loaixe: item.type,
                                    gia: item.price,
                                    date: new Date(item.date),
                                    diadiem: item.address,
                                    // province: item.province.toLowerCase(),
                                    province: item.province,
                                    mota: item.description,
                                    hangxe: item.motorbikebrand,
                                    namdangky: item.year_registered,
                                    sokm: item.mileage_v2,
                                    sodt: item.phone,
                                    dungtichxe: item.motorbikecapacity,
                                    loaiCH: item.loaiCH,
                                    trangthai: 1, //1: chua xem, 2: da lien he, 3: da ban, 4: ko nghe may, 5: da xem
                                    ghichu: "", 
                                    isdelete: false,
                                    date_import: new Date(),
                                })
                                let a = await newBike.save()

                                for(let item2 of check_area){
                                    if(item2.arr_city === null){
                                        let messages = {
                                            notification: {
                                                title: `${item.title}`,
                                                body: `Giá: ${item.price}. Địa điểm: ${item.address}` 
                                            }
                                        };
                                        admin.messaging().sendToDevice(item2.token, messages, options_firebase)
                                        .then(response => {
                                            console.log("Day thanh cong ca nhan!")
                                            console.log("dia chi: "+ item2.arr_city)
                                            console.log("token: "+ item2.token)
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        });
                                    }else
                                    if(item2.arr_city.includes(item.province)){
                                        console.log("dang o day!");
                                        let messages = {
                                            notification: {
                                                title: `${item.title}`,
                                                body: `Giá: ${item.price}. Địa điểm: ${item.address}` 
                                            }
                                        };
                                        admin.messaging().sendToDevice(item2.token, messages, options_firebase)
                                        .then(response => {
                                            console.log("Day thanh cong ca nhan!")
                                            console.log("dia chi: "+ item2.arr_city)
                                            console.log("token: "+ item2.token)
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        });
                                    }else{
                                        console.log(item2.arr_city);
                                        console.log(item.province);
                                        console.log(item2.arr_city.includes(item.province));
                                        console.log("loi roi ca nhan!");
                                    }
                                }
                            }
                   }
            }
          }catch(e){
          }
      })
    },
    getAll: async function(req, res){
        let filter = {
            isdelete: false,
        }
        const perPage = parseInt(req.body.limit);
        const page = parseInt(req.body.page || 1);
        const skip = (perPage * page) - perPage;
        let rs_find = await bike_test.find(filter).skip(skip).limit(perPage).sort({
            date_import: -1
        });
        const totalDocuments = await bike_test.countDocuments(filter);
        const totalPage = Math.ceil(totalDocuments / perPage);
        if (rs_find != null) {
            res.status(200).json({
                message: rs_find,
                totalDocuments: totalDocuments,
                totalPage: totalPage,
            })
        } else {
            res.status(200).json({
                message: "Lỗi! Vui lòng thử lại"
            })
        }
    },
    push_noti_by_area: async function(req, res){
       for(let i = 0; i < 100; i++){
        let token = "c2GmG9hBD0o5jUisaqTnKF:APA91bGLgPtLD51WFiDgtTUEOYINfGJqHzDDwgWaU5kCHFzLrRqzEcHYJNadEbYk_jlHuoe3Tpnz7vlQLYxBj5HCrMI6jyM4yM8nYcxstyE_2v8BcjRGOP907eve-8v-zKakREv-1VlD"
        let messages = {
            notification: {
                title: `title`,
                body: `Giá: . Địa điểm: ` 
            }
        };
        admin.messaging().sendToDevice(token, messages)
        .then(response => {
            console.log("Day thanh cong ca nhan!")
        })
        .catch(error => {
            console.log(error);
        });
       }
    }
}